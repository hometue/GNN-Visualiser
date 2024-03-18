import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Card, CardContent, IconButton } from "@mui/material";
import { CSSProperties, ChangeEventHandler, KeyboardEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { ReadWrite } from "../types/readWrite";
import { Graph } from "./graph";

function InputBox(props: {value: number, onChange?: ChangeEventHandler<HTMLInputElement>, onEndEdit: () => void}){
	const wrapperRef = useRef<any>(null);
	useEffect(() => {
		// Alert if clicked on outside of element
		function handleClickOutside(event: any) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				props.onEndEdit();
			}
		}
		wrapperRef.current.focus();
		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [props]);

	const enterEndEdit = (e: KeyboardEvent<HTMLElement>) => {
		if(e.key === "Enter"){
			props.onEndEdit();
		}
	}
	return(
		<input type="number" value={props.value} onChange={props.onChange} onKeyDown={enterEndEdit} ref={wrapperRef} />
	)
}

function NodeValueView(props: {cellValue: number, updateGraph: (value: number) => void}){
	const [editingVal, setEditingVal] = useState<null|number>(null);

	if(editingVal === null){
		const onClick = (e: MouseEvent<HTMLDivElement>) => {
			setEditingVal(props.cellValue);
		}
		return(
			<span onClick={onClick}>
				{props.cellValue.toString()}&nbsp;
			</span>
		)
	}
	else{
		const onEndEdit = () => {
			const toUpdateVal = editingVal;
			if(toUpdateVal !== null){
				props.updateGraph(toUpdateVal);
			}
			setEditingVal(null);
		}
		const stringToInt = (str: string) => {
			const result = parseInt(str);
			if(isNaN(result)){
				return 0;
			}
			else{
				return result;
			}
		}

		return(
			<InputBox value={editingVal} onChange={(e) => {setEditingVal(stringToInt(e.target.value))}} onEndEdit={onEndEdit} />
		)
	}
}

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
			return <NodeValueView cellValue={value} key={index} updateGraph={updateValue(index)}/>
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