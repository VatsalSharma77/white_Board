import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Room from './pages/Room/Room';
import Forms from './components/forms/forms';
import Home from './pages/Home/Home';
import LogIn from './pages/User/Login';
import Register from './pages/User/register';
import PrivateRoute from './components/PrivateRoute';
import { io, Socket } from 'socket.io-client';

const serverUrl = "http://localhost:5000";

const connection = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
}

const socket: Socket = io(serverUrl, connection);




interface User {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {

    socket.on("userIsJoined", (data) => {
      if(data.success) {
        console.log("User is joined");
      } else {
        console.log("User is not joined");
      }
    })

    // const handleUserJoined = (data: { success: boolean }) => {
    //   if (data.success) {
    //     console.log("User is joined");
    //   } else {
    //     console.log("User is not joined");
    //   }
    // };

    // socket.on("userIsJoined", handleUserJoined);

    // return () => {
    //   socket.off("userIsJoined", handleUserJoined);
    // };
  }, []);

  // const [ws, setWs] = useState<WebSocket | null>(null);

  // useEffect(() => {
  //   const newWs = new WebSocket(serverUrl);
  //   setWs(newWs);

  //   console.log(newWs);
    

  //   newWs.onopen = () => {
  //     console.log("Connected to the server");
  //   };

  //   newWs.onmessage = (event) => {
  //     const data = JSON.parse(event.data);

  //     switch (data.type) {
  //       case "userIsJoined":
  //         console.log("User is joined", data.success);
  //         break;
  //       default:
  //         console.log("Received unknown message type:", data);
  //     }
  //   };

  //   newWs.onclose = () => {
  //     console.log("Disconnected from the server");
  //   };

  //   return () => {
  //     if (newWs.readyState === WebSocket.OPEN) {
  //       newWs.close();
  //     }
  //   }
  //   }, []);


  const uuid = (): string => {
    const S4 = (): string => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  };

  return (
    <div className="container">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Forms uuid={uuid} socket={socket} setUser={setUser}
            />
          </PrivateRoute>} />
        <Route path="/:roomId" element={<PrivateRoute><Room user={user} socket={socket} /> </PrivateRoute>} />
        <Route path="login" element={<LogIn />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </div>
  );
};

export default App;
