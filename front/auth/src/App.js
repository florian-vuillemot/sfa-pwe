import React, { Component } from 'react';
import './App.css';
import auth0 from 'auth0-js';

class Auth {
  auth0 = new auth0.WebAuth({
    domain: 'sfa-pwe.eu.auth0.com',
    clientID: 'Yb9QQ3hTdnx65ysGgGmjUl6hXfkTxcvx',
    redirectUri: 'http://localhost:3000',
    responseType: 'token id_token',
    scope: 'openid'
  });

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    // Too late for think more about a fucking problem
    const tokenStr = "access_token";
    const url_string = window.location.href.replace("/#", "?");

    if (url_string.includes(tokenStr)){
      const url = new URL(url_string);
      return url.searchParams.get(tokenStr);
    }
    return null;
  }
}

const auth = new Auth();

const token = auth.handleAuthentication();
if (token !== null){
  console.log(token)
}
else {
  auth.login();
}


const App = (props) => {
  return (<p>Authentification en cours</p>);
}

export default App;
