var MAP,
    venueTypeChecked,
    venueDogFriendlyChecked;

$(document).ready(function() {

  // Initialize & Create the google map on DOM element ID 'map-canvas'.
  MAP = Mapster.create('map-canvas', {
    center: {
      lat: -37.818667,
      lng: 144.971466
    },
    cluster: true
  });

  // Hook the Google Place Auto-Complete utility on input with ID 'txtPlaces'.
  MAP.setPlaces('txtPlaces', {
    events: [{
      name: 'place_changed',
      callback: function(e, places){
        var place = places.getPlace();

        MAP.panTo({
          lat: place.geometry.location.G,
          lng: place.geometry.location.K
        });
      }
    }]
  });

  // Using HTML5 navigator to get geolocation if the feature is available and then pan the map to the location.
  MAP.getCurrentPosition( function(position) {
    MAP.panTo({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
  });

  seedData();

  MAP.visibleMarkersCount('total-result');

})

// seed data
function seedData() {
  for (var i = 0; i < 40; i++) {
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'I like my girl',
      venue_type: 'romantic', // Custom attributes.
      venue_dog_friendly: 'yes'
    });
    
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'You cant get any more awesome than this',
      venue_type: 'awesome',
      venue_dog_friendly: 'yes'
    }); 
  } 

  for (var i = 0; i < 20; i++) {
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'I like my girl',
      venue_type: 'romantic',
      venue_dog_friendly: 'no'
    });
    
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'You cant get any more awesome than this',
      venue_type: 'awesome',
      venue_dog_friendly: 'no'
    }); 
  }

  for (var i = 0; i < 10; i++) {
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'This place sucks',
      venue_type: 'boring',
      venue_dog_friendly: 'no'
    });
  }
};

// evaluate the OR condition across a name category
function evaluateCondition(base, collection) {
  var result = false;
  $.each(collection, function() {
    result = result || (base === $(this).val());
  });
  return result;
}

// add on 'Change' event handler on the input checkbox
$('input[type="checkbox"]').on('change', function() {
  venueTypeChecked = $('input[name="venue_type"]:checked');
  venueDogFriendlyChecked = $('input[name="venue_dog_friendly"]:checked');
       
  MAP.findBy(function(marker) {
    var totalCond = evaluateCondition(marker.venue_type, venueTypeChecked) &&
                    evaluateCondition(marker.venue_dog_friendly, venueDogFriendlyChecked);
        
    marker.setVisible(totalCond);
  });

  MAP.markerClusterer.repaint();

  MAP.visibleMarkersCount('total-result');

});
