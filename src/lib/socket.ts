import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3008";

let socket: Socket | null = null;

export function getSocket(): Socket {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false, // Don't connect until explicitly told to
            withCredentials: true,
        });
    }
    return socket;
}

export function connectSocket(token: string) {
    const s = getSocket();
    // Pass the JWT token for authentication on the WebSocket
    s.auth = { token };
    s.connect();
    return s;
}

export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}
