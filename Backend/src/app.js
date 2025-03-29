import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const clientId = 'fa45dd1adc25ad3054c6ed94454bb25c'; // Replace with your JDoodle Client ID
const clientSecret = '2fbff163d778af6282ed3a4b5a6a31604428e5f607d8e00adea4c213efa6a1ac'; // Replace with your JDoodle Client Secret

import axios from "axios"

app.use(express.json()); 

// Enable CORS to allow requests from your frontend
app.use(cors({
  origin: 'http://localhost:5173', // Replace with the origin of your frontend
}));

app.post('/run-code', async(req, res) => {
  const { code } = req.body; // Extract code from the request body
  console.log('Received code:', code);

  try {
    // Make request to JDoodle API
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: clientId,
      clientSecret: clientSecret,
      script: code,
      language: "python",
      versionIndex: '3' // Choose version based on language
    });

    // Render the result along with the editor page
    res.json({ output: response.data.output });
  } catch (error) {
    console.error('Error executing code:', error);
    res.json({ output: 'Error running the code. Please try again.' });
  }
});

app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
    app.set("mongo_user")
    const connectionDb = await mongoose.connect("mongodb+srv://pranavtelvekar:ESret7K2y1f9Az03@cluster0.sezpuqk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

    console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("LISTENIN ON PORT 8000")
    });
}



start();