import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import configureStore from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';

require('dotenv').config()

const store = configureStore();

const AUTH0_SERVICE_HOST = process.env.REACT_APP_AUTH0_SERVICE_HOST
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID

ReactDOM.render(
  <Auth0Provider
    domain={AUTH0_SERVICE_HOST}
    clientId={AUTH0_CLIENT_ID}
    redirectUri={window.location.origin}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
  <Provider store={store}>
    <App />
  </Provider>
  </Auth0Provider>,
  document.getElementById('root')
);
