export type GraphNode = {
	nodeFeature: number
}

export class Graph {
	adjMatrix: number[][] = []; // Simple version, 0 means not connected, non zero is connected
	nodeFeatures: number[] = [];
	selectedNode: null | number = null;

	addNode(){
		this.adjMatrix.forEach((row) => {
			row.push(0);
			
		});
		let newRow: number[] = new Array<number>(this.adjMatrix.length + 1);
		newRow.fill(0, 0, this.adjMatrix.length + 1);
		newRow[this.adjMatrix.length] = 1; //Create self-connection
		this.adjMatrix.push(newRow);

		// Add nodeFeatures

		//this.nodeFeatures.push(0); testing
		this.nodeFeatures.push(this.numberOfNodes())
	}

	removeNode(id: number){
		if(id >= this.numberOfNodes()){
			// Check out of bound, early return
			return;
		}
		this.adjMatrix.splice(id, 1);
		this.adjMatrix.forEach((row) => {
			row.splice(id, 1);
		})
	}

	numberOfNodes(): number {
		return this.adjMatrix.length;
	}

	printNodes(){
		console.log(this.adjMatrix);
	}

	getNeighbours(id: number): number[]{
		if(id >= this.adjMatrix.length){
			return [];
		}
		let curId = 0;
		const neighbours: number[] = [];
		// Note: We do not skip the node itself, because 
		/*this.adjMatrix[id].forEach((row: number, index: number)=>{
			if(row !== 0){
				// There is connection, hence neighbours
				neighbours.push(index)
			}
		})*/

		while(curId < this.numberOfNodes()){
			if(this.adjMatrix[curId][id] !== 0){
				// [curId][id] !== 0 means connection
				neighbours.push(curId);
			}
			curId = curId + 1;
		}
		return neighbours;
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