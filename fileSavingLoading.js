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

//loads existing network
function loadNetwork() {
	//TODO
	log("Unimplemented code in getNetwork()!");
}