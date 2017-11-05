import React, {Component} from 'react';
import {render} from 'react-dom';
import MapGL from 'react-map-gl';
import Options from './options';
import Footer from './footer';
import AlertContainer from 'react-alert'
import {defaultMapStyle, dataLayer} from './map-style.js';
import {fromJS} from 'immutable';


const DEFAULT_QUERY = 'redux';

/* Define Constants */
/* Get a API token from Mapbox (https://www.mapbox.com) to load a map and use custom map styles */
const MAPBOX_API_TOKEN = 'pk.eyJ1IjoiamF4b21hbiIsImEiOiJjajlsdHd3NnIwa3c4MndudHB3dDhmemtsIn0.Xif3OiwAP_X9nudmidWTag'; // Set your mapbox token here
/* Define a Translink API URL to fetch live bus locations */
const TRANSLINK_LIVE_API_URL = 'http://api.translink.ca/rttiapi/v1/buses?apiKey=aqkEXwYsmjIr2Ioy0E6v';

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

  showAlert = () => {
    this.msg.show('Welcome to My Translink API Connector built with React.', {
      time: 8000,
      type: 'success',
      icon: <img src="path/to/some/img/32x32.png" />
    })
  }

  errorAlert = () => {
    this.msg.show('We encountered an error while fetching the data.', {
      time: 5000,
      type: 'success',
      icon: <img src="path/to/some/img/32x32.png" />
    })
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


/* Use Component did Mount for getting the API data */
  componentDidMount() {

    fetch('http://api.translink.ca/rttiapi/v1/buses?apiKey=aqkEXwYsmjIr2Ioy0E6v')

    		.then(res => res.json())
    		.then(data => {
    			this.setState({ imgs: data });
    		})
        /* If there is an error fetching the data then catch that error and do the action below */
    		.catch(err => {
    			console.log('Problem fetching API Data', err);
         this.errorAlert();
    		});


   /* Show the welcome alert */
   this.showAlert();

    window.addEventListener('resize', this.windowSize);
    this.windowSize();

    /* Fetch the API JSON data */

  }

  componentWillUnmount() {
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
    <button onClick={this.showAlert}>Show Alert</button>
    </div>
     </center>


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
