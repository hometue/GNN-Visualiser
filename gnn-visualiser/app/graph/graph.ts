type GraphNode = {
    nodeFeature: Number
}

class Graph {
    adjMatrix: Number[][] = [[]]; // Simple version, 0 means not connected, non zero is connected
    nodeFeatures: Number[] = [];

    constructor(){
    }

    addNode(){
        this.adjMatrix.forEach((row) => {
            row.push(0);
        });
        let newRow: Number[] = new Array<Number>(this.adjMatrix.length + 1);
        newRow.fill(0, 0, this.adjMatrix.length + 1)
        this.adjMatrix . push (newRow);
    }
}