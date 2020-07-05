// html div element for logging
var logbox = document.getElementById("log");

// on-screen log
function log(msg) {
	if (typeof msg != "string") {
		msg = JSON.stringify(msg);
	}
	logbox.innerHTML = time() + " " + msg + "<br>" + logbox.innerHTML;
	logbox.innerHTML = logbox.innerHTML.substring(0,10000);
}

// get time as [HH:MM] string
function time() {
	var date = new Date();
	let minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
	let hours = (date.getHours() < 10 ? '0' : '') + date.getHours();
	return "[" + hours + ":" + minutes + "]";
}