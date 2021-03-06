import React, {Component} from 'react';
import {render} from 'react-dom';
import Options from './options';
import Footer from './footer';
import Request from 'request';
import ReactMapboxMapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
/* Import React Superagent */
import Superagent from 'superagent';
import AlertContainer from 'react-alert'
/* Import React Material Buttons */
import Button from 'material-ui/Button';
import {fromJS} from 'immutable';
/* Import React MapBox Functions */
import {defaultMapStyle, dataLayer} from './map-style.js';
/* Import Logos */
import BusTrackerLogo from './BusTrackerLogo.png';
import ReactLoading from 'react-loading';
/* Import App CSS */
import AppCSS from './App.css';
/* Import React Spacers */
const Spacer = require('react-spacer')
/* Import React Center */
import Center from 'react-center';
import renderIf from 'render-if'



/* import Material Icons for the bus icon */
/* import MaterialIcon from 'react-google-material-icons' */
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

/* Bools */
var isAlive = false;
var showInfo = false;

/* CORS */

/* React App Extends Component */
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mapStyle: defaultMapStyle,
      viewport: {
        /* Set the latitude and longitude to Vancouver coordinates */
        latitude: 49.2827,
        longitude: -123.1207,
        /* Set the initial map zoom to 12 to see the vancouver area */
        zoom: 15,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500,
      },
      currentBusLocations:[],
      currentBusName: [],
      popupInfo: null,
      newState: [],
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
    this.msg.show('We encountered an error while fetching the data. Please make sure CORS is enabled', {
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


  showBusData = (busData) => {

    this.msg.show(busData.Destination, {
      time: 5000,
      type: 'success',
      icon: <MaterialIcon icon="directions_bus" size={30} color ="#3748AC" />
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
          this.parseBusJSONData(body);
           /* console.log('All Bus Details:', body); */

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

/* Parse the JSON data and add Longitude, Latitude, Direction and Destination to an array */
  parseBusJSONData(vancouverBusLocation) {
    let currentBusLocationArray = vancouverBusLocation.map((theBus) => ({lat: theBus.Latitude, lon: theBus.Longitude, Destination: theBus.Destination, Direction: theBus.Direction}));
    this.setState({currentBusLocations: currentBusLocationArray});
  /*  console.log('Bus Positions',currentBusLocationArray) */
  }


  /* The componentDidMount method gets called once the component is mounted to the DOM */
  /* Use Component did Mount for fetching the API data and calling methods when the web app loads */
  /* --------------------------------------- */
  componentDidMount() {

    /* Show the welcome alert */
    this.showWelcomeAlert();
    /* this.getBusPoints(); /*

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

  /* Define the Window Size */
  windowSize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width:   window.innerWidth,
        height:  window.innerHeight
      }
    });
  };

  renderBusPopup(busData) {
   if (isAlive == false) {

   this.showBusData(busData)

 } else {
}
isAlive = true
}



  /* Window View Port */
  windowViewPort = viewport => this.setState({viewport});

  /* Everything in the React render function will be rendered to the view */
  render() {
    const {viewport, mapStyle} = this.state;
    return (
      <div>
      <Center>
      <img src={BusTrackerLogo}/>
      <div>

      {/* React Welcome Alert Popup */}
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>
      </Center>
      {/* ______________________ */}

      <Spacer height='50px' />

       {/* React Material Design Buttons */}
       <Center>

       <Button raised color="accent"
       onClick={this.showIntroAlert}>Show Intro View Popup</Button>
       {/* Get the current location when button pressed*/}
       <Spacer width='50px' />

       {/* CSS Animating Location Marker*/}
       <div className="marker">
          <div className="marker-effect"></div>
        </div>
       {/* ______________________ */}

       <Button raised color="primary"
        onClick={this.renderBusPopup}>Get Current Location</Button>
       </Center>
      {/* ______________________ */}

       <Spacer height='50px' />

      {/* MapBox Map Integration */}
      <ReactMapboxMapGL
      {...viewport}
      mapStyle={mapStyle}

      onViewportChange={this.windowViewPort}
      mapboxApiAccessToken={MAPBOX_API_TOKEN}
      onHover={this.onMouseHover}>

      {/* Display the Vancouvers coordinates on a map */}
      <Popup latitude={49.2827} longitude={-123.1207}>
      <div>Downtown</div>
      </Popup>


      {/* Parse the JSON and get the longitude and latitude and display on the map */}

      {this.state.currentBusLocations.map ((busData, index) => (
     <Popup latitude={busData.lat}
      longitude={busData.lon}
      closeButton={false}
      closeOnClick={false}
      anchor="top"

      onClick={() => {
      var prevState=this.state.newState;
      prevState[index]=!prevState[index];

      this.setState({newState:prevState})}}>

      {this.renderBusPopup(busData)}


     <center> <MaterialIcon icon="directions_bus" size={25} color="#56D4EA"/>
     <div>{busData.Destination} </div>
     <div> {busData.Direction}</div>
     </center>
     </Popup>
   ))}


      {/* Load in the react Options Component */}
      <Options containerComponent={this.props.containerComponent}/>
      </ReactMapboxMapGL>

      {/* Load in the react Webpage Footer Component */}
      <Footer containerComponent={this.props.containerComponent}/>
      </div> );
    }

  }
