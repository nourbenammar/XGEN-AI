import React, { useEffect, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { NodeDetailsDialog } from "./NodeDetailsDialog";

const NetworkMap = ({ connections }) => {
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 0, height: 600 });
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 600,
        });
      };

      updateDimensions();
      const observer = new ResizeObserver(updateDimensions);
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  const graphData = {
    nodes: [
      {
        id: "me",
        name: "You",
        group: 1,
        val: 15,
      },
      ...connections.map((conn) => ({
        id: conn.id,
        name: conn.name,
        role: conn.role,
        company: conn.company,
        location: conn.location,
        mutualConnections: conn.mutualConnections,
        group: 2,
        val: 15,
      })),
    ],
    links: [
      ...connections.map((conn) => ({
        source: "me",
        target: conn.id,
        value: conn.mutualConnections || 1,
      })),
      ...connections.reduce((acc, conn1, idx) => {
        connections.slice(idx + 1).forEach((conn2) => {
          if (Math.random() > 0.7) {
            acc.push({
              source: conn1.id,
              target: conn2.id,
              value: Math.floor(Math.random() * 5) + 1,
            });
          }
        });
        return acc;
      }, []),
    ],
  };

  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;

    // Draw circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI);
    ctx.fillStyle =
      node.group === 1 ? "rgba(59, 130, 246, 0.8)" : "rgba(139, 92, 246, 0.8)";
    ctx.fill();

    // Draw only the name
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.fillText(label, node.x, node.y);
  };

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "600px", position: "relative" }}
    >
      {dimensions.width > 0 && (
        <ForceGraph2D
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          nodeVal={(node) => node.val}
          nodeLabel={(node) => node.name}
          nodeColor={(node) => (node.group === 1 ? "#3B82F6" : "#8B5CF6")}
          linkWidth={2}
          linkColor={() => "rgba(203, 213, 225, 0.6)"}
          nodeCanvasObject={nodeCanvasObject}
          cooldownTime={2000}
          onNodeClick={(node) => {
            if (node.group !== 1) {
              setSelectedNode(node);
            }
          }}
          linkDistance={300}
          enableZoomPanInteraction={true}
          d3Force={("charge", -1000)}
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.1}
        />
      )}
      <NodeDetailsDialog
        node={selectedNode}
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};

export default NetworkMap;