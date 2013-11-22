function naiveStorage(module) {
    module.notes = [];

    module.saveNote = function (note) {
        module.notes.push(note);
    };

    module.loadNotes = function () {
        module.notes = [];
    };

    module.getNotes = function () {
        return module.notes;
    };


    return module;
}