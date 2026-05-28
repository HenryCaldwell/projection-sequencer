import { useEffect, useRef } from "react";

function CrtEffect() {
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Effects
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = 320;
    canvas.height = 180;

    let rafId: number;

    const draw = () => {
      const image = context.createImageData(canvas.width, canvas.height);
      const data = image.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.floor(Math.random() * 28) + 4;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }

      context.putImageData(image, 0, 0);
      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      {/* Noise */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        style={{ imageRendering: "pixelated" }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)",
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.72) 100%)",
        }}
      />
    </>
  );
}

export default CrtEffect;
