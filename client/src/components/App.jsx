import React, { Component } from 'react';
import { render } from 'react-dom';
import Map from './Map.jsx';
import { Info, toggleInfoWindow, updateInfoWindow } from './InfoWindow.jsx';
import { NavButton, toggleNavButton } from './NavigationButton.jsx';
import { Auto, toggleAutocomplete } from './Autocomplete.jsx';
import FindButton from './FindButton.jsx';

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
    	youMarker: null,
    	markers: [],
    	focus: 0,
    	map: null,
    	directionsDisplay: null,
    	directionsService: null,
    	autocomplete: null
    };
    this.createInfoWindow = this.createInfoWindow.bind(this);
    this.addMarker = this.addMarker.bind(this); // REFACTOR
    this.addYou = this.addYou.bind(this); // REFACTOR
    this.clearMarkers = this.clearMarkers.bind(this); // REFACTOR
    this.generateDirections = this.generateDirections.bind(this);
    this.findMe = this.findMe.bind(this);
    this.findBars = this.findBars.bind(this);
    this.nextBar = this.nextBar.bind(this);
    this.prevBar = this.prevBar.bind(this);
    this.search = this.search.bind(this);

    this.navButton = React.createRef();
    this.infoWindow = React.createRef();
    this.autocomplete = React.createRef();
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

  addMarker(location) {
  	const { map, focus, markers } = this.state;
    var marker = new google.maps.Marker({
    	position: location,
    	map: map,
    	animation: google.maps.Animation.BOUNCE,
    	draggable: false,
    	icon: `/images/pin.png`,
    	zIndex: 1
    });  	
    setTimeout(() => {
    	marker.setAnimation(null);
    }, 750);
    marker.addListener('click', e => {
    	marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
      	marker.setAnimation(null);
      }, 750);
      var { markers, you } = this.state;
      var focus = markers.indexOf(marker);
      this.generateDirections(you, markers[focus]);
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

  addYou(location) {
  	const { map, focus, markers, directionsDisplay, you } = this.state;
    var marker = new google.maps.Marker({
    	position: location,
    	map: map,
    	animation: google.maps.Animation.BOUNCE,
    	draggable: true,
    	icon: `/images/boy.png`,
    	zIndex: google.maps.Marker.MAX_ZINDEX
    });  	
    setTimeout(() => {
    	marker.setAnimation(null);
    }, 750);
    marker.addListener('click', e => { 
    	marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
      	marker.setAnimation(null);
      }, 750);
    	toggleAutocomplete(true);
    	this.autocomplete.current.forceUpdate();
	  	var input = document.getElementById('autocomplete-input');
	    var autocomplete = new google.maps.places.Autocomplete(input);
	    autocomplete.addListener('place_changed', () => this.search())
	    this.setState({ autocomplete: autocomplete });
    });
    marker.addListener('dragend', e => {
    	directionsDisplay.setMap(null);
    	this.clearMarkers();
    	this.setState({
    		you: {
      		lat: e.latLng.lat(),
      		lng: e.latLng.lng()
      	}
    	});
    	marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
      	marker.setAnimation(null);
      }, 0);
    	toggleAutocomplete(false);
    	this.autocomplete.current.forceUpdate();
    	toggleNavButton(false);
    	this.navButton.current.forceUpdate();
    	toggleInfoWindow(false);
    	this.infoWindow.current.forceUpdate();
    });	
    this.setState({ youMarker: marker });
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
  		destination: destination.position,
  		travelMode: 'WALKING'
  	}, (response, status) => {
  		if (status === 'OK') {
  			console.log('DIRECTIONS:', response);
  			console.log('DESTINATION:', destination);
			  var service = new google.maps.places.PlacesService(map);
			  service.getDetails({ placeId: destination.place_id}, (results, status) => {
			  	console.log(results, status);
			  	updateInfoWindow(results, response.routes[0].legs[0]);
	    		this.infoWindow.current.forceUpdate();
			  });
  			directionsDisplay.setDirections(response);
	    	toggleInfoWindow(true);
	    	this.infoWindow.current.forceUpdate();
  		} else {
  			console.log('direction display failure:', status, response);  			
  		}
  	});
  }

  findMe() {
    const { map, directionsDisplay } = this.state;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.setState({
        	you: {
        		lat: pos.coords.latitude,
        		lng: pos.coords.longitude
        	}
        }, () => {
	        map.setCenter(this.state.you);
	        var you = this.addYou(this.state.you);
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
	  	const { map, markers, you } = this.state;

	  	var request = {
		    location: you,
		    radius: '500',
		    query: 'restaurant+bar'
		  };

		  var service = new google.maps.places.PlacesService(map);
		  service.textSearch(request, res => {
		  	console.log(res);
		  	res.forEach(bar => {
		  		var marker = this.addMarker(bar.geometry.location);
		  		marker.place_id = bar.place_id;
		  		markers.push(marker);
		  	});
		  });
		  map.panTo(you);
 		
		  this.setState({ 
		  	markers: markers, 
		  	focus: 0
			});
      toggleNavButton(true);
      this.navButton.current.forceUpdate();
		})
  }	

  nextBar() {
  	var { focus, markers, map, you } = this.state;
  	focus = (focus + 1) % markers.length;

  	markers.length !== 0 ? this.generateDirections(you, markers[focus]) : null;

  	this.setState({ focus: focus });
  }

  prevBar() {
  	var { focus, markers, map, you } = this.state;
  	focus = focus - 1 < 0 ? markers.length - 1 : focus - 1;

  	markers.length !== 0 ? this.generateDirections(you, markers[focus]) : null;

  	this.setState({ focus: focus });
  }

  search(e) {
  	var { map, marker, autocomplete, youMarker } = this.state;
  	if (e) {
  		e.preventDefault();
  	} else {
  		toggleAutocomplete(false);
	  	this.autocomplete.current.forceUpdate();
	  	var pos = autocomplete.getPlace();
	  	this.setState({
	    	you: {
	    		lat: pos.geometry.location.lat(),
	    		lng: pos.geometry.location.lng()
	    	}
	    }, () => {        	
	      map.panTo(this.state.you);
	      youMarker.setPosition(this.state.you);
	    })
  	}
  }

  render() {
    return (
      <Map
        id="map"
        options={{
          center: { lat: this.state.pos.lat, lng: this.state.pos.lng },
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          zoomControl: false,
          fullscreenControl: false,
          clickableIcons: false
        }}
        onMapLoad={map => {
	        var findDiv = document.createElement('div');
	        var find = render(
	        	<FindButton 
	        		findBars={ this.findBars } 
	        	/>
	        	, findDiv);
	        map.controls[google.maps.ControlPosition.LEFT_CENTER].push(findDiv);
	        
	        var navDiv = document.createElement('div');
	        var nav = render(
	        	<NavButton 
	        		ref= { this.navButton }
	        		prevBar={ this.prevBar } 
	        		nextBar={ this.nextBar } 
	        	/>
	        	, navDiv);
	        map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(navDiv);
	        
	        var infoDiv = document.createElement('div');
	        var info = render(
	        	<Info 
	        		ref= { this.infoWindow }
	        	/>
	        	, infoDiv);
	        map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(infoDiv);
	        
	        var autoDiv = document.createElement('div');
	        autoDiv.classList.add('autocomplete');
	        var auto = render(
	        	<Auto 
	        		ref= { this.autocomplete }
	        		search={ this.search }
	        	/>
	        	, autoDiv);
	        map.controls[google.maps.ControlPosition.TOP_CENTER].push(autoDiv);
	        
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