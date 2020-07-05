var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d", {alpha: false});
c.width = 600;
c.height = 450;

function drawNetwork() {
	ctx.fillStyle = "white";
	ctx.font = "14px Monospace";
	ctx.fillText("OUTPUT WEIGHT MATRIX", 30, 22);
	
	if (network == null) return;
	
	let weights = network.weight_Out.matrix;
	for (let i=0; i<weights.length; i++) {
		for (let j=0; j<weights[i].length; j++) {
			let hue;
			//determine hue
			if (weights[i][j] < 0) {
				hue = 0;
			} else {
				hue = 200;
			}
			//determine lightness
			let lightness = Math.abs(weights[i][j])*95 + 5;
			ctx.fillStyle = "hsl("+hue+",100%,"+lightness+"%)";
			
			ctx.fillRect(30 + 5*i, 30+5*j, 4, 4);
		}
	}
}

function drawBias() {
	ctx.fillStyle = "white";
	ctx.font = "14px Monospace";
	ctx.fillText("BIASES", 30, 180);
	
	if (network == null) return;
	
	let biases = network.bias.matrix[0];
	for (let i=0; i<biases.length; i++) {
		let hue;
		//determine hue
		if (biases[i] < 0) {
			hue = 0;
		} else {
			hue = 200;
		}
		//determine lightness
		let lightness = Math.abs(biases[i])*95 + 5;
		ctx.fillStyle = "hsl("+hue+",100%,"+lightness+"%)";
		
		ctx.fillRect(30 + 5*i, 190, 4, 4);
	}
}

function drawCostSum() {
	ctx.fillStyle = "white";
	ctx.fillText("SUM OF COST VALUES: " + costSum.toFixed(3), 30, 250);
}

function drawPrecision() {
	ctx.fillStyle = "white";
	ctx.fillText("PRECISION         : " + precision, 30, 270);
}

function drawTraining() {
	ctx.fillStyle = "white";
	ctx.fillText("TRAINING          : " + training.toString().toUpperCase(), 30, 290);
}

function drawSetSize() {
	ctx.fillStyle = "white";
	let size = data != null ? data.length : 0;
	ctx.fillText("TRAINING SET SIZE : " + size, 30, 310);
}

function drawActiveMelody() {
	ctx.fillStyle = "white";
	ctx.fillText("ACTIVE MELODY     : " + activeMelody, 30, 330);
}