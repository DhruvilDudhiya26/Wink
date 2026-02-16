import express from "express"
import http from "http"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./src/config/db.js";
import routes from "./src/routes/index.js";
import { initializeSocket } from "./src/socket/socket.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());


app.get("/", (req, res) => {
    res.send("Server is running")
})
app.use("/api", routes)
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// listed to socket 
initializeSocket(server)

connectDB()
    .then(() => {
        server.listen(port, () => {
            console.log("Server is running on port", port);
        })
    }).catch((error) => {
        console.log("Failed to start server due to database connection error ", error)
    });
