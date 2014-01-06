function filesystem(module) {

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }


    var oldInit = module.init;
    module.init = function () {
        oldInit();

        var holder = document.getElementById("load");

        holder.ondragover = function () {
            this.className = 'hover';
            return false;
        };

        holder.ondragend = function () {
            this.className = '';
            return false;
        };

        holder.ondrop = function (e) {
            this.className = '';
            e.preventDefault();
            $.each(e.dataTransfer.files, readSingleFile);

            return false;
        };


    };

    var parseTextToNotes = function (text) {
        try {
            var data = JSON.parse(text);
            for (var d in data) {
                module.saveNote(data[d]);
                module.reloadNoteList();
            }
        } catch (e) {
            console.error(e.message, e)
            alert("Invalid data - only json supporded")
        }
    };

    var contentOfFileRead = function (event) {
        parseTextToNotes(event.target.result);
    };

    var readSingleFile = function (index, file) {
        var reader = new FileReader();
        reader.onload = contentOfFileRead;
        reader.readAsText(file);
    };


    return module;
}