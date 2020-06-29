//div object for logging
var logbox = document.getElementById("log");

//on-screen log
function log(msg) {
	if (typeof msg != "string") {
		msg = JSON.stringify(msg);
	}
	logbox.innerHTML = time() + " " + msg + "<br>" + logbox.innerHTML;
}

//get time as HH:MM string
function time() {
	var date = new Date();
	return "[" + date.getHours() + ":" + date.getMinutes() + "]";
}