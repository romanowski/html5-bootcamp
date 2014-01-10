function geolocation(module) {
	if (!navigator.geolocation) {
		alert("No geolocation support :(");
		return module;
	}

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
	
	function createMap(note){
		var img_url = createImageMapUrl(note)
		$("#mapholder").html("<img src='" + img_url + "'>");
	}
	
	function createImageMapUrl(note){
		var latlon = note.latitude + "," + note.longitude;
		
		return "http://maps.googleapis.com/maps/api/staticmap?center="
		+ latlon
		+ "&zoom=13&size=200x200&maptype=roadmap&markers=color:red%7C"
		+ latlon + "&sensor=false";
	}
	
	function addGetLocationFunction(note) {
		return function getLocation() {
			navigator.geolocation.getCurrentPosition(
					addShowPositionFunction(note), showError);
		};
	}

	function addShowPositionFunction(note) {
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
		var x = $("#demo");
		x.show();
		switch (error.code) {
		case error.PERMISSION_DENIED:
			x.innerHTML = "User denied the request for Geolocation.";
			break;
		case error.POSITION_UNAVAILABLE:
			x.innerHTML = "Location information is unavailable.";
			break;
		case error.TIMEOUT:
			x.innerHTML = "The request to get user location timed out.";
			break;
		case error.UNKNOWN_ERROR:
			x.innerHTML = "An unknown error occurred.";
			break;
		}
	}

	return module;
}