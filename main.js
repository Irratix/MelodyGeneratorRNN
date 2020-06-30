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
	
	train(network, data);
}

//train a network on a dataset
function train(network, data) {
	//TODO
}

//start the generating process
function startGenerating() {
	log("Starting generating...");
	
	if (network == null) {
		log("Error: No network loaded.");
		return;
	}
	
	const melodyLength = (function() {
		return 64;
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
	}
}

//gets first notes for the generating process 
function getInitialNotes() {
	//TODO
	let vector = new Matrix(1,NOTE_RANGE);
	return vector.withFunction(x => Math.floor(2*Math.random()));
}

//loads training data
function loadData() {
	//TODO
	log("Unimplemented code in loadData()!");
}

//loads existing network
function loadNetwork() {
	//TODO
	log("Unimplemented code in getNetwork()!");
}

//initializes a new network
function initNetwork() {
	log("Initialized new network.");
	network = new NeuralNet(NET_STATE_SIZE, NOTE_RANGE, NOTE_RANGE);
}

//saves current network
function saveNetwork() {
	let objectString = JSON.stringify(network, null, "\t");
	let a = document.createElement('a');
	let file = new Blob([objectString], {type: "string"});
	a.href = URL.createObjectURL(file);
	a.download = "network.json";
	a.click();
}