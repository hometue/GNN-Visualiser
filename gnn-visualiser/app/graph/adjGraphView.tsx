import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Button, Card, CardContent, IconButton } from "@mui/material";
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
		<span style={style} onMouseLeave={changeStyleOnMouseleave} onMouseOver={changeStyleOnMouseOver}>
			{props.row.map((value, index)=> {
				return (
					<span key={index} style={{ borderStyle: "solid", borderWidth: "1px" }}>
						<ValueViewEdit value={value} updateGraph={updateValue(index)}/>
					</span>
				)
		})}</span>
	)
}

function NodeFeatures(props: {nodeFeatures: ReadWrite<number[]>}){
	const writeNodeFeature = (index: number) => {
		return (newNodeFeature: number) => {
			const newNodeFeatures = [...props.nodeFeatures.data];
			newNodeFeatures[index] = newNodeFeature;
			props.nodeFeatures.setData(newNodeFeatures)
		}
	}
	return (
		<Box>
			<div>Node embedding. Double click to edit.</div>
			{props.nodeFeatures.data.map((value, index)=>{
				return (
					<span key={index} style={{ borderStyle: "solid", borderWidth: "1px" }}>
						<ValueViewEdit value={value} updateGraph={writeNodeFeature(index)} />
					</span>
				)
			})}
		</Box>
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

	const updateNodeFeatures = (newNodeFeatures: number[]) => {
		const newGraph = props.graph.data.cloneGraph();
		newGraph.nodeFeatures = newNodeFeatures;
		props.graph.setData(newGraph);
	}

	return (
		<Card style={{display: 'inline-block'}} variant="outlined">
			<CardContent>
				<div>Adj matrix. Edit by clicking on value then pressing enter or clicking away.</div>
				<Box>
					<Button onClick={() => {
						const newGraph = props.graph.data.cloneGraph();
						newGraph.removeNode(newGraph.adjMatrix.length - 1);
						props.graph.setData(newGraph);
					}}
					startIcon={<RemoveIcon fontSize="small" />}>
						Remove node
					</Button>
					<Button onClick={() => {
						const newGraph = props.graph.data.cloneGraph();
						newGraph.addNode();
						props.graph.setData(newGraph);
					}}
					startIcon={<AddIcon fontSize="small" />}>
						Add node
					</Button>
				</Box>
				<Box width="fit-content">
					{props.graph.data.adjMatrix.map((row, index) => {
						return (
						<div key={index}>
							<span>Node {index}: </span>
							<NodeRowView row={row} updateGraph={writeGraph(index)} selected={index===props.graph.data.selectedNode} />
						</div>
						)
						
					})}
				</Box>
				<NodeFeatures nodeFeatures={{data: props.graph.data.nodeFeatures, setData: updateNodeFeatures}} />
			</CardContent>
		</Card>
	)
}