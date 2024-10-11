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
        console.log(`Socket ${socket.id} is ready and running`);

        socket.on('bid', (bid) => {
            const {productId, userId, price, username} = bid
            console.log(bid);
            io.emit('bid', {productId, userId, price, username});
        });

        socket.on('newProd', (newProd) => {
            const { _id, Name, Image, Price, Bidders } = newProd
            console.log(newProd);
            io.emit('newProd', { _id, Name, Image, Price, Bidders });
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected, socket ID: ${socket.id}`);
        });
    });

    return io;
};
