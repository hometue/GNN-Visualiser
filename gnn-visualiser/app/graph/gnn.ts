export class GNNNode {
    weight: number = 1;
    constant: number = 0;

    calculateMessage(nodeFeature: number): number{
        return nodeFeature * this.weight + this.constant;
    }
}

export class GNN {
    nodes: GNNNode[] = [];
}