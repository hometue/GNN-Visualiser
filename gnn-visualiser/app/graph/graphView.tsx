import { useState } from "react";
import {Graph} from "./graph";
import cytoscape from 'cytoscape';

function graphToCyto(graph: Graph){
    let id = 0;
    graph.adjMatrix.forEach((node) => {

    })
}


export default function AdjGraphView() {
    const [graph, setGraph] = useState(() => {
        const graph = new Graph();
        graph.addNode();
        graph.addNode();
        return graph;
    });

    return (
        <div id="cytoGraph"></div>
    )
}