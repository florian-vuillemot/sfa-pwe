import React, { Component } from 'react';
import './App.css';
import ConstructionSite from './ConstructionSite/ConstructionSite.js';
import ConstructionsSite from './ConstructionsSite/ConstructionsSite.js';


class App extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      onNewWorkDay: false,
      constructionSiteSelect: false,
      data: [
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
      ],
    };

    this.setState({constructionSite: this.constructionSiteTemplate()});

    this.newWorkDay = this.newWorkDay.bind(this);
    this.constructionSiteSelect = this.constructionSiteSelect.bind(this);
    this.constructionSiteUpdate = this.constructionSiteUpdate.bind(this);
    this.constructionSiteTemplate = this.constructionSiteTemplate.bind(this);
  }

  constructionSiteTemplate(){
    const id = this.state.data.length ? this.state.data.sort((d1, d2) => d1.id < d2.id)[0].id + 1 : 0;
    return {
      id: id,
      constructionSiteInfo: {
        client: null,
        place: null,
        rate: {
          hourTaxFreePrice: 90.0,
          dayTaxFreePrice: 800.0,
          taxPercent: 20
        }
      },
      workingDays: []
    };
  }

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
    const newData = [...this.state.data.filter(d => d.id !== day.id), day];
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
            <ConstructionSite
              constructionSite={this.state.constructionSite}
              onUpdate={this.constructionSiteUpdate}
            />
            : <ConstructionsSite
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
