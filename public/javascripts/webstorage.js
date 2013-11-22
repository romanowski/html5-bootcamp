function withWebStorage(module) {
    if (!localStorage) {
        alert("No webstorage support :(")
    }

    module.notes = {};

    module.saveNote = function (note) {
        module.notes[note.id] = note;
        localStorage.notes = JSON.stringify(module.notes);
        console.info(localStorage.notes, module.notes);
    };

    module.loadNotes = function () {
        module.notes = JSON.parse(localStorage.notes) || {};
    };

    module.getNotes = function () {
        return module.notes;
    };


    return module;
}