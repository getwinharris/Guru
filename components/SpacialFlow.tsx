
import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Node3D, Link3D } from '../types';

interface SpacialFlowProps {
  data: { nodes: Node3D[], links: Link3D[] };
}

const SpacialFlow: React.FC<SpacialFlowProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let rotation = 0;

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        canvas.parent(containerRef.current!);
      };

      p.draw = () => {
        p.background(5, 5, 5, 0); // Transparent background
        p.orbitControl();
        p.rotateY(rotation);
        rotation += 0.002;

        p.strokeWeight(1);
        p.stroke(0, 255, 255, 50);

        // Draw Links
        data.links.forEach(link => {
          const source = data.nodes.find(n => n.id === link.source);
          const target = data.nodes.find(n => n.id === link.target);
          if (source && target) {
            p.line(source.x, source.y, source.z, target.x, target.y, target.z);
          }
        });

        // Draw Nodes
        data.nodes.forEach(node => {
          p.push();
          p.translate(node.x, node.y, node.z);
          p.noStroke();
          p.fill(node.type === 'concept' ? '#06b6d4' : '#8b5cf6');
          p.sphere(8);
          p.pop();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const myP5 = new p5(sketch);
    return () => myP5.remove();
  }, [data]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40" 
      style={{ filter: 'blur(1px)' }}
    />
  );
};

export default SpacialFlow;
