import React from 'react';
import Create from './createRoom/Create';
import './forms.css';
import Join from './joinRoom/Join';
import { Socket } from 'socket.io-client';

interface User {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

interface FormsProps {
  uuid: () => string;
  socket: Socket;

  setUser: (user: User) => void;
}

const Forms: React.FC<FormsProps> = ({ uuid, socket, setUser }) => {
  return (
    <div className="container h-100 pt-5">
      <div className="row h-100 justify-content-center">
        <div className="col-12 col-md-4 mb-4 mb-md-0 d-flex flex-column align-items-center">
          <div className="form-box p-3 rounded-2 w-100">
            <h1 className="text-primary fw-bold text-center">Create Room</h1>
            <Create uuid={uuid} socket={socket} setUser={setUser} />
          </div>
        </div>
        <div className="col-12 col-md-4 d-flex flex-column align-items-center">
          <div className="form-box p-3 rounded-2 w-100">
            <h1 className="text-primary fw-bold text-center">Join Room</h1>
            <Join uuid={uuid} socket={socket} setUser={setUser} />
          </div>
        </div>
      </div>
    </div>

  );
};

export default Forms;
