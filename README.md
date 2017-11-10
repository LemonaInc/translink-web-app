
## Translink React Web App

# Installation

Once the files are downloaded open Terminal or Command Prompt and change the directory to the master folder by typing cd and the the directory name you want to go to. Once you are inside of that directory on your machine, make sure all of the node_modules are installed. For faster installation for this dev challenge I uploaded the node_modules to the Github repository. If this was a client application you would install the node_modules by typing “npm install” in the command line.

If you receive the error “Module Not Found” Please check to see which module you are missing and install in or run “npm install” and that should fix that error.

Important Note When Running the React TransLink Bus Tracker Web App:
In this version or my React TransLink web app I could not get the application to use CORS on localhost on my local machine. Once you launch the app you will get an error that says “We encountered an error while fetching the data, please make sure CORS is enabled. CORS is a feature that prevents requests from being received from another domain which in this case is the TransLink API.

To get around this issue please use the Chrome web browser and install this Chrome app: https://chrome.google.com/webstore/detail/cors-toggle/jioikioepegflmdnbocfhgmpmopmjkim?hl=en. You can also use another chrome CORS Enabler if you prefer another app.


# NPM node modules used in this project.
NPM Node Modules Installed for this Project:

'react';
‘react-dom';
Request 'request';
ReactMapboxMapGL, {Marker, Popup, NavigationControl} from 'react-map-gl';
Superagent 'superagent';
AlertContainer 'react-alert'
Button 'material-ui/Button';
{fromJS}  'immutable';
{defaultMapStyle, dataLayer} './map-style.js';
Location './location.gif';
ReactLoading 'react-loading';
Spacer  ('react-spacer')
Center 'react-center';
SweetAlert 'sweetalert-react';
renderIf 'render-if'


# Credits

This data for this app to display the buses is from the Vancouver TransLink API.
TransLink API: https://developer.translink.ca/.

The NPM modules used in this app were created by the prospective authors and all credit is to be given to those authors for thier component.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Created by Jaxon Stevens.




