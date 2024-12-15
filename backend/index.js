import { Server } from 'socket.io';

const io = new Server();

io.on("connection", (socket) => {
    console.log(socket)
  });
  
  io.listen(3000,()=>{
    console.log("server is listening on port 3000");
    
  });