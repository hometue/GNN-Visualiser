import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Card, CardContent, IconButton } from "@mui/material";
import { CSSProperties, MouseEvent, useState } from "react";
import { ReadWrite } from "../types/readWrite";
import { Graph } from "./graph";
import ValueViewEdit from './ValueViewEdit';

function NodeRowView(props: {row: number[], updateGraph: (target: number, value: number) => void, selected: boolean}) {
	const [hover, setHover] = useState(false);
	const hoverStyle = {backgroundColor: "WhiteSmoke"};
	const normalStyle = {backgroundColor: "white"};
	let style: CSSProperties = {};
	if(hover || props.selected){
		style = hoverStyle;
	}
	else{
		style = normalStyle
	}

	const changeStyleOnMouseOver = (e: MouseEvent<HTMLDivElement>) => { 
		setHover(true);
	};

	const changeStyleOnMouseleave = (e: MouseEvent<HTMLDivElement>) => { 
		setHover(false);
	};

	const updateValue = (target: number) => {
		return (value: number) => {
			props.updateGraph(target, value);
		}
	}

	return(
		<div style={style} onMouseLeave={changeStyleOnMouseleave} onMouseOver={changeStyleOnMouseOver}>{props.row.map((value, index)=> {
			return <ValueViewEdit value={value} key={index} updateGraph={updateValue(index)}/>
		})}</div>
	)
}

export default function AdjGraphView(props: {graph: ReadWrite<Graph>}) {
	const writeGraph = (src: number) => {
		return (target: number, value: number) => {
			const newGraph = props.graph.data.cloneGraph();
			newGraph.adjMatrix[src][target] = value
			props.graph.setData(newGraph);
		}
	}
	return (
		<Card style={{display: 'inline-block'}} variant="outlined">
			<CardContent>
				<div>Adj matrix. Edit by clicking on value then pressing enter or clicking away.</div>
				<Box>
					<IconButton onClick={() => {
						const newGraph = props.graph.data.cloneGraph();
						newGraph.removeNode(newGraph.adjMatrix.length - 1);
						props.graph.setData(newGraph);
					}}>
						<RemoveIcon fontSize="small" />
					</IconButton>
					<IconButton onClick={() => {
						const newGraph = props.graph.data.cloneGraph();
						newGraph.addNode();
						props.graph.setData(newGraph);
					}}>
						<AddIcon fontSize="small" />
					</IconButton>
				</Box>
				<Box width="fit-content">
					{props.graph.data.adjMatrix.map((row, index) => {
						return <NodeRowView key={index} row={row} updateGraph={writeGraph(index)} selected={index===props.graph.data.selectedNode} />
					})}
				</Box>
				<Box>
					<div>Node embedding:</div>
					{props.graph.data.nodeFeatures.map((value)=>{
						return <>{value} </>
					})}
				</Box>
			</CardContent>
		</Card>
	)
}