function geolocation(module) {

    // check if geolocation is supported
    if (!navigator.geolocation) {
        alert("No geolocation support :(");
        return module;
    }

    // view building
    module.displayGeolocationControls = function(note) {
        var geolocationButton = $('#geolocationButton');
        var mapholder = $("#mapholder");

        if (!note.latitude && !note.longitude) {
            mapholder.hide();
            geolocationButton.show();
            geolocationButton.unbind('click');
            geolocationButton.click(addGetLocationFunction(note));
        } else {
            geolocationButton.hide();
            mapholder.show();
            createMap(note);
        }
    }

    function createMap(note) {
        var img_url = createImageMapUrl(note);

        $("#mapholder").html("<img src='" + img_url + "'>");
    }

    // display map for given coordinates
    function createImageMapUrl(note) {
        var latlon = note.latitude + "," + note.longitude;

        return "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon
                + "&zoom=13&size=200x200&maptype=roadmap&markers=color:red%7C"
                + latlon + "&sensor=false";
    }

    function addGetLocationFunction(note) {
        // function which returns location
        return function getLocation() {
            $('#geolocationButton').hide();
            navigator.geolocation.getCurrentPosition(
                    getShowPositionFunction(note), showError);
        };
    }

    function getShowPositionFunction(note) {
        // add coordinates to note data, show map and save note to localstoreage
        return function showPosition(position) {
            $('#geolocationButton').hide();
            $("#mapholder").show();

            note['latitude'] = position.coords.latitude;
            note['longitude'] = position.coords.longitude;

            createMap(note);

            saveCoords(note);
        };
    }

    function saveCoords(note) {
        console.info(note);
        module.save(note);
    }

    function showError(error) {
        var errorLabel = $("#geoerror");
        $('#geolocationButton').show();
        errorLabel.show();
        switch (error.code) {
            case error.PERMISSION_DENIED:
                errorLabel.text("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                errorLabel.text("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                errorLabel.text("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                errorLabel.text("An unknown error occurred.");
                break;
        }
    }

    return module;
}