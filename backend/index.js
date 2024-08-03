const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
// const WebSocket = require("ws");

require("./config/db");
dotenv.config();

const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });
const {Server} = require("socket.io");
const io = new Server(server)

const User = require("./routes/User");

app.use("/user", User);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let roomIdGlobal,imgURLGlobal;

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, roomId, userId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    socket.emit("userIsJoined", { success: true });
    socket.broadcast.to(roomId).emit("whiteboardDataResponse", { imgURL: imgURLGlobal });
  })

  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteboardDataResponse", { imgURL: data });
  })
})


// const rooms = {}; 
// wss.on("connection", (ws) => {
//   console.log("A user connected");

//   ws.on("message", (message) => {
//     try {
//       const data = JSON.parse(message);
//       console.log(data);
//       switch (data.type) {
//         case "userJoined":
//           const { name, roomId, userId, host, presenter } = data;

//           if (!rooms[roomId]) {
//             rooms[roomId] = { imgURL: "" };
//           }

//           ws.roomId = roomId;
//           ws.userId = userId;
//           ws.name = name;

//           ws.send(JSON.stringify({ type: "userIsJoined", success: true }));
//           broadcastToRoom(roomId, JSON.stringify({ type: "userJoinedNotification", userId, name }), ws);

//           if (rooms[roomId].imgURL) {
//             ws.send(JSON.stringify({ type: "whiteboardDataResponse", imgURL: rooms[roomId].imgURL }));
//           }
//           break;

//         case "whiteboardData":
//           if (ws.roomId) {
//             rooms[ws.roomId].imgURL = data.imgURL;
//             broadcastToRoom(ws.roomId, JSON.stringify({ type: "whiteboardDataResponse", imgURL: data.imgURL }), ws);
//           }
//           break;

//         default:
//           console.log("Unknown message type:", data);
//           break;
//       }
//       console.log(rooms);
      
//     } catch (error) {
//       console.error("Error handling message:", error);
//     }
//   });

//   ws.on("close", () => {
//     console.log("A user disconnected");
    
//   });

//   ws.on("error", (error) => {
//     console.error("WebSocket error:", error);
//   });
// });

// const broadcastToRoom = (roomId, data, sender) => {
//   wss.clients.forEach((client) => {
//     if (client !== sender && client.readyState === WebSocket.OPEN && client.roomId === roomId) {
//       client.send(data);
//     }
//   });
// };

const PORT = process.env.PORT ;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
