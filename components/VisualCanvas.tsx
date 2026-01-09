
import React, { useEffect, useRef } from 'react';

interface VisualCanvasProps {
  code: string;
}

const VisualCanvas: React.FC<VisualCanvasProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    // Clean code of common markdown or LLM artifacts
    const cleanCode = code
      .replace(/```javascript/g, '')
      .replace(/```p5js/g, '')
      .replace(/```/g, '')
      .trim();

    const documentContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.2/p5.min.js"></script>
          <style>
            body { 
              margin: 0; 
              background: #0d0d0d; 
              overflow: hidden; 
              display: flex;
              align-items: center;
              justify-content: center;
            }
            canvas {
              display: block;
              max-width: 100%;
              max-height: 100%;
            }
          </style>
        </head>
        <body>
          <script>
            // Setup the simulation container
            window.setup = function() {
              createCanvas(window.innerWidth, window.innerHeight);
            };

            // Inject the dynamic code
            try {
              ${cleanCode}
            } catch (e) {
              console.error("Simulation Execution Error:", e);
            }

            // Ensure canvas fits container on resize
            window.addEventListener('resize', function() {
              if (window.resizeCanvas) {
                resizeCanvas(window.innerWidth, window.innerHeight);
              }
            });
          </script>
        </body>
      </html>
    `;

    const iframe = iframeRef.current;
    iframe.srcdoc = documentContent;
  }, [code]);

  return (
    <div className="w-full h-full bg-[#0d0d0d] relative group/canvas">
      <iframe
        ref={iframeRef}
        title="Visual Simulation"
        className="w-full h-[350px] border-none pointer-events-auto"
        sandbox="allow-scripts"
      />
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-b-[40px] group-hover/canvas:border-cyan-500/20 transition-all duration-700"></div>
    </div>
  );
};

export default VisualCanvas;
