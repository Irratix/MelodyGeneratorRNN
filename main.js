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

//initialize the training process
function initTraining() {
	console.log("initializing training");
	let data = getData();
	const useExistingNetwork  = (function() {
		return "y" == prompt("Continue training existing network? (y/n)\nIf we're not using an existing network we will be training from scratch");
	})();
	let network;
	if (useExistingNetwork) {
		network = getNetwork();
	} else {
		network = new NeuralNet(NET_STATE_SIZE, NOTE_RANGE, NOTE_RANGE);
	}
	train(network, data);
}

//train a network on a dataset
function train(network, data) {
	//TODO
}

//initialize generating process
function initGenerating() {
	console.log("initializing generating");
	let network = getNetwork();
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
	console.log(network);
	console.log(melody);
	console.log(JSON.stringify(melody));
}

//gets first notes for the generating process 
function getInitialNotes() {
	//TODO
	let vector = new Matrix(1,NOTE_RANGE);
	return vector.withFunction(x => Math.floor(2*Math.random()));
}

//asks for training data and returns it
function getData() {
	//TODO
	return [];
}

//asks for an existing neural network and returns it
function getNetwork() {
	//TODO 
	return new NeuralNet(NET_STATE_SIZE, NOTE_RANGE, NOTE_RANGE);
}