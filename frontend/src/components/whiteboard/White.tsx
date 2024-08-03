import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Socket } from "socket.io-client";

const roughGenerator = rough.generator();

interface Element {
  type: string;
  offsetX: number;
  offsetY: number;
  width?: number;
  height?: number;
  path?: [number, number][];
  stroke: string;
}

interface User {
  name: string;
  roomId: string;
  userId: string;
  host: boolean;
  presenter: boolean;
}

interface WhiteProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  ctxRef: React.MutableRefObject<CanvasRenderingContext2D | null>;
  setElement: React.Dispatch<React.SetStateAction<Element[]>>;
  element: Element[];
  tools: string;
  color: string;
  brushSize: number;
  user: User | null;
  socket: Socket;
}

const White: React.FC<WhiteProps> = ({
  canvasRef,
  ctxRef,
  setElement,
  element,
  tools,
  color,
  user,
  brushSize,
  socket
}) => {
  const [img, setImg] = useState<string>("");
  const [draw, setDraw] = useState<boolean>(false);

  useEffect(() => {
    socket.on("whiteboardDataResponse", (data) => {
      setImg(data.imgURL);
    });


  }, [socket]);



  useEffect(() => {

    if (img) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.src = img;
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
        };
      }
    }
  }, [img]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.height = window.innerHeight * 2;
      canvas.width = window.innerWidth * 2;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = color;
        ctx.lineWidth = brushSize;
        // console.log("Set line width:", ctx.lineWidth);
        ctx.lineCap = "round";
        ctxRef.current = ctx;
      }
    }
  }, [ctxRef, canvasRef, color, brushSize]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
    }
  }, [color]);

  useLayoutEffect(() => {
    if (canvasRef.current && ctxRef.current) {
      const roughCanvas: RoughCanvas = rough.canvas(canvasRef.current);
      if (element.length > 0) {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      element.forEach((e) => {
        if (e.type === "pencil" && e.path) {
          roughCanvas.linearPath(e.path, {
            stroke: e.stroke,
            strokeWidth: brushSize,
            roughness: 0,
          });
        } else if (e.type === "line") {
          roughCanvas.draw(
            roughGenerator.line(e.offsetX, e.offsetY, e.width!, e.height!, {
              stroke: e.stroke,
              strokeWidth: brushSize,
              roughness: 0,
            })
          );
        } else if (e.type === "rectangle") {
          roughCanvas.draw(
            roughGenerator.rectangle(e.offsetX, e.offsetY, e.width!, e.height!, {
              stroke: e.stroke,
              strokeWidth: brushSize,
              roughness: 0,
            })
          );
        }
      });
      const canvasImg = canvasRef.current.toDataURL();
      socket.emit("whiteboardData", canvasImg);
      // if (ws) {
      //   const canvasImg = canvasRef.current.toDataURL();
      //   ws.send(JSON.stringify({ type: 'whiteboardData', imgURL: canvasImg }));
      //   console.log(canvasImg);

      // }
    }
  }, [element, canvasRef, ctxRef, brushSize]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tools === "pencil") {
      setElement((prev) => [
        ...prev,
        {
          type: "pencil",
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
        },
      ]);
    } else if (tools === "line") {
      setElement((prev) => [
        ...prev,
        {
          type: "line",
          offsetX,
          offsetY,
          width: offsetX,
          height: offsetY,
          stroke: color,
        },
      ]);
    } else if (tools === "rectangle") {
      setElement((prev) => [
        ...prev,
        {
          type: "rectangle",
          offsetX,
          offsetY,
          width: 0,
          height: 0,
          stroke: color,
        },
      ]);
    }

    setDraw(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (draw) {
      if (tools === "pencil") {
        const { path } = element[element.length - 1];
        const newPath = [...path!, [offsetX, offsetY]];
        setElement((prev) => prev.map((el, i) => (i === element.length - 1 ? { ...el, path: newPath } : el))
        );
      } else if (tools === "line") {
        setElement((prev) =>
          prev.map((el, i) => (i === element.length - 1 ? { ...el, width: offsetX, height: offsetY } : el))
        );
      } else if (tools === "rectangle") {
        setElement((prev) =>
          prev.map((el, i) =>
            i === element.length - 1
              ? { ...el, width: offsetX - el.offsetX, height: offsetY - el.offsetY }
              : el
          )
        );
      }
    }
  };

  const handleMouseUp = () => {
    setDraw(false);
  };

  if (!user?.presenter) {
    return (
      <div className="border border-dark h-100 w-100 overflow-hidden position-relative"
      >
        <img
          src={img}
          alt="Real Time white board"
          style={{
            height: window.innerHeight * 2,
            width: "285%",
          }}
        />
      </div>
    );
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border border-dark h-100 w-100 overflow-hidden position-relative"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default White;
