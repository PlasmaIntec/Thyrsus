import React, { Component } from 'react';
import { render } from 'react-dom';
import Map from './Map.jsx';
import InfoWindow from './InfoWindow.jsx';
import FindButton from './FindButton.jsx';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
    	pos: {
    		lat: 41.0082,
    		lng: 28.9784
    	},
    	map: null
    }
    this.createInfoWindow = this.createInfoWindow.bind(this);
    this.addMarker = this.addMarker.bind(this); // REFACTOR
    this.findMe = this.findMe.bind(this);
    this.findBars = this.findBars.bind(this);
  }

  createInfoWindow(e, map) {
    const infoWindow = new google.maps.InfoWindow({
        content: '<div id="infoWindow" />',
        position: { lat: e.latLng.lat(), lng: e.latLng.lng() }
    })
    infoWindow.addListener('domready', e => {
      render(<InfoWindow />, document.getElementById('infoWindow'))
    })
    infoWindow.open(map)
  }

  addMarker(location, icon) {
  	const map = this.state.map;
    var marker = new google.maps.Marker({
    	position: location,
    	map: map,
    	animation: google.maps.Animation.BOUNCE,
    	draggable: true,
    	icon: `/images/${icon}.png`
    });  	
    setTimeout(() => {
    	marker.setAnimation(null);
    }, 0);
    marker.addListener('click', e => {
    	marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
      	marker.setAnimation(null);
      }, 0);
    	map.panTo(e.latLng);
    	map.setZoom(15);
    });
    marker.addListener('dragend', e => {
    	marker.setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(() => {
      	marker.setAnimation(null);
      }, 0);
    	map.panTo(e.latLng);
    	map.setZoom(15);
    });
  }

  findMe() {
    if (navigator.geolocation) {
    	const map = this.state.map;
      navigator.geolocation.getCurrentPosition(pos => {
        this.setState({
        	pos: {
        		lat: pos.coords.latitude,
        		lng: pos.coords.longitude
        	}
        });
        map.setCenter(this.state.pos);
        this.addMarker(this.state.pos, 'boy');
      }, err => {
        console.log('Cannot get position from geolocation', err);
      })
    } else {
    	console.log('This browser does not support geolocation');
    }
  }

  findBars(e) {
  	const map = this.state.map;
  	console.log(map.getCenter().toString());  
  	var request = {
	    location: map.getCenter(),
	    radius: '500',
	    query: 'restaurant+bar'
	  };

	  var service = new google.maps.places.PlacesService(map);
	  service.textSearch(request, res => {
	  	console.log(res);
	  	res.forEach(bar => {
	  		this.addMarker(bar.geometry.location, 'pin');
	  	})
	  });
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
	        var div = document.createElement('div');
	        var info = render(<FindButton findBars={ this.findBars } />, div);
	        map.controls[google.maps.ControlPosition.LEFT_CENTER].push(div);
          this.setState({ map: map });
          this.findMe();
        }}
      />
    );
  }
}