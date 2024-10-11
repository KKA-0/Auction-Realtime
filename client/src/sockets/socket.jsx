import { useEffect } from "react";
import { io } from "socket.io-client";

export const socket = io(`${import.meta.env.VITE_APP_DOMAIN}`);

export default function socketcom() {

    useEffect(() => {
    
        return () => {
          socket.disconnect();
        };
    
    }, []);
}
