import { Graph } from "./graph";

export interface LayerOutput {
    message: number[] // Messages sent by each node
    embedding: number[]
}

export interface GNNResult {
    finalEmbeddings: number[]
    layerResult: LayerOutput[]
}

export class GNNNode {
    weight: number = 1;
    constant: number = 0;
}

export class GNN {
    nodes: GNNNode[] = [];

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

    getEmbeddings(graph: Graph){
        
    }
}