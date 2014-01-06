function webSQL(module) {

    var db = openDatabase('notes', '1.0', 'Notes', 10 * 1024 * 1024);

    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS NOTES (id UNIQUE, "text" text, title text)');
    });

    module.saveNote = function (note) {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM NOTES WHERE id = ?', [note.id], function (tx, results) {
                console.info(results.rows.length);
                if (results.rows.length) {
                    tx.executeSql('UPDATE NOTES  SET title = ?, text =? WHERE id = ?', [note.title, note.text, note.id]);
                } else {
                    tx.executeSql('INSERT INTO NOTES  VALUES (?, ?, ?)', [note.id, note.text, note.title]);
                }
            });

        });
    };

    module.loadNotes = function () {
    };

    module.getNotes = function (callback) {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM NOTES', [], function (tx, results) {
                var len = results.rows.length, i;
                var notes = [];
                for (i = 0; i < len; i++) {
                    notes.push(results.rows.item(i));
                }
                console.info(notes);
                callback(notes);
            }, null);
        });
    };

    return module;
}