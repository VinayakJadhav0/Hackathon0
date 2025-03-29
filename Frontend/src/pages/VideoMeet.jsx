import React, { useEffect, useRef, useState } from "react"
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import CallEnd from '@mui/icons-material/CallEnd'
import io from "socket.io-client";

import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'

import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'

import server from "../environment"

import Navbar from '../components/Navbar/Navbar';
import '../styles/VideoMeet.css';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';



const server_url=server;

var connections={};


const peerConfigConnections = {
    "iceServers": [
        { "urls":"stun:stun.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent(){

    var socketRef=useRef();
    let socketIdRef=useRef();
    let localVideoRef=useRef();
    let [videoAvailabel,setVideoAvailabel]=useState(true);
    let [audioAvailabel,setAudioAvailabel]=useState(true);
    let [video,setVideo]=useState([]);
    let [audio,setAudio]=useState();
    let [screen,setScreen]=useState();
    let [showModal,setModal]=useState(true);
    let [screenAvailabel,setScreenAvailabel]=useState();
    let [messages,setMessages]=useState([]);
    let [message,setMessage]=useState("")
    let [newMessages,setNewMessages]=useState(0);
    let [askForUserName,setAskForUsername]=useState(true);
    let [username,setUsername]=useState();
    const videoRef=useRef([]);
    let [videos,setVideos]=useState([]);
    let [ isCodeRead, setIsCodeRead ] = useState(false);

    const getPermissions=async()=>{
        try {
            const videoPermission=await navigator.mediaDevices.getUserMedia({video:true})
            console.log("Video Permission",videoPermission)
            if(videoPermission){
                setVideoAvailabel(true)
            }else{
                setVideoAvailabel(false)
            }

            const audioPermission=await navigator.mediaDevices.getUserMedia({audio:true})

            console.log("audio Permission",audioPermission);

            if(audioPermission){
                setAudioAvailabel(true)
            }else{
                setAudioAvailabel(false)
            }

            if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvailabel(true)
            }else{
                setScreenAvailabel(false)

            }

            if (videoAvailabel || audioAvailabel) {
                 const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailabel, audio: audioAvailabel });
                 console.log("User Media Stream",userMediaStream)
                    if(userMediaStream){
                        window.localStream=userMediaStream;
                        if(localVideoRef.current){
                            localVideoRef.current.srcObject=userMediaStream
                        }
                    }
            }

            


        } catch (error) {
            setVideoAvailabel(false);
            setAudioAvailabel(false);
            console.log(error)
        }
    }

    useEffect(()=>{
        getPermissions();
    },[])

    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoRef.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                console.log("Here Is Description In GetUserMediaSuccess",description)
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            for (let id in connections) {
                connections[id].addStream(window.localStream)

                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => {
                            socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                        })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let getUserMedia = () => {

        console.log("Here Is Video",video)

        if ((video && videoAvailabel) || (audio && audioAvailabel)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess)
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { }
        }
    }

    useEffect(()=>{

        console.log("i am in use effect")

        if(video!==undefined&&audio!==undefined){
            getUserMedia()

            console.log("SET STATE HAS ", video , audio)
        }
    },[video,audio])

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href)
            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                clients.forEach((socketListId) => {

                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    // Wait for their ice candidate       
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    // Wait for their video stream
                    connections[socketListId].onaddstream = (event) => {
                        console.log("BEFORE:", videoRef.current);
                        console.log("FINDING ID: ", socketListId);

                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);

                        if (videoExists) {
                            console.log("FOUND EXISTING");

                            // Update the stream of the existing video
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.stream } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            // Create a new video
                            console.log("CREATING NEW");
                            let newVideo = {
                                socketId: socketListId,
                                stream: event.stream,
                                autoplay: true,
                                playsinline: true
                            };

                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };

                    // Add the local video stream
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream)
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription }))
                                })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })
        })
    }

    let getMedia=()=>{
        setVideo(videoAvailabel)
        setAudio(audioAvailabel)
        connectToSocketServer()
    }

    let connect=()=>{
        setAskForUsername(false)
        getMedia();
    }

    ///Display Code

    let handleVideo=()=>{
        setVideo(!video)
    }

    let handleAudio=()=>{
        setAudio(!audio)
    }

    useEffect(()=>{
        if(screen!==undefined){
            getDislayMedia();

        }
    },[screen])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    let handleScreen=()=>{
        setScreen(!screen)
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        console.log(socketRef.current);
        socketRef.current.emit('chat-message', message, username)
        setMessage("");

        // this.setState({ message: "", sender: username })
    }

    //let routeTo=useNavigate()

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        window.location.href = "/"
    }

    //code editor
    const [code, setCode] = useState('// Start coding...');
  
    // Handle code change in editor
    const handleEditorChange = (value) => {
      setCode(value);
    };

    

    return(
        <div className="video-meet-wrapper" >
            <Navbar />
            { askForUserName===true?
                <div className="lobby" >
                    <h2>Enter Into Lobby</h2>
                    <div className="trial-video-section" >
                        <video id="trial-video" ref={localVideoRef} autoPlay muted></video>
                    </div>
                    <div className="connect">
                        <TextField id="outlined-basic" label="username" onChange={e=>setUsername(e.target.value)} variant="outlined" />
                        <Button variant="contained" onClick={connect}>Connect</Button>
                    </div>
                </div>:
                <div >
                    <div className="interface">
                    <div className="meeting-videos">
                        <div className='video-display'>
                                    { videos.map((video) => (
                                        <div key={video.socketId} className="video-display-stream" >
                                            <video
                                                id="video1"
                                                data-socket={video.socketId}
                                                ref={ref => {
                                                    if (ref && video.stream) {
                                                        ref.srcObject = video.stream;
                                                    }
                                                }}
                                                autoPlay
                                            >
                                            </video>
                                        </div>

                                    ))}

                        </div>
                        <video id="self-video" ref={localVideoRef} autoPlay muted></video>
                    </div>
                    { showModal ? 
                        <div className='code-display'>
                            <div>
                                <h1>Write Code Here...</h1>
                                { 
                                    (isCodeRead)?(
                                        <div className="code-reader" >
                                    { messages.length !== 0 ? messages.map((item, index) => {
                                        console.log(messages)
                                        return (
                                            <CodeMirror
                                            key={index}
                                            value={item.data}
                                            height="400px"
                                            theme={oneDark}
                                            extensions={[javascript(), python()]}
                                            className="w-full border rounded-xl shadow-md p-2 bg-gray-100"
                                          />
                                        )
                                    }) : (
                                        <CodeMirror
                                            key={'No Code Provided...'}
                                            value={item.data}
                                            height="500px"
                                            theme={oneDark}
                                            extensions={[javascript(), python()]} 
                                            className="w-full border rounded-xl shadow-md p-2 bg-gray-100"
                                          />
                                    )
                                    }
                                </div>
                                    ):(
                                        <div>
                                <div className="w-full h-full p-4">
                                  <CodeMirror
                                    value={message}
                                    height="500px"
                                    theme={oneDark}
                                    extensions={[javascript(), python()]}
                                    onChange={(e) => setMessage(e.target.value)} 
                                    className="w-full border rounded-xl shadow-md p-2 bg-gray-100"
                                  />
                                </div>
                                    {/* <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" /> */}
                                    <Button variant='contained' onClick={sendMessage}>Send</Button>
                                </div>
                                    )
                                }
                                  
                            </div>
                        </div> : <></>}
                        
                    </div>
                    <div className='buttons'>
                        <IconButton onClick={handleVideo} style={{color:"white",fontSize:"32px"}}>
                            {(video===true)?<VideocamIcon/>:<VideocamOffIcon/>}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{color:"red",fontSize:"32px"}}>
                            <CallEnd/>
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{color:"white",fontSize:"32px"}}>
                            {(audio===true)?<MicIcon/>:<MicOffIcon/>}
                        </IconButton>
                        {screenAvailabel === true ?
                                <IconButton onClick={handleScreen}  style={{ color: "white" }}>
                                    {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                                </IconButton> : <></>}
                        
                        <Badge  color="secondary">
                            <IconButton onClick={()=>setModal(!showModal)} style={{color:"white",fontSize:"32px"}}>
                                <ChatIcon/>
                            </IconButton>
                        </Badge>
                    </div>


                </div>
            
            }

        </div>
    )
}

