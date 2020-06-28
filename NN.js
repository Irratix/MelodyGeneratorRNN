class NeuralNet {
	
	constructor(stateLength, inputLength, outputLength) {
		this.bias = new Matrix(1,stateLength);
		this.state = new Matrix(1,stateLength);
		this.weight_In = new Matrix(inputLength, stateLength);
		this.weight = new Matrix(stateLength, stateLength);
		this.weight_Out = new Matrix(stateLength, outputLength);
		this.bias.setRandom();
		this.weight.setRandom();
		this.weight_In.setRandom();
		this.weight_Out.setRandom();
	}
}