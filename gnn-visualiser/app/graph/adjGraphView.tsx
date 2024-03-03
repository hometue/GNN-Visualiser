import {useState} from "react";
import { Box, Card, CardContent, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {Graph} from "./graph";

export default function AdjGraphView() {
    const [graph, setGraph] = useState(() => {
        const graph = new Graph();
        graph.addNode();
        graph.addNode();
        return graph;
    });

    return (
        <Card style={{display: 'inline-block'}} variant="outlined">
            <CardContent>
                <Box>
                    <IconButton onClick={() => {
                        const newGraph = graph.cloneGraph();
                        newGraph.removeNode(newGraph.adjMatrix.length - 1);
                        setGraph(newGraph);
                    }}>
                        <RemoveIcon />
                    </IconButton>
                    <IconButton onClick={() => {
                        const newGraph = graph.cloneGraph();
                        newGraph.addNode();
                        setGraph(newGraph);
                    }}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box width="fit-content">
                    {graph.adjMatrixToString()}
                </Box>
            </CardContent>
        </Card>
    )
}