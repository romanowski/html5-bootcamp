function naiveStorage(module) {
    module.notes = [];

    module.saveNote = function (note) {
        module.notes.push(note);
    };

    module.loadNotes = function () {
        module.notes = [];
    };

    module.getNotes = function (callback) {
        callback(module.notes);
    };


    return module;
}