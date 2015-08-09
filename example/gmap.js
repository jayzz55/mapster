var MAP,
    venueSelected,
    venueDogFriendly;

$(document).ready(function() {

  MAP = Mapster.create('map-canvas', Mapster.MAP_OPTIONS);

   MAP.setPlaces('txtPlaces', {
    events: [{
      name: 'place_changed',
      callback: function(e, places){
        var place = places.getPlace();
        console.log(place.geometry.location);
      }
    }]
  });

  MAP.getCurrentPosition( function(position) {
    var lat = position.coords.latitude,
        lng = position.coords.longitude;

    MAP.panTo({
      lat: lat,
      lng: lng
    });      

  });

  seedData();

  displayVisibleMarker('total-result');
  
})

function seedData() {
  for (var i = 0; i < 40; i++) {
    MAP.addMarker({
      lat: -37.818667 + Math.random()/50,
      lng: 144.971466 + Math.random()/50,
      animation: google.maps.Animation.DROP,
      content: 'I like my girl',
      venue_type: 'romantic',
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

function displayVisibleMarker(selector) {
  var visibleMarkers = MAP.findBy(function(marker) {
    return marker.getVisible();
  });

  document.getElementById(selector).innerHTML = visibleMarkers.length;

}

function evaluateCondition(base, collection) {
  var result = false;
  $.each(collection, function() {
    result = result || (base === $(this).val());
  });
  return result;
}

$('input').on('change', function() {
  var venueTypeChecked = $('input[name="venue_type"]:checked'),
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

  displayVisibleMarker('total-result');

});

