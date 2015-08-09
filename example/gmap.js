var MAP,
    venueTypeChecked,
    venueDogFriendlyChecked;

$(document).ready(function() {

  // Initialize & Create the google map on DOM element ID 'map-canvas' with the configured MAP_OPTIONS from mapOptions.js.
  MAP = Mapster.create('map-canvas', Mapster.MAP_OPTIONS);

  // Hook the Google Place Auto-Complete utility on input with ID 'txtPlaces'.
  MAP.setPlaces('txtPlaces', {
    events: [{
      name: 'place_changed',
      callback: function(e, places){
        var place = places.getPlace();
        console.log(place.geometry.location);
      }
    }]
  });

  // Using HTML5 navigator to get geolocation if the feature is available and then pan the map to the location.
  MAP.getCurrentPosition( function(position) {
    var lat = position.coords.latitude,
        lng = position.coords.longitude;

    MAP.panTo({
      lat: lat,
      lng: lng
    });      

  });

  // Seed data by adding markers
  seedData();

  // Dipslay visible markers count
  MAP.visibleMarkersCount('total-result');
  
})

// seed data
function seedData() {
  for (var i = 0; i < 40; i++) {
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50, // Specifiy the lat prop of the marker
      lng: 144.971466 + Math.random()/50, // Specifiy the lng prop of the marker

      animation: google.maps.Animation.DROP, // add animation to the marker property
      content: 'I like my girl', // add content info to the marker property.
      venue_type: 'romantic', // add venue_type attribute on the marker
      venue_dog_friendly: 'yes' // add venue_dog_friendly attribute on the marker
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
    var totalCondition1 = false,
        totalCondition2 = false;

    totalCondition1 = evaluateCondition(marker.venue_type, venueTypeChecked);
    totalCondition2 = evaluateCondition(marker.venue_dog_friendly, venueDogFriendlyChecked);
        
    if (totalCondition1 && totalCondition2) {
      marker.setVisible(true);
    } else {
      marker.setVisible(false);
    };
  });

  MAP.markerClusterer.repaint();

  MAP.visibleMarkersCount('total-result');

});
