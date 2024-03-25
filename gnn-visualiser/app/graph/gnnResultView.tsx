import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { GNN, GNNResult } from "./gnn";
import { Graph } from "./graph";


function resultToCyto(result: GNNResult, graph: Graph, gnn: GNN, nodeId: number): [data: {data: {id: string}}[], root: string]{
	const resultData: {data: {id: string}}[] = [];
	let root = '';
	let layers: number[] = [nodeId];
	result.layerResult.toReversed().forEach((layerResult, layerIndex) => {
		layers.forEach((node)=> {
			const nodeData = {data: {id: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node}}
			if(layerIndex === 0){
				(nodeData as any)["selected"] = true;
				root = "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node;
			}
			resultData.push(nodeData)
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
						source: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node,
						target: "layer" + (result.layerResult.length - layerIndex - 2).toString() + "node" + neighbour
					}};
					resultData.push(edgeData)
				})
			})
			layers = Array.from(newLayers);
		}
	})
	console.log(resultData)
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
			userPanningEnabled: false,
			userZoomingEnabled: false,
			boxSelectionEnabled: false,
			autoungrabify: true,
			style: [
				{
					selector: 'node',
					style: {
						'label': (ele: any) => {return 'ID: ' + ele.data("id")},
						"text-wrap": "wrap",
						"shape": "rectangle"
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