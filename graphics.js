var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d", {alpha: false});
c.width = 900;
c.height = 500;

function drawNetwork() {
	ctx.fillStyle = "white";
	ctx.font = "12px Verdana";
	ctx.fillText("OUTPUT WEIGHT MATRIX", 30, 25);
	
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
			let lightness = Math.abs(weights[i][j])*90 + 10;
			ctx.fillStyle = "hsl("+hue+",100%,"+lightness+"%)";
			
			ctx.fillRect(30 + 5*i, 30+5*j, 4, 4);
		}
	}
}

function drawBias() {
	ctx.fillStyle = "white";
	ctx.font = "12px Verdana";
	ctx.fillText("BIASES", 30, 185);
	
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
		let lightness = Math.abs(biases[i])*90 + 10;
		ctx.fillStyle = "hsl("+hue+",100%,"+lightness+"%)";
		
		ctx.fillRect(30 + 5*i, 190, 4, 4);
	}
}

function drawCostSum() {
	ctx.fillStyle = "white";
	ctx.fillText("SUM OF COST VALUES: " + totalCost.toFixed(3), 30, 250);
}