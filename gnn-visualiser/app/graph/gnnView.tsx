import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import { ReadWrite } from "../types/readWrite";
import { GNN } from "./gnn";

function gnnToCyto(gnn: GNN){
	const gnnData: {data: {id: string}}[] = [];
	gnn.nodes.forEach((node, index) => {
		const nodeData = {data: {id: index.toString(), weight: node.weight, constant: node.constant}};
		gnnData.push(nodeData);
		if(index !== 0){
			const edgeData = {
				data: {
					id: index.toString().concat('e'.concat(index.toString())),
					source: (index - 1).toString(),
					target: index.toString()
				},
				selectable: false
			};
			gnnData.push(edgeData);
		}
	})
	return gnnData;
}

export default function GNNView(props: {gnn: GNN, selectedNode?: ReadWrite<number | null>}){
	const graphRef = useRef<HTMLDivElement>(null);

	useEffect(()=> {
		const cy = cytoscape({
			container: graphRef.current,
			elements: gnnToCyto(props.gnn),
			layout: {name: 'grid', rows: 1},
			userPanningEnabled: false,
			userZoomingEnabled: false,
			boxSelectionEnabled: false,
			autoungrabify: true,
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

		cy.fit();
		if(props.selectedNode !== undefined && props.selectedNode.data !== null){
			cy.$('#'.concat(props.selectedNode.data.toString())).select();
		}
		if(props.selectedNode !== undefined){
			const handleSelect: cytoscape.EventHandler = (e) => {
				props.selectedNode?.setData(parseInt(e.target.data("id")));
			}
	
			cy.on("select", handleSelect);
	
			const handleUnselect = () => {
				props.selectedNode?.setData(null);
			}
	
			cy.on("unselect", handleUnselect);
	
		}

	}, [props.gnn, props.selectedNode])
	return (
		<div style={{width: '100%', height: '100%'}} ref={graphRef}></div>
	)
}