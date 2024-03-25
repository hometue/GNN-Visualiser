import cytoscape from 'cytoscape';
import { useEffect, useRef } from "react";
import { ReadWrite } from "../types/readWrite";
import { Graph } from "./graph";

interface GraphNode {
	data: {id: string, embedding: number}
}

interface GraphEdge {
	data: {id: string, source: string, target: string}
}

function graphToCyto(graph: Graph){
	const graphData: Array<GraphNode| GraphEdge> = [];
	graph.adjMatrix.forEach((node, index) => {
		const nodeData = {data: {id: index.toString(), embedding: graph.nodeFeatures[index]}};
		graphData.push(nodeData);
		node.forEach((edge, edgeNode) => {
			if(edge != 0){
				const edgeData = {data: {id: index.toString().concat('e'.concat(edgeNode.toString())),
										source: index.toString(),
										target: edgeNode.toString()
				}};
				graphData.push(edgeData);
			}
		})
	})
	return graphData;
}

function array2DCheck(arr1: number[][], arr2: number[][]){
	return (arr1.length === arr2.length) && arr1.every((row, index) => {
		return row.length === arr2[index].length && row.every((val, rowIndex) => {
			return val === arr2[index][rowIndex];
		})
	})
}

function array1DCheck(arr1: number[], arr2: number[]){
	return (arr1.length === arr2.length) && arr1.every((value, index) => {
		return value === arr2[index];
	});
}

export default function GraphView(props: {graph: ReadWrite<Graph>, onDblClick?: (arg0: number) => void}) {
	const graphRef = useRef<HTMLDivElement>(null);
	const cacheAdjMatrix = useRef<null | number[][]>(null);
	const cacheEmbedding = useRef<null | number[]> (null);
	const cyto = useRef<cytoscape.Core>(cytoscape());

	useEffect(()=> {
		const prevArr = cacheAdjMatrix.current;
		if(prevArr === null || !array2DCheck(prevArr, props.graph.data.adjMatrix)){
			// Redraw the whole graph
			const cy = cytoscape({
				container: graphRef.current,
				elements: graphToCyto(props.graph.data),
				layout: {name: 'circle'},
				style: [
					{
						selector: 'node',
						style: {
							'label': (ele: any) => {return 'ID: ' + ele.data("id") + '\nE:' + ele.data("embedding")},
							"text-wrap": "wrap",
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
			if(props.graph.data.selectedNode !== null){
				cy.$('#'.concat(props.graph.data.selectedNode.toString())).select();
			}
			cy.fit();
	
			const handleResize = () => { cy.resize(); cy.fit();};
	
			const handleSelect: cytoscape.EventHandler = (e) => {
				const newGraph = props.graph.data.cloneGraph();
				newGraph.selectedNode = parseInt(e.target.data("id"));
				props.graph.setData(newGraph);
			}
	
			cy.on("select", handleSelect);
	
			const handleUnselect = () => {
				const newGraph = props.graph.data.cloneGraph();
				newGraph.selectedNode = null;
				props.graph.setData(newGraph);
			}

			cy.on("unselect", handleUnselect);
			if(props.onDblClick !== undefined){
				cy.on("dblclick", (e) => {
					if(e.target.isNode() && props.onDblClick !== undefined){
						props.onDblClick(parseInt(e.target.id()));
					}
				})
			}
			
	
			window.addEventListener('resize', handleResize);

			cacheAdjMatrix.current = props.graph.data.adjMatrix.map(o => [...o]);
			cacheEmbedding.current = [...props.graph.data.nodeFeatures];
			cyto.current = cy;
	
			return () => {
				window.removeEventListener('resize', handleResize);
			}
		}
		else if(cacheEmbedding.current === null || !array1DCheck(cacheEmbedding.current, props.graph.data.nodeFeatures)){
			// Only nodeFeatures changed
			cyto.current.nodes().forEach((element: any) => {
				if(element.isNode()){
					element.data("embedding", props.graph.data.nodeFeatures[parseInt(element.data("id"))])
				}
			})
			cacheEmbedding.current = [...props.graph.data.nodeFeatures];
		}
	}, [props.graph])
	

	return (
		<div style={{width: '100%', height: '100%'}} ref={graphRef}></div>
	)
}