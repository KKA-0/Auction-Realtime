import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const initSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected");
        console.log(`Socket ${socket.id} is ready and running`);


        socket.on("disconnect", () => {
            console.log(`User disconnected, socket ID: ${socket.id}`);
        });
    });

    return io;
};
