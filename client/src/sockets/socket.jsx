import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000");

export default function socketcom() {

    useEffect(() => {
    
        return () => {
          socket.disconnect();
        };
    
    }, []);
}
