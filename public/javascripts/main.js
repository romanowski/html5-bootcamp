var noteEditor = function () {
    var self = this;

    self.saveNote = null;

    self.loadNotes = null;

    self.getNotes = null;


    self.init = function () {
        $(".add-note").click(createNode);
        self.loadNotes();
        reloadNoteList()
    };

    function createId() {
        return (new Date).getMilliseconds();
    }

    function createNode() {
        var note = {id: createId(), text: "", title: "nowa notatka"};
        self.saveNote(note);
        reloadNoteList();
        displayFullNode(note);
    }

    function reloadNoteList() {
        $(".note-list").html("");
        $.map(self.getNotes(), renderNoteHeader);
    }

    function renderNoteHeader(note) {
        $("<li/>").html(note.title)
            .click(displayFullNode(note))
            .appendTo(".note-list");
    }

    function displayFullNode(note) {
        return function () {
            $(".current-note-text")
                .val(note.text)
                .keypress(saveNoteOnChange(note, 'text'));
            $(".current-note-title")
                .val(note.title)
                .keypress(saveNoteOnChange(note, 'title'));
            $('.current-note').show();
        }
    }

    function saveNoteOnChange(note, field) {
        return function () {
            note[field] = $(this).val();
            self.saveNote(note);
        }
    }
};