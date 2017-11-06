import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import Options from './options';
import Footer from './footer';
import Request from 'request';
import AlertContainer from 'react-alert'
import Button from 'material-ui/Button';
import {defaultMapStyle, dataLayer} from './map-style.js';
import {fromJS} from 'immutable';

const DEFAULT_QUERY = 'redux';
const request = require('request');

/* Define Constants */
/* Get a API token from Mapbox (https://www.mapbox.com) to load a map and use custom map styles */
const MAPBOX_API_TOKEN = 'pk.eyJ1IjoiamF4b21hbiIsImEiOiJjajlsdHd3NnIwa3c4MndudHB3dDhmemtsIn0.Xif3OiwAP_X9nudmidWTag'; // Set your mapbox token here
/* Define a Translink API URL to fetch live bus locations */
const TRANSLINK_LIVE_API_URL = 'http://api.translink.ca/rttiapi/v1/buses?apiKey=aqkEXwYsmjIr2Ioy0E6v';

/* Create a bool for checking the API Connection on launch */
var displayCheckAPIAlert = true;

/* Create a bool for checking the API Connection when a user presses the button */
var isAPIConnectionActive = null;


/* React App Extends Component */
export default class App extends Component {

/* React Alert Pop Up Options */
  alertOptions = {
    offset: 14,
    position: 'top center',
    theme: 'light',
    time: 10000,
    transition: 'scale'
  }

  showWelcomeAlert = () => {
    this.msg.show('Welcome to My Translink API Connector built with React.', {
      time: 8000,
      type: 'success',
      icon: <img src="path/to/some/img/32x32.png" />
    })
  }

  showErrorAlert = () => {
    this.msg.show('We encountered an error while fetching the data.', {
      time: 5000,
      type: 'success',
      icon: <img src="path/to/some/img/32x32.png" />
    })
  }



  showSuccessAlert = () => {
    this.msg.show('The Translink API data was recieved', {
      time: 5000,
      type: 'success',
      icon: <img src="path/to/some/img/32x32.png" />
    })
  }

  /* Create a function to be called when the user checks the connection */
  checkTranslinkAPIConnection() {

  if (isAPIConnectionActive == true) {

console.log('Connection is active');

} else {

  console.log('Connection is not active');
}

}

  state = {
    mapStyle: defaultMapStyle,
    data: null,
    hoveredFeature: null,
    viewport: {
      /* Set the latitude and longitude to Vancouver coordinates */
      latitude: 49.2827,
      longitude: -123.1207,
      /* Set the initial map zoom to 12 to see the vancouver area */
      zoom: 12,
      bearing: 0,
      pitch: 0,
      width: 500,
      height: 500
    }

  };


/* This function fetches the bus location from the translink API and gets the data back in JSON */
fetchBusLocation() {

  request.get('/api', (req, res) => {
    request({
      /* Pass in the Translink API URL */
      url: TRANSLINK_LIVE_API_URL,
      method: "GET",
      /* Return JSON data from the Translink API */
      json: true
    }, (err, response, body) => {
      if (err || response.statusCode !== 200) {
        console.log('Problem fetching API Data, please check the API KEY.', err);
        /* Show the error alert if the data is not recived from the Translink */
       this.showErrorAlert();
       /* Set the isAPIConnectionActive to false */
       isAPIConnectionActive = false;
      } else {
      console.log('body:', body);
      /* Show the sucess alert if the data is recived from the Translink */
      /* Set the isAPIConnectionActive to true */
      isAPIConnectionActive = true;
  /* If statement for checking the API Connection on componentDidMount */
    if (displayCheckAPIAlert == true) {
      this.showSuccessAlert();
       displayCheckAPIAlert = false;
    }
      }
    });
  });

}

/* The componentDidMount method gets called once the component is mounted to the DOM */
/* Use Component did Mount for fetching the API data and calling methods when the web app loads */
  componentDidMount() {

   /* Call the fetchBusLocation function every defined amount of seconds */
    this.timer = setInterval(()=> this.fetchBusLocation(), 1000)

   /* Show the welcome alert */
   this.showWelcomeAlert();

  /* Set the window size */
    window.addEventListener('resize', this.windowSize);
    this.windowSize();
  }


/* The componentWillUnmount method gets called right before the component is unloaded from the DOM */
  componentWillUnmount() {

    /* Set the window size */
    window.removeEventListener('resize', this.windowSize);
  }

  windowSize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: 1920 || window.innerWidth,
        height: 800 || window.innerHeight
      }
    });
  };

 /* Window View Port */
  windowViewPort = viewport => this.setState({viewport});

/* on mouse hover event */
  onMouseHover = event => {

  };



  /* Everything in the render function will be rendered to the view */
  render() {

    const {viewport, mapStyle} = this.state;

    return (
      <div>
     <center>  <h2>Translink Live Bus Stops</h2>
     <div>
     {/* React Welcome Alert Popup */}
    <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
    <Button raised color="accent" onClick={this.checkTranslinkAPIConnection}>Check API Connection</Button>
    </div>
     </center>

     {/* MapBox Map Integration */}

        <MapGL
          {...viewport}
          mapStyle={mapStyle}

          onViewportChange={this.windowViewPort}
          mapboxApiAccessToken={MAPBOX_API_TOKEN}
          onHover={this.onMouseHover} >

          {/* Load in the react Options Component */}

        <Options containerComponent={this.props.containerComponent}/>
        </MapGL>

        {/* Webpage Footer Component*/}
        <Footer containerComponent={this.props.containerComponent}/>
      </div> );
  }

}
