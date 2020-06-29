var logbox = document.getElementById("log");

console.log = (function (old_function, div_log) {
	return function (text) {
		old_function(text);
		div_log.innerHTML += time() + " " + text + "<br>";
	};
} (console.log.bind(console), logbox));

function time() {
	var date = new Date();
	return "[" + date.getHours() + ":" + date.getMinutes() + "]";
}