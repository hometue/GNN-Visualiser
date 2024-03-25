'use client'

import GraphView from "./graph/graphView";
import AdjGraphView from "./graph/adjGraphView";
import { useState } from "react";
import { Graph } from "./graph/graph";
import { GNN, GNNResult } from "./graph/gnn";
import GNNView from "./graph/gnnView";
import { Button, Dialog } from "@mui/material";
import GnnResultView from "./graph/gnnResultView";

export default function Test() {
const [graph, setGraph] = useState(() => {
	const graph = new Graph();
	graph.addNode();
	graph.addNode();
	return graph;
});
const [gnn, setgnn] = useState(GNN.templateGraph());

const [selectedGNNNode, setSelectedGNNNode] = useState<number | null>(null);
const [viewResult, setViewResult] = useState<number | null>(null)

const result:GNNResult = gnn.getEmbeddings(graph);

return (
	<>
		<div style={{display: "flex", height: "80vh", overflow: "auto"}}>
		<div style={{display: "flex", flex: 1, flexDirection: "column", height: "100%"}}>
			<div style={{flex: 1}}><AdjGraphView graph={{data: graph, setData: setGraph}}/>
			<div>Final embeddings: {result.finalEmbeddings.toString()}</div>
			{(selectedGNNNode!==null)?<>Messages sent from nodes at layer {selectedGNNNode}<div>{result.layerResult[selectedGNNNode].message.toString()}</div></>:null}
			{(selectedGNNNode!==null)?<>Embeddings of nodes after layer {selectedGNNNode}<div>{result.layerResult[selectedGNNNode].embedding.toString()}</div></>:null}
		</div>
			<div style={{flex: 1}}><GNNView gnn={{data: gnn, setData: setgnn}} selectedNode={{data: selectedGNNNode, setData: setSelectedGNNNode}}/></div>
		</div>
		<div style={{flex: 1}}><GraphView graph={{data: graph, setData: setGraph}} onDblClick={(node)=> {setViewResult(node)}}/></div>
		</div>
		{(viewResult!==null)?
		<Dialog open={viewResult!==null} fullScreen={true}>
			<Button onClick={() => {setViewResult(null)}}>Close</Button>
			<GnnResultView gnn={gnn} graph={graph} result={result} nodeId={viewResult}/>
		</Dialog>
		:null}
	</>
)
}
