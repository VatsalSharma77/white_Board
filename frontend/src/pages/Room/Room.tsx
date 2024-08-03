import React, { useEffect, useRef, useState } from "react";
import "./Room.css";
import White from "../../components/whiteboard/White";
import jsPDF from "jspdf";
import { Socket } from "socket.io-client";

interface User {
    name: string;
    roomId: string;
    userId: string;
    host: boolean;
    presenter: boolean;
}

interface RoomProps {
    user: User | null;
    socket: Socket;
}

const Room: React.FC<RoomProps> = ({ user, socket }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

    const [tools, setTools] = useState<string>("pencil");
    const [color, setColor] = useState<string>("black");
    const [element, setElement] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [brushSize, setBrushSize] = useState<number>(2);
    
    // useEffect(() => {
    //     if (ws) {
    //       ws.onmessage = (event) => {
    //         const message = JSON.parse(event.data);
    //         if (message.type === 'whiteboardData') {
    //           setElement(message.data);
    //         }
    //       };
    //     }
    //   }, [ws]);


    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        setElement([]);
        // if (ws) {
        //     ws.send(JSON.stringify({ type: 'clearBoard' }));
        //   }
    };

    const handleUndo = () => {
        if (element.length > 0) {
            setHistory((prev) => [...prev, element[element.length - 1]]);
            setElement((prev) => prev.slice(0, -1));
        }
        // if (ws) {
        //     ws.send(JSON.stringify({ type: 'whiteboardData', data: element }));
        //   }
    };

    const handleRedo = () => {
        if (history.length > 0) {
            setElement((prev) => [...prev, history[history.length - 1]]);
            setHistory((prev) => prev.slice(0, -1));
        }
        // if (ws) {
        //     ws.send(JSON.stringify({ type: 'whiteboardData', data: element }));
        //   }
    };



    const saveAsPDF = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataURL = canvas.toDataURL("image/png");
            const pdf = new jsPDF("landscape");
            pdf.addImage(dataURL, "PNG", 0, 0, canvas.width / 10, canvas.height / 10);
            pdf.save("whiteboard.pdf");
        }
    };
    return (
        <div className="row">
    <h1 className="text-center py-5">White Board</h1>
    {user?.host && (
        <div className="col-12 col-md-10 px-5 mt-2 mb-3">
            <div className="row align-items-center">
                <div className="col-md-3 d-flex align-items-center gap-2">
                    <div className="d-flex gap-2">
                        <label htmlFor="pencil">Pencil</label>
                        <input
                            type="radio"
                            name="tools"
                            id="pencil"
                            value="pencil"
                            checked={tools === "pencil"}
                            onChange={(e) => setTools(e.target.value)}
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <label htmlFor="line">Line</label>
                        <input
                            type="radio"
                            name="tools"
                            id="line"
                            value="line"
                            checked={tools === "line"}
                            onChange={(e) => setTools(e.target.value)}
                        />
                    </div>
                    <div className="d-flex gap-2">
                        <label htmlFor="rectangle">Rectangle</label>
                        <input
                            type="radio"
                            name="tools"
                            id="rectangle"
                            value="rectangle"
                            checked={tools === "rectangle"}
                            onChange={(e) => setTools(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3 d-flex align-items-center gap-2">
                    <label htmlFor="color">Color:</label>
                    <input
                        type="color"
                        id="color"
                        className="ms-2"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                    />
                </div>
                <div className="col-md-4 d-flex gap-2 align-items-center">
                    <button
                        className="btn btn-primary"
                        disabled={element.length === 0}
                        onClick={handleUndo}
                    >
                        Undo
                    </button>
                    <button
                        className="btn btn-outline-primary"
                        disabled={history.length === 0}
                        onClick={handleRedo}
                    >
                        Redo
                    </button>
                    <button
                        className="btn btn-secondary"
                        disabled={brushSize === 1}
                        onClick={() => setBrushSize((prev) => Math.max(prev - 1, 1))}
                    >
                        -
                    </button>
                    <span className="mx-2">Size-{brushSize}</span>
                    <button
                        className="btn btn-secondary"
                        disabled={brushSize === 10}
                        onClick={() => setBrushSize((prev) => Math.min(prev + 1, 10))}
                    >
                        +
                    </button>
                </div>
                <div className="col-md-2 d-flex gap-1">
                    <button className="btn btn-danger" onClick={handleClear}>
                        Clear
                    </button>
                    <button className="btn btn-info" onClick={saveAsPDF}>
                        Save as PDF
                    </button>
                </div>
            </div>
        </div>
    )}
    <div className="col-12 col-md-10 mx-auto mt-4 canvas-box">
        <White
            canvasRef={canvasRef}
            ctxRef={ctxRef}
            element={element}
            setElement={setElement}
            tools={tools}
            color={color}
            user={user}
            socket={socket}
            brushSize={brushSize}
        />
    </div>
</div>

    );
};

export default Room;
