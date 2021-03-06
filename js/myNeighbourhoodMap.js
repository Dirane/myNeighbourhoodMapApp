// Place Class completely builds everything needed for each Place marker.
var Place = function(title, lng, lat, venueId) {
	var self = this;
	this.title = title;
	this.lng = lng;
	this.lat = lat;
	this.venueId = venueId;

// getConetent function retrieves 5 most recent tips from foursquare for the marker Place.
	this.getContent = function() {
		var topTips = [];
		var venueUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/tips?sort=recent&limit=5&v=20131124&client_id=OIMLANYCX4OK0FAVBFVAYNRXLMNKWACXQCUPIC2XW34PTPLE&client_secret=5TF5ZFIMJHMT3ECQEH0YCVQGLNDD2TZBYFRZY2UK1LLF41YM';

		$.getJSON(venueUrl,
			function(data) {
				$.each(data.response.tips.items, function(i, tips){
					topTips.push('<li>' + tips.text + '</li>');
				});

			}).done(function(){

				self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<ol class="tips">' + topTips.join('') + '</ol>';
			}).fail(function(jqXHR, textStatus, errorThrown) {
				self.content = '<h2>' + self.title + '</h2>' + '<h3>5 Most Recent Comments</h3>' + '<h4>Oops. There was a problem retrieving this Place\'s comments.</h4>';				
				console.log('getJSON request failed! ' + textStatus);
			});
		}();

		this.infowindow = new google.maps.InfoWindow();

		
		this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(self.lng, self.lat),
			map: map,
			title: self.title,
			icon: self.icon
		});

		// Opens the info window for the Place marker.
		this.openInfowindow = function() {
			for (var i=0; i < placesModel.places.length; i++) {
   			placesModel.places[i].infowindow.close();
  		}
			map.panTo(self.marker.getPosition())
			self.infowindow.setContent(self.content);
			self.infowindow.open(map,self.marker);
		};

		// A click event listener to enable the marker open the info window.
		this.addListener = google.maps.event.addListener(self.marker,'click', (this.openInfowindow));
	};

	// Contains all the places and search function.
	var placesModel = {

		places:[
		//new Place('University Of Buea', 4.161446, 9.290732, '4cdd6918d4ecb1f701298548'),
		new Place('University Of Buea', 4.161446, 9.290732, 'ChIJQzTKNpIxYRARd0ST6rDHtr4'),
		new Place('Chariot Hotel Buea', 4.157975, 0.296515, 'ChIJcT94s5QxYRARQCK3Yglrqhc'),
		new Place('ActivSpaces Buea', 4.153117, 9.255252, 'ChIJrz8KIz8yYRARKgess8WF5Vo'),
		new Place('Fakoship Plaza', 4.154326, 9.234717, 'ChIJk6byWl8yYRAR7saV6SkTgUc'),
		new Place('Rhema Restaurant', 4.151131, 9.250948, 'ChIJOemdgUYyYRAR58rV6_8JtCs'),
		new Place('Molyko Omnisport Stadium', 4.162015, 9.279930, 'ChIJ3YySefUxYRARhK4n8hO_1dE'),
		new Place('Malingo Street', 4.1588855, 9.292790, 'ChIJMUinyOwxYRAR1ygcejjetGk'),
		new Place('IYA Restaurant', 4.153185, 9.244418, 'ChIJEXb2WFsyYRARsJ2aAaW3XbA'),
		new Place('Eta Palace Hotel', 4.151576, 9.296810, 'ChIJZyCG6ZYxYRARnp1J8eLin8k'),
		new Place('Mount Cameroon', 4.224752, 9.213144, 'ChIJEcUaSt_SZhARp1XRcl66rfc'),
		new Place('Sandpit Road', 4.146506, 9.282099, 'ChIJt2TEhSUyYRARAjd1MrMJVnA'),
		],
		query: ko.observable(''),
	};


	// Search function for filtering through the list of places based on the name of the Place.
	placesModel.search = ko.dependentObservable(function() {
		var self = this;
		var search = this.query().toLowerCase();
		return ko.utils.arrayFilter(self.places, function(Place) {
			return Place.title.toLowerCase().indexOf(search) >= 0;a
		});
	}, placesModel);

	ko.applyBindings(placesModel);