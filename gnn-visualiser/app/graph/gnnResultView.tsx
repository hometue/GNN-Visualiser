import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { GNN, GNNResult } from "./gnn";
import { Graph } from "./graph";


function resultToCyto(result: GNNResult, graph: Graph, gnn: GNN, nodeId: number){
	const resultData: {data: {id: string}}[] = [];
	let layers: number[] = [nodeId];
	result.layerResult.toReversed().forEach((layerResult, layerIndex) => {
		layers.forEach((node)=> {
			resultData.push({data: {id: "layer" + (result.layerResult.length - layerIndex - 1).toString() + "node" + node}})
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
						destination: "layer" + (result.layerResult.length - layerIndex - 2).toString() + "node" + neighbour
					}};
					resultData.push(edgeData)
				})
			})
			layers = Array.from(newLayers);
		}
	})
}

export default function GnnResultView(props: {result: GNNResult, graph: Graph, gnn: GNN, nodeId: number}){
	return(
		<></>
	)
}