import { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import './VideoIcons.css';
import ContextAPI from '../ContextAPI/ContextAPI';

function VideoIcons() {

    const [ isVideoOn, setIsVideoOn ] = useState(true);
    const [ isAudioOn, setIsAudioOn ] = useState(true);
    const [ isScreenShare, setIsScreenShare ] = useState(false);
    const { isCode, setIsCode } = useContext(ContextAPI);   
    const [ isStudent, setIsStudent ] = useState(true);

    function handleScreenShare()  {
        if( (isScreenShare === false) && (isVideoOn === true)){
            setIsVideoOn(false);
        }
        setIsScreenShare(!isScreenShare);
    }

    return (
        <div className="videoicons-wrapper">

            { 
                (isStudent)?(
                    <ul className="videoicons">
                        <Button onClick={ () => setIsVideoOn(!isVideoOn) } > {(isVideoOn)?"V Active":"V Disable" } </Button>
                        <Button onClick={ () => setIsAudioOn(!isAudioOn) } > {(isAudioOn)?"A Active":"A Disable" } </Button>
                        <Button onClick={ () => setIsCode(!isCode) } >Code</Button>
                        <Button >Call</Button>
                    </ul>
                ):(
                    <ul className="videoicons">
                        <Button onClick={ () =>  handleScreenShare()} > {(isScreenShare)?"Sharing":"Not Sharing" } </Button>
                        <Button onClick={ () => setIsVideoOn(!isVideoOn) } > {(isVideoOn)?"V Active":"V Disable" } </Button>
                        <Button onClick={ () => setIsAudioOn(!isAudioOn) } > {(isAudioOn)?"A Active":"A Disable" } </Button>
                        <Button onClick={ () => setIsCode(!isCode) } >Code</Button>
                        <Button >Call</Button>
                    </ul>
                )
            }
            
        </div>
    );
}

export default VideoIcons;