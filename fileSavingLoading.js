//loads training data
function loadData() {
	log("Loading training data...");
	data = [];
	let fileAmt = 0;
	let fileinput = document.getElementById("fileinput");
	
	for (file of fileinput.files) {
		let reader = new FileReader();
		reader.onload = function () {
			data.push(JSON.parse(reader.result));
		}
		reader.readAsText(file, "UTF-8");
		fileAmt++;
	}
	log(fileAmt + " files loaded.");
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

//saves an object as JSON
function saveObject(object, name) {
	let objectString = JSON.stringify(object, null, "\t");
	let a = document.createElement('a');
	let file = new Blob([objectString], {type: "string"});
	a.href = URL.createObjectURL(file);
	a.download = name + ".json";
	a.click();
}

//loads existing network
function loadNetwork() {
	NNinput.click();
}

let NNinput;
NNinput = document.createElement('input');
NNinput.type = 'file';

NNinput.onchange = e => { 
	let file = e.target.files[0]; 
	let reader = new FileReader();
	reader.readAsText(file,'UTF-8');
	reader.onload = readerEvent => {
		network = JSON.parse(readerEvent.target.result);
		log("Object loaded.");
	}
}