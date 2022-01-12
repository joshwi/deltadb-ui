import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import configureStore from './store/store';
import 'bootstrap/dist/css/bootstrap.min.css';

const store = configureStore();

ReactDOM.render(
  <Auth0Provider
    domain="dev-654zqynw.us.auth0.com"
    clientId="Jxtvn1yIiXaS2sBcRr1fwzRG2W6FAqTX"
    redirectUri={window.location.origin}
  >
  <Provider store={store}>
    <App />
  </Provider>
  </Auth0Provider>,
  document.getElementById('root')
);
