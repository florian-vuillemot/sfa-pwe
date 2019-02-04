import React, { Component } from 'react';
import './App.css';

function SelectButton(props){
  return (
      <button className="buttonStyle normalWidth">
          Ajouter un chantier
      </button>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <table className="General-info">
            <thead>
              <tr>
                <th>Nombreux de jour travaillé:</th>
                <th>2</th>
                <th rowSpan="2"><SelectButton /></th>
              </tr>
              <tr>
                <th>Nombreux de transfert:</th>
                <th>2</th>
                <th></th>
              </tr>
            </thead>
          </table>
        </header>
      </div>
    );
  }
}

export default App;
