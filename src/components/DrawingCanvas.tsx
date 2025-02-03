import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Button } from "./ui/button";
import { Eraser, Pencil, Square, Circle, Undo2, Trash2 } from "lucide-react";
import { toast } from "./ui/use-toast";

const DrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [tool, setTool] = useState<"draw" | "erase" | "square" | "circle">("draw");
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    fabricCanvas.on('object:added', () => {
      const jsonState = JSON.stringify(fabricCanvas.toJSON());
      setCanvasHistory(prev => [...prev, jsonState]);
    });

    setCanvas(fabricCanvas);
    console.log("Canvas initialized");

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleToolChange = (newTool: typeof tool) => {
    if (!canvas) return;
    setTool(newTool);
    
    if (newTool === "draw") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 2;
      toast({
        title: "Pencil selected",
        description: "Start drawing freely on the canvas",
      });
    } else {
      canvas.isDrawingMode = false;
    }
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "#ffffff";
    canvas.renderAll();
    setCanvasHistory([]);
    toast({
      title: "Canvas cleared",
      description: "All drawings have been cleared",
    });
  };

  const handleUndo = () => {
    if (!canvas || canvasHistory.length === 0) return;
    
    const previousState = canvasHistory[canvasHistory.length - 2] || JSON.stringify({ objects: [], background: "#ffffff" });
    canvas.loadFromJSON(JSON.parse(previousState), () => {
      canvas.renderAll();
      setCanvasHistory(prev => prev.slice(0, -1));
      toast({
        title: "Undo",
        description: "Last action has been undone",
      });
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Button
          variant={tool === "draw" ? "default" : "outline"}
          onClick={() => handleToolChange("draw")}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Draw
        </Button>
        <Button
          variant={tool === "erase" ? "default" : "outline"}
          onClick={() => handleToolChange("erase")}
        >
          <Eraser className="w-4 h-4 mr-2" />
          Erase
        </Button>
        <Button
          variant={tool === "square" ? "default" : "outline"}
          onClick={() => handleToolChange("square")}
        >
          <Square className="w-4 h-4 mr-2" />
          Square
        </Button>
        <Button
          variant={tool === "circle" ? "default" : "outline"}
          onClick={() => handleToolChange("circle")}
        >
          <Circle className="w-4 h-4 mr-2" />
          Circle
        </Button>
        <Button 
          variant="outline" 
          onClick={handleUndo}
          disabled={canvasHistory.length === 0}
        >
          <Undo2 className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button variant="destructive" onClick={clearCanvas}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
      <div className="border rounded-lg shadow-lg overflow-hidden">
        <canvas ref={canvasRef} className="max-w-full" />
      </div>
    </div>
  );
};

export default DrawingCanvas;