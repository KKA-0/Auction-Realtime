// socket.ts
import { Server } from "socket.io";
import { Server as HttpServer } from "http"; // Import the HTTP server type
import express from 'express';
const app = express();

export const initSocket = (httpServer: HttpServer) => { // Specify the type here
    const io = new Server(httpServer, {
        cors: {
            origin: "*",  // Adjust according to your requirements
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected"); // Log when a user connects
        console.log(`Socket ${socket.id} is ready and running`); // Log the socket ID

        // Add your socket event handlers here

        socket.on("disconnect", () => {
            console.log(`User disconnected, socket ID: ${socket.id}`); // Log when a user disconnects
        });
    });

    // Return the io instance if needed
    return io;
};
