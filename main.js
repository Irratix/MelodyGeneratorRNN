// when the program starts we first need to define a couple things
// here we outline what we need to know and what the program will fundamentally be doing
/*
are we training?
	yes:
		ask for dataset
		are we training an already existing network?
			yes:
				ask for the network 
			no:
				make a new randomized network
		start training
	no, we're generating:
		ask for the network
		ask for melody length
		create a random starting position, and start generating the melody
*/

//some settings
const NET_STATE_SIZE = 100;
const NOTE_RANGE = 25;

let network = null;
let data = null;
let training = false;

function update() {
	if (training) {
		train();
	}
	
	ctx.clearRect(0,0,c.width,c.height);
	drawNetwork();
	drawBias();
	drawCostSum();
	drawPrecision();
	drawTraining();
	drawSetSize();
	drawActiveMelody();
	
	window.requestAnimationFrame(update);
}
update();

//start the training process
function startTraining() {
	log("Starting training...");
	
	if (network == null) {
		log("Error: No network loaded.");
		return;
	}
	
	if (data == null) {
		log("Error: No data loaded.");
		return;
	}
	
	training = true;
}

function stopTraining() {
	training = false;
	log("Stopped training.");
}

//start the generating process
function startGenerating() {
	log("Starting generating...");
	
	if (network == null) {
		log("Error: No network loaded.");
		return;
	}
	
	const melodyLength = (function() {
		return 128;
	})();
	generate(network, melodyLength);
}

//let a network generate melodies
function generate(network, length) {
	let init = getInitialNotes();
	network.resetState();
	network.calculateState(init);
	let melody = [];
	for (let i=0; i<length; i++) {
		melody[i] = network.getOutput().matrix;
		network.calculateState(new Matrix(melody[i]));
	}
	
	for (let i=0; i<melody.length; i++) {
		melody[i] = melody[i][0];
		
		//convert to 0s and 1s
		melody[i] = melody[i].map(x => x > 0.1 ? 1 : 0);
		console.log(melody[i]);
	}
	
	saveObject(melody, "melody");
}

//gets first notes for the generating process 
function getInitialNotes() {
	//TODO
	let vector = new Matrix(1,NOTE_RANGE);
	return vector.withFunction(x => Math.floor(2*Math.random()));
}

//initializes a new network
function initNetwork() {
	log("Initialized new network.");
	network = new NeuralNet(NET_STATE_SIZE, NOTE_RANGE, NOTE_RANGE);
}