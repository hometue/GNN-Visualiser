import { Box, Card, CardContent, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Graph } from "./graph";
import { ReadWrite } from "../types/readWrite";
import { CSSProperties, MouseEvent, FocusEvent, useState, useEffect, useRef } from "react";

function useOutsideAlerter(ref: any, onOutsideAlert: () => void) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
            onOutsideAlert();
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

function NodeValueView(props: {cellValue: number, updateGraph: (value: number) => void}){
    const [editingVal, setEditingVal] = useState<null|number>(null);
    const wrapperRef = useRef(null);
    

    const onClick = (e: MouseEvent<HTMLDivElement>) => {
        setEditingVal(props.cellValue);
    }

    const onEndEdit = () => {
        const toUpdateVal = editingVal;
        if(toUpdateVal !== null){
            props.updateGraph(toUpdateVal);
        }
        setEditingVal(null);
    }
    useOutsideAlerter(wrapperRef, onEndEdit);

    if(editingVal === null){
        return(
            <span onClick={onClick}>
                {props.cellValue.toString()}&nbsp;
            </span>
        )
    }
    else{
        return(
            <input type="number" value={editingVal} onChange={(e) => {setEditingVal(parseInt(e.target.value))}} ref={wrapperRef} />
        )
    }
}

function NodeRowView(props: {row: number[], updateGraph: (target: number, value: number) => void, selected: boolean}){
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
                        return <NodeRowView key={index} row={row} updateGraph={writeGraph(index)} selected={index===props.graph.data.selectedNode} />
                    })}
                </Box>
            </CardContent>
        </Card>
    )
}