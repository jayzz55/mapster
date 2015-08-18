(function(window, google) {
  
  var Mapster = (function() {

    function Mapster(selector, opts) {
      var element = document.getElementById(selector);

      if (!opts.zoom) {
        opts.zoom = 16;
      }

      if (!opts.mapTypeId) {
        opts.mapTypeId = google.maps.MapTypeId.ROADMAP;
      }

      this.gMap = new google.maps.Map(element, opts);
      this.infoWindows = List.create();
      this.markers = List.create();

      if (opts.cluster) {
        this.markerClusterer = new MarkerClusterer(this.gMap, [], { ignoreHidden: true } );
      }

      if (opts.geocoder) {
        this.geocoder = new google.maps.Geocoder();
      }
    }

    Mapster.prototype = {

      zoom: function(level) {
        if (level) {
          this.gMap.setZoom(level);
        }

        return this.gMap.getZoom();
      },

      panTo: function(coords) {
        this.gMap.panTo(coords);
      },

      _on: function(opts) {
        var self = this;
        google.maps.event.addListener(opts.obj, opts.event, function(e){
          opts.callback.call(self, e, opts.obj);
        });
      },

      geocode: function(opts) {
        this.geocoder.geocode({
          address: opts.address
        }, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            opts.success.call(this, results, status);
          } else {
            opts.error.call(this, status);
          }
        });
      },

      getCurrentPosition: function(callback) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(callback);
        }
      },

     setPlaces: function(selector, opts) {
        var element = document.getElementById(selector),
            places = new google.maps.places.Autocomplete(element);
        
        this._attachEvents(places, opts.events);
      },

      addMarker: function(opts){
        var marker,
            infoWindow;

        opts.position = {
          lat: opts.lat,
          lng: opts.lng
        }

        marker = this._createMarker(opts);

        if (this.markerClusterer) {
          this.markerClusterer.addMarker(marker);  
        }
        
        this.markers.add(marker);

        if (opts.events) {
          this._attachEvents(marker, opts.events);
        }

        if (opts.content) {
          this._attachInfoWindow(opts, marker);
         }
        
        return marker;
      },

      _attachInfoWindow: function(opts, marker) {
        var infoWindow = new google.maps.InfoWindow({
          content: opts.content
        });
        
        this.infoWindows.add(infoWindow);
        
        this._on({
          obj: marker,
          event: 'click',
          callback: function() {
            this.infoWindows.items.forEach(function(infoWindow) {
              infoWindow.close();
            });

            infoWindow.open(this.gMap, marker);
          }
        })
      },

      _attachEvents: function(obj, events) {
        events.forEach(function(event) {
          this._on({
            obj: obj,
            event: event.name,
            callback: event.callback
          });
        }.bind(this));
      },

      findBy: function(callback) {
        return this.markers.find(callback);
      },

      removeBy: function(callback) {
        var set = this.markers.find(callback);
        this._remove(set);
      },

      removeAll: function() {
        this._remove(this.markers.items);
      },

      _remove: function(markers) {
        var mapster = this,
            set = this._clone(markers);

        set.forEach(function(marker) {
          if (mapster.markerClusterer) {
            mapster.markerClusterer.removeMarker(marker);
          } else {
            marker.setMap(null);              
          }

          mapster.markers.remove(marker);
        });

        return mapster.markers;
      },

      _clone: function(o) {
        var copy = Object.create(Object.getPrototypeOf(o));
        var propNames = Object.getOwnPropertyNames(o);

        propNames.forEach(function(name) {
          var desc = Object.getOwnPropertyDescriptor(o, name);
          Object.defineProperty(copy, name, desc);
        });

        return copy;
      },

      _createMarker: function(opts) {
        opts.map = this.gMap;
        return new google.maps.Marker(opts);
      },

      visibleMarkersCount: function(selector) {
        var visibleMarkers = this.findBy(function(marker) {
          return marker.getVisible();
        });

        document.getElementById(selector).innerHTML = visibleMarkers.length;
      }
    };

    return Mapster;

  }());
  
  Mapster.create = function(element, opts) {
    return new Mapster(element, opts);
  };
  
  window.Mapster = Mapster;
  
}(window, google));
