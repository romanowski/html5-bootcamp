// asynchronous invocations handler
self.onmessage = function(e) {
	textLength = processNote(e.data.text, e.data.sleep);
	self.postMessage(textLength);
};

function processNote(text, sleepTime){
	sleep(sleepTime);
	return text.length
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	while (true) {
		if ((new Date().getTime() - start) > milliseconds) {
			break;
		};
	};
};