(function(window, google, mapster) {
  mapster.MAP_OPTIONS = {
    center: {
      lat: -37.818667,
      lng: 144.971466
    },
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    cluster: true
  };
  
}(window, google, window.Mapster || (window.Mapster = {})))
