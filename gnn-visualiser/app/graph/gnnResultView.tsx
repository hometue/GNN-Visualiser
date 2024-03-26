import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import { GNN, GNNResult } from "./gnn";
import { Graph } from "./graph";


function resultToCyto(result: GNNResult, graph: Graph, gnn: GNN, nodeId: number): [{data: {id: string}}[], string]{
	const resultData: {data: {id: string}}[] = [];
	const root = "layer" + (result.layerResult.length - 1).toString() + "node" + nodeId;
	let layers: number[] = [nodeId];
	result.layerResult.toReversed().forEach((layerResult, layerIndex) => {
		layers.forEach((node)=> {
			const nodeData = [
				{data: {
					id: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node,
					label: "Node " + node
				}},
				{data: {
					id: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node + "layer",
					label: "Layer " + (result.layerResult.length - layerIndex - 1).toString()
				},
				style: {"shape": "rectangle"}
				},
				{data: {
					id: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node + "layertonode",
					source: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node + "layer",
					target: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node
				}}
			]
			if(layerIndex === 0){
				(nodeData as any)[0]["style"] = {'background-color': 'red'};
			}
			resultData.push(...nodeData)
		});
		if(layerIndex < (result.layerResult.length - 1)){
			// Lower than last index, continue to iterate
			const newLayers: Set<number> = new Set();
			layers.forEach((node)=> {
				const neighbours = graph.getNeighbours(node);
				neighbours.forEach((neighbour)=>{
					newLayers.add(neighbour);
					const edgeData = {data: {
						id: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "edge" + node + "to" + neighbour,
						source: "layer" + (result.layerResult.length - layerIndex - 2).toString() + "node" + neighbour,
						target: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node + "layer"
					}};
					resultData.push(edgeData)
				});
			});
			layers = Array.from(newLayers);
		}
		else{
			// Add last layer of nodes
			const allNeighbours: Set<number> = new Set();
			layers.forEach((node)=> {
				const neighbours = graph.getNeighbours(node);
				neighbours.forEach((neighbour)=>{
					allNeighbours.add(neighbour);
					const edgeData = {data: {
						id: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "edge" + node + "to" + neighbour,
						source: "layer" + "initial" + "node" + neighbour,
						target: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node + "layer"
					}};
					resultData.push(edgeData)
				});
			});
			allNeighbours.forEach((node)=>{
				const nodeData = {data:{id:"layer" + "initial" + "node" + node, label: "Node " + node}}
				resultData.push(nodeData)
			})
		}
	})
	return [resultData, root];
}

export default function GnnResultView(props: {result: GNNResult, graph: Graph, gnn: GNN, nodeId: number}){
	const resultRef = useRef<HTMLDivElement>(null);
	useEffect(()=> {
		const [eleData, rootId] = resultToCyto(props.result,props.graph, props.gnn, props.nodeId);
		const cy = cytoscape({
			container: resultRef.current,
			elements: eleData,
			layout: {name: 'breadthfirst', roots: [rootId]},
			boxSelectionEnabled: false,
			autoungrabify: true,
			style: [
				{
					selector: 'node',
					style: {
						'label': "data(label)",
						"text-wrap": "wrap",
					}
				},
				{
					selector: 'edge',
					style: {
						"curve-style": "bezier",
						"target-arrow-shape": "triangle"
					}
				}
			]
		});
	});
	return(
		<div style={{width: '100%', height: '100%'}} ref={resultRef}></div>
	)
}