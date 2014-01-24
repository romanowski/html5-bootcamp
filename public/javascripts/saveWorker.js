importScripts("processText.js");

// asynchronous invocations handler
self.onmessage = function(e) {
    textLength = processNote(e.data.text, e.data.sleep);
    self.postMessage(textLength);
};