import { useEffect, useRef } from "react";
import {Graph} from "./graph";
import cytoscape from 'cytoscape';
import { ReadWrite } from "../types/readWrite";

function graphToCyto(graph: Graph){
	const graphData: {data: {id: string}}[] = [];
	graph.adjMatrix.forEach((node, index) => {
		const nodeData = {data: {id: index.toString(), haha: 'LOL'}};
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

function arrayCheck(arr1: number[][], arr2: number[][]){
	return (arr1.length === arr2.length) && arr1.every((row, index) => {
		return row.length === arr2[index].length && row.every((val, rowIndex) => {
			return val === arr2[index][rowIndex];
		})
	})
}

export default function GraphView(props: {graph: ReadWrite<Graph>}) {
	const graphRef = useRef(null)
	const cacheAdjMatrix = useRef<null | number[][]>(null);
	const cyto = useRef<cytoscape.Core>(cytoscape())

	useEffect(()=> {
		const prevArr = cacheAdjMatrix.current;
		if(prevArr === null || !arrayCheck(prevArr, props.graph.data.adjMatrix)){
			const cy = cytoscape({
				container: graphRef.current,
				elements: graphToCyto(props.graph.data),
				layout: {name: 'circle'},
				style: [
					{
						selector: 'node',
						style: {
							'label': (ele: any) => {return 'ID: ' + ele.data("id") + '\n' + ele.data("haha")},
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
			cy.fit();
	
			const handleResize = () => { cy.resize(); cy.fit();};
	
			const handleSelect: cytoscape.EventHandler = (e) => {
				const newGraph = props.graph.data.cloneGraph();
				newGraph.selectedNode = parseInt(e.target.data("id"));
				props.graph.setData(newGraph);
				console.log(e.target.data("id"))
			}
	
			cy.on("select", handleSelect);
	
			const handleUnselect = (cy: cytoscape.Core, target: {data: {id: string}} | cytoscape.Core) => {
				
			}
	
			window.addEventListener('resize', handleResize);

			cacheAdjMatrix.current = props.graph.data.adjMatrix;
			cyto.current = cy;
	
			return () => {
				window.removeEventListener('resize', handleResize);
			}
		}
	}, [props.graph])
	

	return (
		<div style={{width: '100%', height: '100%'}} ref={graphRef}></div>
	)
}