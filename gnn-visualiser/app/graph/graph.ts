type GraphNode = {
    nodeFeature: number
}

class Graph {
    adjMatrix: number[][] = []; // Simple version, 0 means not connected, non zero is connected
    nodeFeatures: number[] = [];

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

    setNodeFeature(id: number){

    }

    setNodesConnection(firstNodeId: number, secondNodeId: number){
        
    }
}