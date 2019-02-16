import React, { Component } from 'react';
import './App.css';
import {ConstructionSite as ConstructionSiteView} from './ConstructionSite/ConstructionSite';
import {ConstructionsSite as ConstructionsSiteView} from './ConstructionsSite/ConstructionsSite';
import {ConstructionsSite, ConstructionSite} from './lib/ConstructionsSite';
import { Clients } from './lib/Client';

const queryString = require('query-string');

function GetConstructionsSite() {
  const data = [
    {
      id: 1,
      constructionSiteInfo: {
        client: "Eurovia",
        place: "Paris",
        rate: {
          hourTaxFreePrice: 90.0,
          dayTaxFreePrice: 800.0,
          taxPercent: 20
        }
      },
      workingDays: [{
        id: 1,
        date: "2019-03-01",
        type: "TRANSFER",
        taxFreePrice: 80.2,
        price: 90.5,
        hours: null
      }, {
        id: 2,
        date: "2019-03-02",
        type: "DAY",
        taxFreePrice: 60.2,
        price: 80.5,
        hours: null
      }]
    },
    {
      id: 2,
      constructionSiteInfo: {
        client: "Gille",
        place: "Paris",
        rate: {
          hourTaxFreePrice: 180.0,
          dayTaxFreePrice: 1800.0,
          taxPercent: 50
        }
      },
      workingDays: [{
        id: 1,
        date: "2019-06-04",
        type: "TRANSFER",
        taxFreePrice: 80.2,
        price: 90.5,
        hours: null
      }]
    }
  ];

  return new ConstructionsSite(data);
}

function GetClients(){
  const clients = [
    {
      name: "Eurovia",
      number: 21,
      street: "my street",
      city: "St Martin",
      postalCode: "34380",
      additionalAddressDetails: "CEDEX 15"
    },
    {
      name: "Gille",
      number: 42,
      street: "Cade",
      city: "Mtp",
      postalCode: "34000"
    },
    {
      name: "Paul",
      number: 84,
      street: "St Michel",
      city: "Paris",
      postalCode: "01"
    }
  ]

  return new Clients(clients);
}

class App extends Component {
  constructor(props){
    super(props);

    const data = GetConstructionsSite();
    const date = getDate();

    if (!date) {
      window.location.href = this.props.conf.entrypointUrl;
    }
    
    this.state = {
      date: date,
      onNewConstructionSite: false,
      constructionSiteSelect: false,
      data: data,
      constructionSite: this.constructionSiteTemplate(data),
      clients: GetClients()
    };

    this.newContructionSite = this.newContructionSite.bind(this);
    this.constructionSiteSelect = this.constructionSiteSelect.bind(this);
    this.constructionSiteUpdate = this.constructionSiteUpdate.bind(this);
    this.constructionSiteTemplate = this.constructionSiteTemplate.bind(this);
    this.deleteConstructionSite = this.deleteConstructionSite.bind(this);
  }

  constructionSiteTemplate(data = null) {
    const _data = data ? data : this.state.data;
    return ConstructionSite.factory(_data.constructionsSite ? _data.constructionsSite : []);
  }

  newContructionSite(){
    this.setState({
      onNewConstructionSite: true,
      constructionSite: this.constructionSiteTemplate(),
      constructionSiteSelect: false
    })
  }

  constructionSiteSelect(c){
    this.setState({
      constructionSiteSelect: true,
      constructionSite: c
    });
  }

  constructionSiteUpdate(day) {
    const newData = new ConstructionsSite([...this.state.data.filter(d => d.id !== day.id), day]);
    this.setState({
      data: newData,
      onNewConstructionSite: false,
      constructionSiteSelect: false,
      constructionSite: null
    });
  }

  deleteConstructionSite(constructionSiteId) {
    const newData = new ConstructionsSite(this.state.data.filter(d => d.id !== constructionSiteId));
    this.setState({
      data: newData,
      onNewConstructionSite: false,
      constructionSiteSelect: false,
      constructionSite: null
    });
  }

  updateClients = (clients) => this.setState({clients: clients});

  render() {
    return (
      <div className="App">
        <p><a href={this.props.conf.entrypointUrl}>Menu principal</a></p>
        <header className="App-header">
          {this.state.onNewConstructionSite || this.state.constructionSiteSelect ?
            <ConstructionSiteView
              clients={this.state.clients}
              constructionSite={this.state.constructionSite}
              onUpdate={this.constructionSiteUpdate}
              onDeleteConstructionSite={this.deleteConstructionSite}
              onUpdateClients={this.updateClients}
            />
            : <ConstructionsSiteView
                data={this.state.data}
                onNewConstructionSite={this.newContructionSite}
                onConstructionSiteSelect={this.constructionSiteSelect}
              />
          }
        </header>
      </div>
    );
  }
}

function getDate() {
  const date = queryString.parse(window.location.search);

  const year = parseInt(date.year);
  const month = parseInt(date.month);

  if (year && (month || 0 === month)) {
    return {
      year: year,
      month: month
    }
  }
  return undefined
}

export default App;
