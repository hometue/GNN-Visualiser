'use client'

import Image from "next/image";
import GraphView from "./graph/graphView";
import AdjGraphView from "./graph/adjGraphView";

export default function Test() {
  return (
    <div style={{display: "flex"}}>
      <div style={{flex: 1}}><AdjGraphView /></div>
      <div style={{flex: 1}}><GraphView /></div>
    </div>
  )
}
