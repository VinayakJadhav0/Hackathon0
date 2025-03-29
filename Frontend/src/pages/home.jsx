import React, { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button, TextField, Card, CardContent, Typography } from '@mui/material';
import "../App.css";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "./Navbar";

function HomeComponent() {

    let navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode);
        navigate(`/${meetingCode}`);
    }

    return (
        <>
            <Navbar />

            <div className="meetContainer">
                <div className="leftPanel" >
                    <Card className="termsCard" sx={{ mt: 4, mx: "auto", width: "100%", padding: "20px",borderRadius:"2.5rem",backgroundColor:"skyblue"}}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Terms and Conditions for Candidates
                            </Typography>
                            <Typography variant="body1" paragraph>
                                1. Please ensure you have a stable internet connection during the interview.<br/>
                                2. The interview session will be recorded for evaluation purposes.<br/>
                                3. Be on time and prepared for any technical questions you might face.<br/>
                                4. Ensure your video and microphone are working before joining the call.<br/>
                                5. Respect the interviewer and communicate clearly and professionally.
                            </Typography>
                            <Typography variant="h6" gutterBottom>
                                Technical Interview Tips
                            </Typography>
                            <Typography variant="body2">
                                - Focus on writing clean, efficient code.<br/>
                                - Explain your thought process clearly while solving problems.<br/>
                                - Be prepared with data structures and algorithms fundamentals.<br/>
                                - Practice common interview questions related to the role.<br/>
                                - Stay calm and manage your time effectively during problem-solving tasks.
                            </Typography>
                        </CardContent>
                    </Card>
                </div>

                <div className="rightPanel" >
                    <img style={{borderRadius:"2.5rem"}} srcSet='/logo3.png' alt="Logo" />
                </div>
            </div>

            <div className="placeholder">
                <h2>Providing Quality Video Call Just Like Quality Education</h2>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <TextField 
                        label="Enter Meeting Code" 
                        variant="outlined" 
                        onChange={e => setMeetingCode(e.target.value)} 
                    />
                    <Button 
                        onClick={handleJoinVideoCall} 
                        variant="contained"
                    >
                        Join Call
                    </Button>
                </div>
            </div>
        </>
    )
}

export default HomeComponent;
