import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { ReadWrite } from "../types/readWrite";
import { GNN } from "./gnn";
import { Dialog, DialogContent, TextField } from "@mui/material";

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
				selectable: false,
				style: {events: "no"}
			};
			gnnData.push(edgeData);
		}
	})
	return gnnData;
}

export default function GNNView(props: {gnn: ReadWrite<GNN>, selectedNode?: ReadWrite<number | null>}){
	const graphRef = useRef<HTMLDivElement>(null);
	const [dialogOpen, setDialogOpen] = useState<number|null>(null);
	const [dialogWeight, setDialogWeight] = useState(0);
	const [dialogConst, setDialogConst] = useState(0);

	useEffect(()=> {
		const cy = cytoscape({
			container: graphRef.current,
			elements: gnnToCyto(props.gnn.data),
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
		cy.nodes().on("dblclick ", (event)=> {
			setDialogOpen(parseInt(event.target.data("id")));
			setDialogConst(props.gnn.data.nodes[parseInt(event.target.data("id"))].constant);
			setDialogWeight(props.gnn.data.nodes[parseInt(event.target.data("id"))].weight);
		});
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

	}, [props.gnn.data, props.selectedNode])
	return (
		<>
			<div style={{width: '100%', height: '100%'}} ref={graphRef}></div>
			<Dialog open={dialogOpen !== null} onClose={()=>{
				if(dialogOpen !== null){
					const newGNN = props.gnn.data.clone();
					newGNN.nodes[dialogOpen].weight = dialogWeight;
					setDialogOpen(null);
					props.gnn.setData(newGNN);
				}
			}}>
				<DialogContent>
					{(dialogOpen !== null)?
						<>
							<div>
								<TextField type="number" label="Weight" value={dialogWeight} onChange={(e)=> {setDialogWeight(parseInt(e.target.value))}} />
							</div>
							<br />
							<div>
								<TextField type="number" label="Constant" value={dialogConst} onChange={(e)=> {setDialogConst(parseInt(e.target.value))}} />
							</div>

						</>
					:null}
				</DialogContent>
			</Dialog>
		</>
		
	)
}