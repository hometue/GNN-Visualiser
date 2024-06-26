import { Graph } from "./graph";

export enum AggregateFunctions {
	mean, min, max, sum
}

export interface LayerOutput {
	message: number[] // Messages sent by each node
	embedding: number[] //Embedding after the layer
}

export class GNNResult {
	finalEmbeddings: number[] = []
	layerResult: LayerOutput[] = []
}

export class GNNNode {
	weight: number = 1;
	constant: number = 0;
	aggFun: AggregateFunctions = AggregateFunctions.mean
}

export class GNN {
	nodes: GNNNode[] = [];

	static templateGraph(): GNN {
		const gnn = new GNN();
		gnn.nodes.push(new GNNNode());
		const node2 = new GNNNode();
		node2.weight = 2;
		node2.constant = 3;
		gnn.nodes.push(node2);
		const node3 = new GNNNode();
		node2.weight = 5;
		node2.constant = 7;
		gnn.nodes.push(node3);
		return gnn;
	}

	message(nodeFeature: number, graphNode: GNNNode): number {
		// TODO: Consider if passing the node itself is a better idea so we can potentially get info from other parts.

		return nodeFeature * graphNode.weight + graphNode.constant;
	}

	aggregate(id: number, graph: Graph, messages: number[], graphNode: GNNNode): number {
		const neighbours = graph.getNeighbours(id);
		const neighbourMessages = neighbours.map((nodeId)=> messages[nodeId]);
		// Average
		if(graphNode.aggFun === AggregateFunctions.mean){
			let sum = 0;
			let count = 0;
			neighbourMessages.forEach((message: number) => {
				sum = sum + message;
				count = count + 1;
			})
			return sum/count;
		}
		else if(graphNode.aggFun === AggregateFunctions.min){
			return Math.min(...neighbourMessages);
		}
		else if(graphNode.aggFun === AggregateFunctions.max){
			return Math.max(...neighbourMessages);
		}
		else{
			// To please the typescript overlords
			return 0;
		}
	}

	calculateLayerOutput(graph: Graph, prevNodeFeatures: number[], layerNode: GNNNode): LayerOutput {
		const messages = prevNodeFeatures.map((nodeFeature) => {
			return this.message(nodeFeature, layerNode)
		});

		let curId = 0;
		const newNodeFeatures: number[] = []
		while(curId < graph.adjMatrix.length){
			newNodeFeatures[curId] = this.aggregate(curId, graph, messages, layerNode);
			curId = curId + 1;
		}

		const output: LayerOutput = {message: messages, embedding: newNodeFeatures}

		return output;
	}

	getEmbeddings(graph: Graph): GNNResult {
		const result: GNNResult = new GNNResult();
		let curEmbedding = graph.nodeFeatures;
		this.nodes.forEach((node) => {
			const layerOutput = this.calculateLayerOutput(graph, curEmbedding, node)
			result.layerResult.push(layerOutput);
			curEmbedding = layerOutput.embedding;
		});
		result.finalEmbeddings = curEmbedding;
		return result;
	}

	clone(): GNN {
		const newGNN = new GNN();
		newGNN.nodes = this.nodes;
		return newGNN;
	}
}