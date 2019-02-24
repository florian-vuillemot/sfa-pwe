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
      if (tokenType == "id_token") {
        var userName = client.getUser().name;
        console.log("User '" + userName + "' logged-in");
      } else {
        console.log("Error during login:\n" + error);
      }
  });
  return client;
}

const loginPopup = () => {
  const clientApplication = getClientApplication();
  clientApplication.loginPopup(applicationConfig.graphScopes).then((idToken) => {
    clientApplication.acquireTokenSilent(applicationConfig.graphScopes).then((accessToken) => {
      var userName = clientApplication.getUser().name;
      this.setState({ isLoggedIn: true });
      this.logMessage("User '" + userName + "' logged-in");
    }, (error) => {
      clientApplication.acquireTokenPopup(applicationConfig.graphScopes).then((accessToken) => {
        var userName = clientApplication.getUser().name;
        this.setState({ isLoggedIn: true });
        this.logMessage("User '" + userName + "' logged-in");
      }, (error) => {
        this.logMessage("Error acquiring the popup:\n" + error);
      });
    })
  }, (error) => {
    this.logMessage("Error during login:\n" + error);
  });
}

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggedIn: false,
    }
  }

  render() {
    //loginPopup();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
