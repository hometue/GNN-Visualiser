import { useEffect, useRef } from "react";
import {Graph} from "./graph";
import cytoscape from 'cytoscape';

function graphToCyto(graph: Graph){
	let id = 0;
	const graphData: {data: {id: string}}[] = [];
	graph.adjMatrix.forEach((node, index) => {
		const nodeData = {data: {id: index.toString(), haha: 'LOL'}};
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


export default function GraphView(props: {graph: Graph}) {
	const graphRef = useRef(null)
	useEffect(()=> {
		let cy = cytoscape({
			container: graphRef.current,
			elements: graphToCyto(props.graph),
			layout: {name: 'circle'},
			style: [
				{
				selector: 'node',
				style: {
					'label': (ele: any) => {return 'ID: ' + ele.data("id") + '\n' + ele.data("haha")},
					"text-wrap": "wrap"
				}
				}
			]
		});
	}, [props.graph])
	

	return (
		<div style={{width: '100%', height: '80vh'}} ref={graphRef}></div>
	)
}