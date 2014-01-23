var noteEditor = function() {
    var self = this;

    self.saveNote = null;
    self.loadNotes = null;
    self.getNotes = null;
    self.displayGeolocationControls = null;

    self.init = function() {
        $(".add-note").click(createNode);
        self.loadNotes();
        self.reloadNoteList();
    };

    function createNode() {
        var note = {
            id : createId(),
            text : "",
            title : "nowa notatka",
            latitutde : null,
            longitude : null
        };
        self.saveNote(note);
        self.reloadNoteList();
        self.displayFullNode(note);
    }

    function createId() {
        return (new Date).getMilliseconds();
    }

    self.displayFullNode = function(note) {
        return function() {
            displayNodeContent(note);
            if (self.displayGeolocationControls) {
                self.displayGeolocationControls(note);
            }
        };
    }

    function displayNodeContent(note) {
        $(".current-note-text").val(note.text).unbind('keyup').keyup(
                saveNoteOnChange(note, 'text'));
        $(".current-note-title").val(note.title).unbind('keyup').keyup(
                saveNoteOnChange(note, 'title'));

        $('.current-note').show();
        $("#charsCount").text(note.text.length);
        $("#demo").hide();
        setCurrent(note);
    }

    function setCurrent(note) {
        $('.current-note').attr("note-id", note.id).attr("note-title",
                note.title).attr("note-text", note.text);
    }

    self.reloadNoteList = function() {
        $(".note-list").html("");
        self.getNotes(function(notes) {
            $.map(notes, renderNoteHeader);
        });
    };

    function renderNoteHeader(note) {
        var li = $("<li/>");
        li.html(note.title).click(self.displayFullNode(note)).attr(
                "header-note-id", note.id).addClass('note-list-entry').hover(
                addTextHighlight(li), removeTextHighlight(li)).appendTo(
                ".note-list");
    }

    function addTextHighlight(element) {
        return function() {
            element.addClass('highlighted-text');
        };
    }

    function removeTextHighlight(element) {
        return function() {
            element.removeClass('highlighted-text');
        };
    }

    function saveNoteOnChange(note, field) {
        return function() {
            var newNote = {
                id : note.id,
                title : note.title,
                text : note.text,
                latitutde : note.latitutde,
                longitude : note.longitude
            };
            note[field] = $(this).val();
            newNote[field] = note[field];
            // console.info(newNote, field, $(this).val(), note.id);
            if (field == 'title') {
                $("[header-note-id='" + note.id + "']").html(note.title);
            }
            self.save(note);
        };
    }

    self.save = function(note) {
        self.saveDataAndReloadNode(note);
    }

    self.saveDataAndReloadNode = function(note) {
        self.displayFullNode(note);
        self.saveNote(note);
    }
};