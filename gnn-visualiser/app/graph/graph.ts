export type GraphNode = {
    nodeFeature: number
}

export class Graph {
    adjMatrix: number[][] = []; // Simple version, 0 means not connected, non zero is connected
    nodeFeatures: number[] = [];
    selectedNode: null | number = null;

    addNode(){
        this.adjMatrix.forEach((row) => {
            //row.push(0); testing
            row.push(this.adjMatrix.length);
        });
        let newRow: number[] = new Array<number>(this.adjMatrix.length + 1);
        newRow.fill(0, 0, this.adjMatrix.length + 1);
        this.adjMatrix.push(newRow);

        // Add nodeFeatures

        this.nodeFeatures.push(0);
    }

    removeNode(id: number){
        if(id >= this.adjMatrix.length){
            // Check out of bound, early return
            return;
        }
        this.adjMatrix.splice(id, 1);
        this.adjMatrix.forEach((row) => {
            row.splice(id, 1);
        })
    }

    printNodes(){
        console.log(this.adjMatrix);
    }

    cloneGraph(): Graph{
        const newGraph: Graph = new Graph();
        newGraph.adjMatrix = this.adjMatrix;
        newGraph.nodeFeatures = this.nodeFeatures;
        newGraph.selectedNode = this.selectedNode;
        return newGraph;
    }

    setNodeFeature(id: number, nodeFeature: number){
        if(id < this.nodeFeatures.length){
            this.nodeFeatures[id] = nodeFeature;
        }
    }

    setNodesConnection(firstNodeId: number, secondNodeId: number){
        
    }

    adjMatrixToString():string{
        let outStr: string = "[";
        this.adjMatrix.forEach((row, index) => {
            if(index != 0){
                outStr = outStr.concat(',');
            }
            outStr = outStr.concat('[', row.toString(), ']');
        })
        outStr = outStr.concat(']');
        return outStr;
    }
}