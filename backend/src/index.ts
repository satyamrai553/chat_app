import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    roomId: string;
}

const allSocket: User[] = [];

wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        try {
           
            const messageString = message.toString();
            
            try {
                const parsedMessage = JSON.parse(messageString);

                if (parsedMessage.type === "join") {
                    allSocket.push({
                        socket,
                        roomId: parsedMessage.payload.roomId
                    });
                    socket.send(JSON.stringify({ type: "system", message: "Joined room successfully" }));
                }

                if (parsedMessage.type === "chat") {
                    const currentUserSocket = allSocket.find((x) => x.socket === socket);
                    const currentUserRoom = currentUserSocket?.roomId;

                    allSocket.forEach((user) => {
                        if (user.roomId === currentUserRoom && user.socket !== socket) {
                            user.socket.send(JSON.stringify({
                                type: "chat",
                                payload: {
                                    message: parsedMessage.payload.message
                                }
                            }));
                        }
                    });
                }
            } catch (e) {
            
                const currentUserSocket = allSocket.find((x) => x.socket === socket);
                const currentUserRoom = currentUserSocket?.roomId;

                allSocket.forEach((user) => {
                    if (user.roomId === currentUserRoom && user.socket !== socket) {
                        user.socket.send(JSON.stringify({
                            type: "chat",
                            payload: {
                                message: messageString
                            }
                        }));
                    }
                });
            }
        } catch (error) {
            console.error("Error handling message:", error);
        }
    });

    socket.on('close', () => {
        const index = allSocket.findIndex((x) => x.socket === socket);
        if (index !== -1) {
            allSocket.splice(index, 1);
        }
    });
}); 