import React from "react";
import { Container, Typography, Button, Grid, Card, CardContent, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";
import Navbar from "./Navbar"

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      minHeight: "100vh",
      width: "100vw",
      background: "linear-gradient(to right, #1e3c72, #2a5298)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      color: "white",
      py: 4,
    }}>
      <Navbar />
      <Container maxWidth="md" sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}>
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          Welcome to <span style={{ color: "#ffcc00" }}>PREPiN</span>
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 3 }}>
          Your ultimate platform to prepare for interviews with expert guidance.
        </Typography>
        <Button
          variant="contained"
          sx={{
            mt: 2,
            px: 5,
            py: 1.5,
            fontSize: "1.2rem",
            backgroundColor: "#ffcc00",
            color: "black",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            borderRadius: "25px",
            '&:hover': { backgroundColor: "#e6b800", boxShadow: "0px 8px 20px rgba(0,0,0,0.4)" },
          }}
          onClick={() => navigate("/interview")}
        >
          Get Started
        </Button>

        <Grid container spacing={3} sx={{ mt: 5, justifyContent: "center" }}>
          {[{ title: "Expert Interviewers", desc: "Get trained by industry professionals." },
            { title: "Real Mock Interviews", desc: "Simulate real-world interview experiences." },
            { title: "Personalized Feedback", desc: "Receive constructive feedback to improve." },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{
                height: "100%",
                width: "70%",
                textAlign: "center",
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(5px)",
                color: "white",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                borderRadius: "20px",
                '&:hover': { transform: "scale(1.05)", boxShadow: "0px 4px 15px rgba(255, 255, 255, 0.3)", borderRadius: "25px" },
              }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="#ffcc00">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{
        width: "100%",

        backgroundColor: "rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        py: 2,
        mt: 7,
      }}>
        <Typography variant="body2" color="white">
          &copy; {new Date().getFullYear()} PREPiN. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default MainPage;