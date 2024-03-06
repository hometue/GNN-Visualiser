import { Box, Card, CardContent, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Graph } from "./graph";
import { ReadWrite } from "../types/readWrite";

export default function AdjGraphView(props: {graph: ReadWrite<Graph>}) {

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
                    {props.graph.data.adjMatrixToString()}
                </Box>
            </CardContent>
        </Card>
    )
}