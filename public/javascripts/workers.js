function workers(module) {
	if (typeof (Worker) == "undefined") {
		alert("No web workers support :(");
		return module;
	}

	var saver = new Worker("javascripts/worker/saveWorker.js");
	
	saver.onmessage = function(note) {
		console.info("saved");
    	module.sleep(100);
        module.displayFullNode(note);
        module.saveNote(note);
    };
    
    function sleep(milliseconds) {
		var start = new Date().getTime();
		while (true) {
			if ((new Date().getTime() - start) > milliseconds) {
				break;
			};
		};
	};
    
    module.save = function(note){
    	saver.postMessage(note);
    };
    
    return module;
}