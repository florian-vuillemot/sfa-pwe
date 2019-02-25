import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { UserAgentApplication } from 'msalx';

const applicationConfig = {
  clientID: "bdbb9295-8743-4764-9a04-5e71754d3622",
  authority: "https://login.microsoftonline.com/common",
  graphScopes: ["user.read"],
  graphEndpoint: "https://graph.microsoft.com/v1.0/me"
}

const getClientApplication = () => {
  const client = new UserAgentApplication(applicationConfig.clientID, applicationConfig.authority,
    (errorDesc, token, error, tokenType) => {
      // Called after loginRedirect or acquireTokenPopup
      if (tokenType === "id_token") {
        var userName = client.getUser().name;
        console.log("User '" + userName + "' logged-in");
      } else {
        console.log("Error during login:\n" + error);
      }
  });
  return client;
}

const loginPopup = (redirectUrl) => {
  const clientApplication = getClientApplication();
  clientApplication.loginPopup(applicationConfig.graphScopes).then((idToken) => {
    clientApplication.acquireTokenSilent(applicationConfig.graphScopes).then((accessToken) => {
      var userName = clientApplication.getUser().name;
      console.log("UserIci '" + userName + "' logged-in");
      window.location.href = redirectUrl;
    }, (error) => {
      clientApplication.acquireTokenPopup(applicationConfig.graphScopes).then((accessToken) => {
        var userName = clientApplication.getUser().name;
        console.log("Userla '" + userName + "' logged-in");
        window.location.href = redirectUrl;
      }, (error) => {
        console.log("Error acquiring the popup:\n" + error);
      });
    })
  }, (error) => {
    console.log("Error during login:\n" + error);
  });
}

const App = (props) => {
  loginPopup(props.conf.entrypointUrl);
  return (<p>Authentification en cours</p>);
}

export default App;
