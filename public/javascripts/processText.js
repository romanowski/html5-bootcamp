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
