import React, { Component } from 'react';
import './App.css';
import { UserAgentApplication } from 'msalx';

const applicationConfig = {
  clientID: "b0120a5f-9471-4688-a7ac-22a400db0064",
  authority: "https://login.microsoftonline.com/704dcc90-17c4-4ad2-9380-cab8624ac13f",
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
      console.log(clientApplication);
      fetch("https://sfa-pwe.azurewebsites.net/api/Hello", {
        method: "GET",
        headers: { 'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json' }
      }).then(response => {
        response.text().then(text => console.log("Web APi returned:\n" + JSON.stringify(text)));
      }).catch(result => {
        console.log("Error calling the Web api:\n" + result);
      });
      //window.location.href = "https://sfa-pwe.azurewebsites.net/api/Hello";
      //window.location.href = redirectUrl + `?token=${accessToken}`;
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
