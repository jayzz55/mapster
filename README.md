# Mapster
This is a Google Map Api utility tool which is basically an OO abstraction of Google Map API, Google Place Auto-Complete, Marker-Clusterer

## Why should I care about this?
Think of this as a utility belt tool like Batman's but instead of catching the baddies, it's for handling Google Map Api, Google Place, and Marker Clusterer.

This is created as an OO high level absctraction tool that enables one to easily create a custom interactive map. 

By separating the logic of handling the map object, and the list of items / states, it makes the code of creating a custom map to be more portable and easier to re-use on other projects.

## Installation
ensure that the following script is included in your html page in the following order:
 ``` html
 <script src="https://maps.googleapis.com/maps/api/js?sensor=false&libraries=places"></script> // Google map api with Google Place library enabled.
 <script src="/mapster.min.js"></script>
```

## How do I use this?

### To create map
``` javascript
Mapster.create(selector, options)
```

This create a MAP var that initiate the creation of the MAPSTER object. The map is hooked on the DOM element with ID 'map-canvas' and options that can be configured. 

Example:
``` javascript
var MAP = Mapster.create('map-canvas', {
  center: {
    lat: -37.818667,
    lng: 144.971466
  },
  // further optional configuration setting for the map
  zoom: 10,
  disableDefaultUI: false,
  scrollwheel: true,
  draggable: true,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  zoomControlOptions: {
    position: google.maps.ControlPosition.LEFT_BOTTOM,
    style: google.maps.ZoomControlStyle.DEFAULT
  },
  panControlOptions: {
    position: google.maps.ControlPosition.LEFT_BOTTOM
  },
  cluster: {
    options: {
      styles: [{
        url: 'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m2.png',
        height: 56,
        width: 55,
        textColor: '#F00',
        textSize: 18
      },{
        url: 'http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png',
        height: 56,
        width: 55
      }]
    }
  },
  geocoder: true //activate geocoding function
});
```

### To hook Google Place AutoComplete
This will hook the Google Place Auto-Complete on the DOM input element with ID 'txtPlaces'. The snippet code below also passing in the options to attach events, and also limit the Google Autocomplete search.

``` javascript
  MAP.setPlaces('txtPlaces', {
    events: [{
      name: 'place_changed',
      callback: function(e, places){
        var place = places.getPlace();

        MAP.panTo({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    }],
    places: {
      types: ['(regions)'],
      componentRestrictions: {country: "au"}
    }
  });

```

### To use HTML5 and get user's geolocation
This will utilize HTML5 navigator function to get the user's geolocation if the feature is enabled, and then pan the map to the user's location (or to the default location set in map's options if the feature is disabled)
```javascript
 MAP.getCurrentPosition( function(position) {
  MAP.panTo({
    lat: position.coords.latitude,
    lng: position.coords.longitude
  });
});
```
### Add marker on the map
This will add marker onto the map. We can pass in properties to the markers as object. The properties include event, custom styles, marker's properties, or additional properties we'd like to add onto the marker.
```javascript
 MAP.addMarker({
   lat: -37.818667,
   lng: 144.971466,
   animation: google.maps.Animation.DROP,
   content: 'Marker content',
});
```
### Get a list of marker 
The ```findBy``` function takes a callback that allows us to specify a condition. This returned callback will be passed to the List.js logic to filter the markers that satisfy the callback condition.
```javascript
var myGirlMarkers = MAP.findBy(function(marker) { 
    return marker.content === 'I like my girl'
});
```

### EXAMPLE
Refer to the example folder, or the [live demo link](http://jayzz55.github.io/mapster)

## List of Mapster's functions
* ``` zoom()``` = get current map's zoom level.
*  ``` zoom(num)``` = set current map's zoom level to specified num.
*  ``` panTo(coord)``` = pan the map to the specified coord position ```{lat: xx, lng: xx}```.
*  ```geocode(opts)``` = if ```geocoder``` = is enabled in map's options, we can pass in an address to the marker's ```address``` property to geocode the location through google map.
*  ```getCurrentPosition(callback)``` = Get user's current position. this function takes a callback that will be evaluated if the feature is enabled on the user's browser.
*  ```setPlaces(selector, opts)``` = Hook google place to the DOM element with id selector. by passing the callback we can specify the event we want to trigger, eg: on ```place_changed``` event.
*  ```addMarker(opts)``` = add maker onto the map, and passing in options.
*  ```findBy(callback)``` = find the markers that satisfy the condition in the evaluated callback function.
*  ```removeBy(callback)``` = remove the markers that satisfy the condition in the evaluated callback funciton.
*  ```removeAll()``` = remove all marker on the map.
*  ```visibleMarkersCount(selector)``` = count the visible markers on the map and render it on the DOM element with ID selector.

### PACKAGE
```
uglifyjs -c -m -o dist/mapster.min.js src/markerClustererPlus.js src/list.js src/mapster.js
```

## Contributors:
* [David East](https://github.com/davideast) - The main inspiration and the original mind behind mapster.
* [Andrew Buntine](https://github.com/buntine) - Refactoring and making mapster more awesome!

## Credits:
* Big thanks to David East, the library is built upon from one of David's course - [Tutsplus - Custom interactive maps with goole maps api](https://code.tutsplus.com/courses/custom-interactive-maps-with-the-google-maps-api)
