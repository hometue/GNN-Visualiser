'use client'

import GraphView from "./graph/graphView";
import AdjGraphView from "./graph/adjGraphView";
import { useState } from "react";
import { Graph } from "./graph/graph";
import { GNN } from "./graph/gnn";
import GNNView from "./graph/gnnView";

export default function Test() {
  const [graph, setGraph] = useState(() => {
    const graph = new Graph();
    graph.addNode();
    graph.addNode();
    return graph;
  });
  const [gnn, setgnn] = useState(GNN.templateGraph());

  return (
    <div style={{display: "flex", height: "80vh", overflow: "auto"}}>
      <div style={{display: "flex", flex: 1, flexDirection: "column", height: "100%"}}>
        <div style={{flex: 1}}><AdjGraphView graph={{data: graph, setData: setGraph}}/></div>
        <div style={{flex: 1}}><GNNView gnn={gnn}/></div>
      </div>
      <div style={{flex: 1}}><GraphView graph={{data: graph, setData: setGraph}} /></div>
    </div>
  )
}
