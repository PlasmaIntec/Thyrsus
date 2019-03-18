import React, { Component } from 'react';
import { render } from 'react-dom';
import Map from './Map.jsx';
import InfoWindow from './InfoWindow.jsx';
import FindButton from './FindButton.jsx';
import NavigationButton from './NavigationButton.jsx';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
    	pos: {
    		lat: 41.0082,
    		lng: 28.9784
    	},
    	you: {
    		lat: null,
    		lng: null
    	},
    	markers: [],
    	focus: 0,
    	map: null,
    	directionsDisplay: null,
    	directionsService: null
    };
    this.createInfoWindow = this.createInfoWindow.bind(this);
    this.addMarker = this.addMarker.bind(this); // REFACTOR
    this.clearMarkers = this.clearMarkers.bind(this); // REFACTOR
    this.generateDirections = this.generateDirections.bind(this);
    this.findMe = this.findMe.bind(this);
    this.findBars = this.findBars.bind(this);
    this.nextBar = this.nextBar.bind(this);
    this.prevBar = this.prevBar.bind(this);
  }

  createInfoWindow(e, map) {
    const infoWindow = new google.maps.InfoWindow({
        content: '<div id="infoWindow" />',
        position: { lat: e.latLng.lat(), lng: e.latLng.lng() }
    });
    infoWindow.addListener('domready', e => {
      render(<InfoWindow />, document.getElementById('infoWindow'));
    });
    infoWindow.open(map);
  }

  addMarker(location, icon) {
  	const { map, focus, markers, me } = this.state;
    var marker = new google.maps.Marker({
    	position: location,
    	map: map,
    	animation: google.maps.Animation.BOUNCE,
    	draggable: icon === 'boy',
    	icon: `/images/${icon}.png`,
    	zIndex: icon === 'boy' ? google.maps.Marker.MAX_ZINDEX : 1
    });  	
    setTimeout(() => {
    	marker.setAnimation(null);
    }, 0);
    marker.addListener('click', e => {
    	marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
      	marker.setAnimation(null);
      }, 0);
      var { markers, you } = this.state;
      var focus = markers.indexOf(marker);
      this.generateDirections(you, markers[focus].position);
      this.setState({ focus: focus });
    });
    marker.addListener('dragend', e => {
    	marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
      	marker.setAnimation(null);
      }, 0);
    	map.panTo(e.latLng);
    });
    return marker;
  }

  clearMarkers() {
  	return new Promise((resolve, reject) => {
	  	const markers = this.state.markers;
	  	for (let i = 0; i < markers.length; i++) {
	  		markers[i].setMap(null);
	  	}
	  	this.setState({ markers: [] }, () => resolve());  		
  	});
  }

  generateDirections(origin, destination) {
  	const { map, directionsDisplay, directionsService } = this.state;
  	directionsDisplay.setMap(null);
  	directionsDisplay.setMap(map);
  	directionsService.route({
  		origin: origin,
  		destination: destination,
  		travelMode: 'WALKING'
  	}, (response, status) => {
  		if (status === 'OK') {
  			console.log('DIRECTIONS:', response);
  			directionsDisplay.setDirections(response);
  		} else {
  			console.log('direction display failure:', status, response);  			
  		}
  	});
  }

  findMe() {
    if (navigator.geolocation) {
    	const { map, directionsDisplay } = this.state;
      navigator.geolocation.getCurrentPosition(pos => {
        this.setState({
        	you: {
        		lat: pos.coords.latitude,
        		lng: pos.coords.longitude
        	}
        });
        map.setCenter(this.state.you);
        var you = this.addMarker(this.state.you, 'boy');
        you.addListener('dragend', e => {
        	directionsDisplay.setMap(null);
        	this.clearMarkers();
        	this.setState({
        		you: {
	        		lat: e.latLng.lat(),
	        		lng: e.latLng.lng()
	        	}
        	});
        });
      }, err => {
        console.log('Cannot get position from geolocation', err);
      })
    } else {
    	console.log('This browser does not support geolocation');
    }
  }

  findBars(e) {
  	this.clearMarkers()
		.then(() => {
	  	const map = this.state.map;
	  	const markers = this.state.markers;

	  	var request = {
		    location: this.state.you,
		    radius: '500',
		    query: 'restaurant+bar'
		  };

		  var service = new google.maps.places.PlacesService(map);
		  service.textSearch(request, res => {
		  	console.log(res);
		  	res.forEach(bar => {
		  		var marker = this.addMarker(bar.geometry.location, 'pin');
		  		markers.push(marker);
		  	});
		  });

		  this.setState({ markers: markers, focus: 0 });  			
		})
  }	

  nextBar() {
  	var { focus, markers, map, you } = this.state;
  	focus = (focus + 1) % markers.length;

  	markers.length !== 0 ? this.generateDirections(you, markers[focus].position) : null;

  	this.setState({ focus: focus });
  }

  prevBar() {
  	var { focus, markers, map, you } = this.state;
  	focus = focus - 1 < 0 ? markers.length - 1 : focus - 1;

  	markers.length !== 0 ? this.generateDirections(you, markers[focus].position) : null;

  	this.setState({ focus: focus });
  }

  render() {
    return (
      <Map
        id="map"
        options={{
          center: { lat: this.state.pos.lat, lng: this.state.pos.lng },
          zoom: 15,
          mapTypeControl: false,
          clickableIcons: false
        }}
        onMapLoad={map => {
          var marker = new google.maps.Marker({
            position: { lat: this.state.pos.lat, lng: this.state.pos.lng },
            map: map,
            title: 'Hello Istanbul!',
            draggable: true
          });
          marker.addListener('click', e => {
            this.createInfoWindow(e, map)
          });
          marker.addListener('dragend', () => console.log(marker.getPosition()));
	        var infoDiv = document.createElement('div');
	        var info = render(
	        	<FindButton findBars={ this.findBars } />
	        	, infoDiv);
	        map.controls[google.maps.ControlPosition.LEFT_CENTER].push(infoDiv);
	        var navDiv = document.createElement('div');
	        var nav = render(
	        	<NavigationButton prevBar={ this.prevBar } nextBar={ this.nextBar } />
	        	, navDiv);
	        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(navDiv);
			  	var directionsDisplay = new google.maps.DirectionsRenderer({
			  		suppressInfoWindows: true,
			  		suppressMarkers: true
			  	});
			  	var directionsService = new google.maps.DirectionsService;
          this.setState({ 
          	map: map, 
	          directionsService: directionsService, 
	          directionsDisplay: directionsDisplay 
	        });
          this.findMe();
        }}
      />
    );
  }
}