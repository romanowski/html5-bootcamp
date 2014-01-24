function geolocation(module) {

    // check if geolocation is supported
    if (!navigator.geolocation) {
        alert("No geolocation support :(");
        return module;
    }

    // view building - add action of showing map to button and display proper
    // components
    module.displayGeolocationControls = function(note) {
        var geolocationButton = $('#geolocationButton');
        var mapholder = $("#mapholder");

        // if note do not possess location data do not show map element
        if (!note.latitude && !note.longitude) {
            mapholder.hide();
            geolocationButton.show();
            geolocationButton.unbind('click');
            geolocationButton.click(addGetLocationFunction(note));
            // if note has location data hide 'Add map button' and show map
        } else {
            geolocationButton.hide();
            mapholder.show();
            createMap(note);
        }
    }

    // get map url and attach do given eleemnt
    function createMap(note) {
        var img_url = createImageMapUrl(note);

        $("#mapholder").html("<img src='" + img_url + "'>");
    }

    // create map URL for given coordinates via Google Maps Image API
    function createImageMapUrl(note) {
        var latlon = note.latitude + "," + note.longitude;

        return "http://maps.googleapis.com/maps/api/staticmap?center=" + latlon
                + "&zoom=13&size=200x200&maptype=roadmap&markers=color:red%7C"
                + latlon + "&sensor=false";
    }

    // creates function which returns geolocation data or informs why they
    // cannot be acquired
    function addGetLocationFunction(note) {
        return function getLocation() {
            $('#geolocationButton').hide();
            navigator.geolocation.getCurrentPosition(
                    getShowPositionFunction(note), showError);
        };
    }

    // creates handler for cuccessful data acquairing
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

    // save geolocation data to local storeage for given node
    function saveCoords(note) {
        console.info(note);
        module.save(note);
    }

    // a handle for filed geolocation data request, displays a message why data
    // could not have been loaded
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