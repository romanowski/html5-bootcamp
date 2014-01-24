function workers(module) {

    // check if web workers are supported
    if (typeof (Worker) == "undefined") {
        alert("No web workers support :(");
        return module;
    }

    // variables declaration

    LATENCY_TIME = 500;

    turnWorkerOn = false;
    sleepTime = LATENCY_TIME; // latency of words countig function

    workersEnabledInfo = "Workers enabled";
    workersDisabledInfo = "Workers disabled";

    // view creation
    $("#workersControls").show();
    $("#enableWorker").click(getTurnWorkerFunction());

    // add turn workers on/off behavipur to 'Toggle workers' button
    function getTurnWorkerFunction() {
        return function turnWorker() {
            if (turnWorkerOn) {
                setWorkerUpdate();
                $("#workerStateInfo").text(workersEnabledInfo);
                $("#workerStateInfo").css('color', 'green');
            } else {
                setNonWorkerUpdate();
                $("#workerStateInfo").text(workersDisabledInfo);
                $("#workerStateInfo").css('color', 'red');
            }
            turnWorkerOn = !turnWorkerOn;
        };
    }

    $("#latencyValue").text(sleepTime);

    // add actions to 'Toggle latency button'
    disableLatencyButton = $("#disableLatency");
    disableLatencyButton.click(function() {
        if (sleepTime != 0) {
            sleepTime = 0;
        } else {
            sleepTime = LATENCY_TIME;
        }
        $("#latencyValue").text(sleepTime);
    });
    $("#workerStateInfo").text(workersEnabledInfo);
    $("#workerStateInfo").css('color', 'green');

    // web worker creation

    var saver = new Worker("javascripts/saveWorker.js");

    setWorkerUpdate(); // sets that we want to use web worker to count number
    // of characters in edited node

    function setWorkerUpdate() {
        // overwrite save fuction, threre will be added a functionality to count
        // and display number of chars in edited note before saving it to
        // webstoreage
        module.save = function(note) {
            // here we post a message to webworker, worker asynchronousely
            // counts character numbers
            saver.postMessage({
                'sleep' : sleepTime,
                'text' : note.text
            });

            // this part will be invoked by webworker when she finishes her
            // asynchronous word count.
            // Notice that we are not able to modify any DOM element
            // asynchronusely inside web woreker we have to do it right here (in
            // main thread)
            saver.onmessage = function(e) {
                var charsNumber = e.data;
                updateCharsNumberAndSave(charsNumber, note);
            };
        };
    }

    // toggles asynchronous behaviour on sequential, instead of counting words
    // inside worker count them in normal, synchronous
    // way, used to compare user expirience,
    function setNonWorkerUpdate() {
        module.save = function(note) {
            charsNumber = processNote(note.text, sleepTime);
            updateCharsNumberAndSave(charsNumber, note);
        };
    }

    // increment word count label (this cannot be done inside webworker
    // asynchronous call as web workers do not
    // have access to any DOM elements and also print some data on console (
    // currently not all browsers enable console object
    // to be accesed by webworker (eg. Firefox))
    function updateCharsNumberAndSave(charsNumber, note) {
        console.info("Chars number : " + charsNumber);
        $("#charsCount").text(charsNumber);
        module.saveDataAndReloadNode(note);
    }

    return module;
}