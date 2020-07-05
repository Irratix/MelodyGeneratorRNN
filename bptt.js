let precision = 10;
let totalCost = 0;
let costSum = 0;
let activeMelody = 0;

//train a network on a dataset
function train() {
	let weight_adjust = new Matrix(NET_STATE_SIZE, NOTE_RANGE);
	let bias_adjust = new Matrix(1, NOTE_RANGE);
	
	for (let h=activeMelody; h<activeMelody+10; h++) {
		if (h >= data.length) break;
		melody = data[h];
		
		network.resetState();
		//for each timestep (minus 1) in the melody
		for (let i=0; i<melody.length-1; i++) {
			network.calculateState(new Matrix(melody[i]));
			let input = network.state.matrix[0];
			let output = network.getOutput();
			let outputWOS = network.getOutputWOS();
			let desiredValue = melody[i+1];
			
			// width = input vector length = k
			// height = output vector length = j
			
			for (let j=0; j<NOTE_RANGE; j++) {
				let derivative_A = Math.cosh(outputWOS.matrix[0][j]) ** -2;
				let derivative_C = 2*(output.matrix[0][j] - desiredValue[j]);
				let derivative_Zb = 1;
				
				//calculate weight adjust
				for (let k=0; k<NET_STATE_SIZE; k++) {
					let derivative_Zw = input[k];
					weight_adjust.matrix[k][j] -= derivative_A * derivative_C * derivative_Zw;
				}
				
				// calculate bias adjust
				bias_adjust.matrix[0][j] -= derivative_A * derivative_C * derivative_Zb;
			}
			
			totalCost += network.costSum(new Matrix(desiredValue));
		}
	}
	
	activeMelody += 10;
	if (activeMelody >= data.length) activeMelody = 0;
	
	// average/scale bias_adjust and weight_adjust
	bias_adjust   = bias_adjust.scale(1/(data.length * 63 * precision));
	weight_adjust = weight_adjust.scale(1/(data.length * 63 * precision));
	
	if (activeMelody < 10) {
		costSum = totalCost;
		drawCostSum();
		totalCost = 0;
	}
	
	// apply to network weights and biases
	network.bias_Out = network.bias_Out.add(bias_adjust);
	network.weight_Out = network.weight_Out.add(weight_adjust);
}

/*
	CALCULATING WEIGHT ADJUSTMENTS
	- derivative of output of node j w/o tanh w.r.t. weight (j,k)
		OutputWOS(j) = Weight(jk) * Input(k) + Bias(j)
		Derivative_Z = Input(k)
		
	- derivative of output of node j w.r.t. output of j w/o sigmoid
		Output(j) = tanh(OutputWOS(j))
		Derivative_A = (1 / cosh(OutputWOS(j))) ** 2
	
	- derivative of cost function w.r.t. output of node j
		Cost = (Output(j) - DesiredValue(j)) ** 2
		Derivative_C = 2(Output(j) - DesiredValue(j))
		
	
	
	CALCULATING BIAS ADJUSTMENTS
	- derivative of output of node j w/o tanh w.r.t. bias(j)
		OutputWOS(j) = Weight(jk) * Input(k) + Bias(j)
		Derivative_Z_bias = 1
		
	- derivative of output of node j w.r.t. output of j w/o sigmoid
		Output(j) = tanh(OutputWOS(j))
		Derivative_A = (1 / cosh(OutputWOS(j))) ** 2
	
	- derivative of cost function w.r.t. output of node j
		Cost = (Output(j) - DesiredValue(j)) ** 2
		Derivative_C = 2(Output(j) - DesiredValue(j))
*/