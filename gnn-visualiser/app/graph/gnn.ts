import { Graph } from "./graph";

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

    aggregate(id: number, graph: Graph, messages: number[]): number {
        // Average

        const neighbours = graph.getNeighbours(id);
        let sum = 0;
        let count = 0;
        neighbours.forEach((neighbourId: number) => {
            sum = sum + messages[neighbourId];
            count = count + 1;
        })

        return sum/count;
    }

    calculateLayerOutput(graph: Graph, prevNodeFeatures: number[], layerNode: GNNNode): LayerOutput {
        const messages = prevNodeFeatures.map((nodeFeature) => {
            return this.message(nodeFeature, layerNode)
        });

        let curId = 0;
        const newNodeFeatures: number[] = []
        while(curId < graph.adjMatrix.length){
            newNodeFeatures[curId] = this.aggregate(curId, graph, messages);
            curId = curId + 1;
        }

        const output: LayerOutput = {message: messages, embedding: newNodeFeatures}

        return output;
    }

    getEmbeddings(graph: Graph): GNNResult{
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
}