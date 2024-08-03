import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface CreateProps {
  uuid: () => string;
  // ws: WebSocket | null;
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

const Create: React.FC<CreateProps> = ({ uuid, socket, setUser }) => {
  const [id, setId] = useState<string>(uuid());
  const [name, setName] = useState<string>('');
  const navigate = useNavigate();

  const handleRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const roomData: User = {
      name,
      roomId: id,
      userId: uuid(),
      host: true,
      presenter: true,
    };

    setUser(roomData);
    navigate(`/${roomData.roomId}`);
    
    socket.emit('userJoined', roomData);
    // if (ws) {
    //   ws.send(JSON.stringify({ type: 'createRoom', ...roomData }));
    // } else {
    //   console.error('WebSocket connection is not established.');
    // } console.log(roomData);
  };

  return (
    <form className="form col-12 col-md-14 col-lg-12 mx-auto mt-5 p-4  rounded-3" onSubmit={handleRoom}>
      <div className="form-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group border  rounded-3 p-3 mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control border-0"
            disabled
            value={id}
            placeholder="Enter Room Id"
          />
        </div>
        <div className="mt-2">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={() => setId(uuid())}
          >
            Create
          </button>
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => navigator.clipboard.writeText(id)}
          >
            Copy
          </button>
        </div>

      </div>
      <button
        type="submit"
        className="btn btn-primary w-100 mt-4"
      >
        Create Room
      </button>
    </form>

  );
};

export default Create;
