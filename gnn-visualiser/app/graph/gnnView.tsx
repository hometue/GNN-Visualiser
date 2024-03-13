import { useEffect, useRef } from "react";
import { GNN } from "./gnn";
import cytoscape from "cytoscape";

function gnnToCyto(gnn: GNN){
	const gnnData: {data: {id: string}}[] = [];
	gnn.nodes.forEach((node, index) => {
		const nodeData = {data: {id: index.toString(), weight: node.weight, constant: node.constant}};
		gnnData.push(nodeData);
		if(index !== 0){
			const edgeData = {data: {id: index.toString().concat('e'.concat(index.toString())),
									source: (index - 1).toString(),
									target: index.toString()
			}};
			gnnData.push(edgeData);
		}
	})
	return gnnData;
}

export default function GNNView(props: {gnn: GNN}){
	const graphRef = useRef<HTMLDivElement>(null);
	const cacheAdjMatrix = useRef<null | number[][]>(null);
	const cyto = useRef<cytoscape.Core>(cytoscape());

	useEffect(()=> {
		const cy = cytoscape({
			container: graphRef.current,
			elements: gnnToCyto(props.gnn),
			layout: {name: 'grid'},
			style: [
				{
					selector: 'node',
					style: {
						'label': (ele: any) => {return 'ID: ' + ele.data("id") + '\nWeight: ' + ele.data("weight") + '\nConstant: ' + ele.data("constant")},
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
	}, [props])
	return (
		<div style={{width: '100%', height: '100%'}} ref={graphRef}></div>
	)
}