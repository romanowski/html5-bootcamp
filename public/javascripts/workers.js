function workers(module) {

    // check if web workers are supported
    if (typeof (Worker) == "undefined") {
        alert("No web workers support :(");
        return module;
    }

    // variables declaration

    SLEEP_TIME = 500;

    turnWorkerOn = false;
    sleepTime = SLEEP_TIME;

    workersEnabledInfo = "Workers enabled";
    workersDisabledInfo = "Workers disabled";

    // view creation

    $("#workersControls").show();
    $("#enableWorker").click(getTurnWorkerFunction());

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

    disableLatencyButton = $("#disableLatency");
    disableLatencyButton.click(function() {
        if (sleepTime != 0) {
            sleepTime = 0;
        } else {
            sleepTime = SLEEP_TIME;
        }
        $("#latencyValue").text(sleepTime);
    });
    $("#workerStateInfo").text(workersEnabledInfo);
    $("#workerStateInfo").css('color', 'green');

    // web worker creation

    var saver = new Worker("javascripts/worker/saveWorker.js");

    setWorkerUpdate(); // sets that we want to use web worker to count number
    // of characters in edited node

    function setWorkerUpdate() {
        // overwrite save fuction, threre will be added a functionality to count
        // and display number of chars in edited note before saving it to
        // webstoreage
        module.save = function(note) {
            // here we post a message to webworker
            saver.postMessage({
                'sleep' : sleepTime,
                'text' : note.text
            });

            // this part will be invoked by webworker when she finishes her
            // asynchronous word count.
            // Notice that we are not able to modify any DOM element
            // asynchronusely
            // inside web woreker
            saver.onmessage = function(e) {
                var charsNumber = e.data;
                updateCharsNumberAndSave(charsNumber, note);
            };
        };
    }

    // instead of counting words inside worker count them in normal, synchronous
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

    // function counting words, it is implemented in a way which will generate
    // noticeable lags
    function processNote(text, sleepTime) {
        sleep(sleepTime);
        return text.length;
    }

    function sleep(milliseconds) {
        var start = new Date().getTime();
        while (true) {
            if ((new Date().getTime() - start) > milliseconds) {
                break;
            };
        };
    };

    return module;
}