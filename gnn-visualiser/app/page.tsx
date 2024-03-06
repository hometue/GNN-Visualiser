'use client'

import Image from "next/image";
import GraphView from "./graph/graphView";
import AdjGraphView from "./graph/adjGraphView";
import { useState } from "react";
import { Graph } from "./graph/graph";

export default function Test() {
    const [graph, setGraph] = useState(() => {
      const graph = new Graph();
      graph.addNode();
      graph.addNode();
      return graph;
  });
  return (
    <div style={{display: "flex", height: "70vh", overflow: "auto"}}>
      <div style={{flex: 1}}><AdjGraphView graph={{data: graph, setData: setGraph}}/></div>
      <div style={{flex: 1}}><GraphView graph={graph} /></div>
    </div>
  )
}
