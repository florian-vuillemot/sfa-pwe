import React, { Component } from 'react';
import './App.css';
import {ConstructionSite as ConstructionSiteView} from './ConstructionSite/ConstructionSite';
import {ConstructionsSite as ConstructionsSiteView} from './ConstructionsSite/ConstructionsSite';
import {ConstructionsSite, ConstructionSite} from './lib/ConstructionsSite';

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

class App extends Component {
  constructor(props){
    super(props);

    const data = GetConstructionsSite();
    
    this.state = {
      onNewWorkDay: false,
      constructionSiteSelect: false,
      data: data,
      constructionSite: this.constructionSiteTemplate(data)
    };

    this.newWorkDay = this.newWorkDay.bind(this);
    this.constructionSiteSelect = this.constructionSiteSelect.bind(this);
    this.constructionSiteUpdate = this.constructionSiteUpdate.bind(this);
    this.constructionSiteTemplate = this.constructionSiteTemplate.bind(this);
    this.deleteConstructionSite = this.deleteConstructionSite.bind(this);
  }

  constructionSiteTemplate = (data = null) => ConstructionSite.template(data ? data : this.state.data);

  newWorkDay(){
    this.setState({
      onNewWorkDay: true,
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
      onNewWorkDay: false,
      constructionSiteSelect: false,
      constructionSite: null
    });
  }

  deleteConstructionSite(constructionSiteId) {
    const newData = new ConstructionsSite(this.state.data.filter(d => d.id !== constructionSiteId));
    this.setState({
      data: newData,
      onNewWorkDay: false,
      constructionSiteSelect: false,
      constructionSite: null
    });
  }

  render() {
    return (
      <div className="App">
        <p>Menu principal</p>
        <header className="App-header">
          {this.state.onNewWorkDay || this.state.constructionSiteSelect ?
            <ConstructionSiteView
              constructionSite={this.state.constructionSite}
              onUpdate={this.constructionSiteUpdate}
              onDeleteConstructionSite={this.deleteConstructionSite}
            />
            : <ConstructionsSiteView
                data={this.state.data}
                onNewWorkDay={this.newWorkDay}
                onConstructionSiteSelect={this.constructionSiteSelect}
              />
          }
        </header>
      </div>
    );
  }
}

export default App;
