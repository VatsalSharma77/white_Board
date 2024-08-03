import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface JoinProps {
  uuid: () => string;
  socket: Socket;
  setUser: (user: User) => void;
}

interface User {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

const Join: React.FC<JoinProps> = ({ uuid, socket, setUser }) => {
  const [roomId, setRoomId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();

  const handleJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomData: User = {
      name,
      roomId,
      userId: uuid(),
      host: false,
      presenter: false,
    };

    setUser(roomData);
    navigate(`/${roomData.roomId}`);
    socket.emit('userJoined', roomData);

    
  };

  return (
    <form className="form col-12 col-md-10 col-lg-8 mx-auto mt-5 p-4 border w-100  rounded-3" onSubmit={handleJoin}>
      <div className="form-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Room Code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 mt-4"
      >
        Join Room
      </button>
    </form>

  );
};

export default Join;
