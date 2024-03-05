import { useEffect, useRef, useState } from "react";
import {Graph} from "./graph";
import cytoscape from 'cytoscape';

function graphToCyto(graph: Graph){
	let id = 0;
	const graphData: {data: {id: string}}[] = [];
	graph.adjMatrix.forEach((node, index) => {
		const nodeData = {data: {id: index.toString()}};
		graphData.push(nodeData);
		node.forEach((edge, edgeNode) => {
			if(edge != 0){
				const edgeData = {data: {id: index.toString().concat('e'.concat(edgeNode.toString())),
										source: index.toString(),
										target: edgeNode.toString()
				}};
				graphData.push(edgeData);
			}
		})
	})
	return graphData;
}


export default function GraphView() {
	const graphRef = useRef(null)
	const [graph, setGraph] = useState(() => {
		const graph = new Graph();
		graph.addNode();
		graph.addNode();
		graph.addNode();
		return graph;
	});
	useEffect(()=> {
		let cy = cytoscape({
			container: graphRef.current,
			elements: graphToCyto(graph),
			layout: {name: 'circle'},
			style: [
				{
				selector: 'node',
				style: {
					'label': 'data(id)'
				}
				}
			]
		});
	}, [])
	

	return (
		<div style={{width: '100%', height: '80vh'}} ref={graphRef}></div>
	)
}