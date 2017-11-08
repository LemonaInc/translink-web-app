
// Default Code
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'mapbox-gl/dist/mapbox-gl.css';
<link href='https://api.tiles.mapbox.com/mapbox-gl-js/v0.37.0/mapbox-gl.css' rel='stylesheet' />



// Import the recat map components
import {Component} from 'react';
import ReactMapGL from 'react-map-gl';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


class Map extends Component {
  render() {
    return (
      <ReactMapGL
        width={400}
        height={400}
        latitude={37.7577}
        longitude={-122.4376}
        zoom={8}
        onViewportChange={(viewport) => {
          const {width, height, latitude, longitude, zoom} = viewport;
          // Optionally call `setState` and use the state to update the map.
        }}
      />
    );
  }
}
