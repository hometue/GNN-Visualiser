import { Box, Card, CardContent, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Graph } from "./graph";
import { ReadWrite } from "../types/readWrite";
import { CSSProperties, MouseEvent, FocusEvent, useState } from "react";

function NodeValueView(props: {cellValue: number, updateGraph: (value: number) => void}){
    const [editingVal, setEditingVal] = useState<null|number>(null);

    const onClick = (e: MouseEvent<HTMLDivElement>) => {
        setEditingVal(props.cellValue);
    }

    const onEndEdit = (e: FocusEvent<HTMLInputElement>) => {
        const toUpdateVal = editingVal;
        if(toUpdateVal !== null){
            props.updateGraph(toUpdateVal);
        }
        setEditingVal(null);
    }

    if(editingVal === null){
        return(
            <span onClick={onClick}>
                {props.cellValue.toString()}&nbsp;
            </span>
        )
    }
    else{
        return(
            <input type="number" value={editingVal} onChange={(e) => {setEditingVal(parseInt(e.target.value))}} onBlur={onEndEdit} />
        )
    }
}

function NodeRowView(props: {row: number[], updateGraph: (target: number, value: number) => void}){
    const [style, setStyle] = useState<CSSProperties>({backgroundColor: "white"});

    const changeStyleOnMouseOver = (e: MouseEvent<HTMLDivElement>) => { 
        setStyle({backgroundColor: "WhiteSmoke"});
    };

    const changeStyleOnMouseleave = (e: MouseEvent<HTMLDivElement>) => { 
        setStyle({backgroundColor: "white"});
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
                <Box>
                    <IconButton onClick={() => {
                        const newGraph = props.graph.data.cloneGraph();
                        newGraph.removeNode(newGraph.adjMatrix.length - 1);
                        props.graph.setData(newGraph);
                    }}>
                        <RemoveIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                        const newGraph = props.graph.data.cloneGraph();
                        newGraph.addNode();
                        props.graph.setData(newGraph);
                    }}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box width="fit-content">
                    {props.graph.data.adjMatrix.map((row, index) => {
                        return <NodeRowView key={index} row={row} updateGraph={writeGraph(index)} />
                    })}
                </Box>
            </CardContent>
        </Card>
    )
}