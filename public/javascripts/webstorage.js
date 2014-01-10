function withWebStorage(module) {
    if (!localStorage) {
        alert("No webstorage support :(");
    }

    module.notes = {};

    module.saveNote = function (note) {
        module.notes[note.id] = note;
        localStorage.notes = JSON.stringify(module.notes);
        console.info(module.notes);
    };

    module.loadNotes = function () {
        localStorage.notes = localStorage.notes || "{}";
        module.notes = JSON.parse(localStorage.notes) || {};
    };

    module.getNotes = function (callback) {
        callback(module.notes);
    };

    return module;
}