function filesystem(module) {

    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }


    var oldInit = module.init;
    module.init = function () {
        oldInit();

        //get holder
        var holder = document.getElementById("load");

        //add class - to mark it
        holder.ondragover = function () {
            this.className = 'hover';
            return false;
        };

        //unmark it
        holder.ondragend = function () {
            this.className = '';
            return false;
        };

        //on drop - when user drop file
        holder.ondrop = function (e) {
            this.className = '';
            e.preventDefault();
            $.each(e.dataTransfer.files, readSingleFile);
            input.files = e.dataTransfer.files;
            return false;
        };


        var input = document.getElementById("load-input");

        input.onchange = function (e) {
            $.each(e.dataTransfer.files, readSingleFile);
        }


    };

    var readSingleFile = function (index, file) {
        var reader = new FileReader();
        reader.onload = contentOfFileRead;
        reader.readAsText(file);
    };

    var contentOfFileRead = function (event) {
        parseTextToNotes(event.target.result);
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
    
    return module;
}