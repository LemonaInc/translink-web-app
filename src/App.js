import React, {Component} from 'react';
import {render} from 'react-dom';
import Options from './options';
import Footer from './footer';
import Request from 'request';
import ReactMapboxMapGL, {Marker} from 'react-map-gl';
/* Import React Superagent */
import Superagent from 'superagent';
import AlertContainer from 'react-alert'
/* Import React Material Buttons */
import Button from 'material-ui/Button';
import {fromJS} from 'immutable';
/* Import React MapBox Functions */
import {defaultMapStyle, dataLayer} from './map-style.js';
//import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import ReactLogo from './logo.svg';
import location from './currentcity.png';
import TransLinkLogo from './TransLinkLogo.png';

/* import Material Icons for the bus icon */
//import MaterialIcon from 'react-google-material-icons'
import MaterialIcon, {colorPallet} from 'material-icons-react';




/* Define Constants */
const DEFAULT_QUERY = 'redux';
const request = require('request');
/* Get a API token from Mapbox (https://www.mapbox.com) to load a map and use custom map styles */
const MAPBOX_API_TOKEN = 'pk.eyJ1IjoiamF4b21hbiIsImEiOiJjajlsdHd3NnIwa3c4MndudHB3dDhmemtsIn0.Xif3OiwAP_X9nudmidWTag'; // Set your mapbox token here
/* Define a Translink API URL to fetch live bus locations */
const TRANSLINK_LIVE_API_URL = 'http://api.translink.ca/rttiapi/v1/buses?apiKey=aqkEXwYsmjIr2Ioy0E6v';

/* Create a bool for checking the API Connection on launch */
var displayCheckAPIAlert = true;

/* Create a bool for checking the API Connection when a user presses the button */
var isAPIConnectionActive = null;

var showInfo = false;

/* CORS */


/* React App Extends Component */
export default class App extends Component {


  constructor(props) {
    super(props);
    this.state = {
      mapStyle: defaultMapStyle,
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
        height: 500,
      },
      currentBusLocations:[],
      currentBusName: []
    }
  };

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
      icon: <MaterialIcon icon="tag_faces" size={30} color="#FF3776" />
    })
  }

  showIntroAlert = () => {
    this.msg.show('The bus icon reflects a buses current location.', {
      time: 8000,
      type: 'success',
      icon: <MaterialIcon icon="near_me" size={30} color="#56D4EA" />
    })
  }

  showErrorAlert = () => {
    this.msg.show('We encountered an error while fetching the data.', {
      time: 5000,
      type: 'success',
      icon:  <MaterialIcon icon="error_outline" size={30} color="#FB5F68" />
    })
  }

  showSuccessAlert = () => {
    this.msg.show('The Translink API data was recieved', {
      time: 5000,
      type: 'success',
      icon: <MaterialIcon icon="directions_bus" size={30} color ="#3748AC" />
    })
  }


  /* Create a function to be called when the user checks the connection */
  checkTranslinkAPIConnection() {

    if (isAPIConnectionActive == true) {

      console.log('Connection is active');
      <div>Hello</div>


    } else {

      console.log('Connection is not active');
    }

  }


  /* This function fetches the bus location from the translink API and gets the data back in JSON */
  fetchBusLocation() {


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

          /* parse the body and get the latitude and longitude */
          this.parseBusJSONCoordinates(body);
          console.log('All Bus Details:', body);

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
    ;

  }

  getBusStates() {


    fetch('http://api.translink.ca/rttiapi/v1/buses?apiKey=aqkEXwYsmjIr2Ioy0E6v')
    .then(results => {
      return results.json();
    }).then(data => {
    let details = data.results.map((busdetails) => {
      <div key={busdetails.results}>
      </div>

    })
    this.setState({details: details});
    console.log('Bus States', this.state.details);
  })

  }


  parseBusJSONCoordinates(vancouverBusLocation) {
    let currentBusLocationArray = vancouverBusLocation.map((theBus) => ({lat: theBus.Latitude, lon: theBus.Longitude, Destination: theBus.Destination, Direction: theBus.Direction}));
    this.setState({currentBusLocations: currentBusLocationArray});
    console.log('Bus Positions',currentBusLocationArray)

  }



  /* Get the currrent location of the user and display the location on a map */
  getCurrentLocation() {

    {this.state.currentBusLocations.map ((position, index) => (
      <div> />
      {position.Destination}
      </div>
    ))}

  }

  /* The componentDidMount method gets called once the component is mounted to the DOM */
  /* Use Component did Mount for fetching the API data and calling methods when the web app loads */
  /* --------------------------------------- */
  componentDidMount() {

    /* Show the welcome alert */
    this.showWelcomeAlert();
    //this.getBusPoints();

    /* this.getBusStates() */
    /* Call the fetchBusLocation function every defined amount of seconds */
    this.timer = setInterval(()=> this.fetchBusLocation(), 1000)

    /* Show the welcome alert */
    this.showIntroAlert();

    /* Set the window size */
    window.addEventListener('resize', this.windowSize);
    this.windowSize();
  }



  /* The componentWillUnmount method gets called right before the component is unloaded from the DOM */
  /* --------------------------------------- */
  componentWillUnmount() {

    /* Set the window size */
    window.removeEventListener('resize', this.windowSize);
  }

  windowSize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width:   window.innerWidth,
        height:  window.innerHeight
      }
    });
  };

  /* Window View Port */
  windowViewPort = viewport => this.setState({viewport});

  /* on mouse hover event */
  onMouseHover = event => {


  };

  state = { showing: true };


  /* Everything in the React render function will be rendered to the view */
  render() {



    const {viewport, mapStyle} = this.state;

    return (
      <div>
      <center>
       <img src={TransLinkLogo}/>
       <h2>TransLink Connector</h2>
      <div>
      {/* React Welcome Alert Popup */}
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <Button raised color="accent" onClick={this.checkTranslinkAPIConnection}>Check API Connection</Button>
      {/* Get the current location when button pressed*/}
      <Button raised color="primary" onClick={this.getCurrentLocation}>Get Current Location</Button>

      </div>
      </center>


      {/* MapBox Map Integration */}
      <ReactMapboxMapGL
      {...viewport}
      mapStyle={mapStyle}

      onViewportChange={this.windowViewPort}
      mapboxApiAccessToken={MAPBOX_API_TOKEN}
      onHover={this.onMouseHover}>

      {/* Display the Vancouvers coordinates on a map */}
      <Marker latitude={49.2827} longitude={-123.1207}>
      <div> <img src={location}/> </div>
      </Marker>

      {/* Parse the JSON and get the longitude and latitude and display on the map */}
      {this.state.currentBusLocations.map ((busData, index) => (
        <Marker latitude={busData.lat} longitude={busData.lon} key={index}>
        <div> <MaterialIcon icon="directions_bus" size={25} color="#fff"/>
        {busData.Destination}
        </div>
        </Marker>
      ))}





      {/* Load in the react Options Component */}
      <Options containerComponent={this.props.containerComponent}/>
      </ReactMapboxMapGL>

      {/* Load in the react Webpage Footer Component */}
      <Footer containerComponent={this.props.containerComponent}/>
      </div> );
    }

  }
