var noteEditor = function () {
    var self = this;

    self.saveNote = null;

    self.loadNotes = null;

    self.getNotes = null;


    self.init = function () {
        $(".add-note").click(createNode);
        self.loadNotes();
        self.reloadNoteList()
    };

    function createId() {
        return (new Date).getMilliseconds();
    }

    function createNode() {
        var note = {id: createId(), text: "", title: "nowa notatka"};
        self.saveNote(note);
        self.reloadNoteList();
        displayFullNode(note);
    }

    self.reloadNoteList = function () {
        $(".note-list").html("");
        self.getNotes(function (notes) {
            $.map(notes, renderNoteHeader);
        })

    } ;

    function renderNoteHeader(note) {
        $("<li/>").html(note.title)
            .click(displayFullNode(note))
            .attr("header-note-id", note.id)
            .appendTo(".note-list");
    }

    function setCurrent(note) {
        $('.current-note')
            .attr("note-id", note.id)
            .attr("note-title", note.title)
            .attr("note-text", note.text);
    }

    function displayFullNode(note) {
        return function () {
            $(".current-note-text")
                .val(note.text)
                .keyup(saveNoteOnChange(note, 'text'));
            $(".current-note-title")
                .val(note.title)
                .keyup(saveNoteOnChange(note, 'title'));

            $('.current-note').show();
            setCurrent(note);
        }
    }

    function saveNoteOnChange(note, field) {
        return function () {
            var newNote = {
                id: $('.current-note').attr("note-id"),
                title: $('.current-note').attr("note-title"),
                text: $('.current-note').attr("note-text")
            };
            newNote[field] = $(this).val();
            console.info(newNote, field, $(this).val());
            if (field == 'title')
                $("[header-note-id='" + note.id + "']").html(newNote.title);
            displayFullNode(newNote);
            self.saveNote(newNote);
        }
    }
};