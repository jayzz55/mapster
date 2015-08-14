(function(window, google) {
  
  var Mapster = (function() {

    function Mapster(selector, opts) {

      if (opts === undefined) {
        opts = {
          center: {
            lat: -37.818667,
            lng: 144.971466
          },
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      }

      var element = document.getElementById(selector);

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
        } else {
          return this.gMap.getZoom();
        }
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
          navigator.geolocation.getCurrentPosition(function(position) {
            callback.call(this, position);
          });
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
        var matches;

        matches = this.markers.find(callback, function(markers) {
          markers.forEach(function(marker) {
            if (this.markerClusterer) {
              this.markerClusterer.removeMarker(marker);
            } else {
              marker.setMap(null);              
            }
          }.bind(this));
        }.bind(this));

        matches.forEach(function(match) {
          this.markers.remove(match);
        }.bind(this));

        return this.markers;
      },

      removeAll: function() {
        this.removeBy(function() {
          return true;
        });
      },

      _createMarker: function(opts) {
        opts.map = this.gMap;
        return new google.maps.Marker(opts);
      },

      visibleMarkersCount: function(selector) {
        var visibleMarkers = MAP.findBy(function(marker) {
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
