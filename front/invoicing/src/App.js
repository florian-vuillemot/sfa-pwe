import React, { Component } from 'react';
import './App.css';

function SelectButton({onClick}){
  return (
      <button className="buttonStyle normalWidth" onClick={onClick}>
          Ajouter un chantier
      </button>
  )
}

function TableHeader({onNewWorkDay}) {
  return (
    <thead>
      <tr>
        <th>Nombreux de jour travaillé:</th>
        <th>2</th>
        <th rowSpan="2" colSpan="4">
          <SelectButton onClick={onNewWorkDay}/>
        </th>
      </tr>
      <tr>
        <th>Nombreux de transfert:</th>
        <th>2</th>
        <th></th>
      </tr>
    </thead>
  );
}

function TableBody(props) {
  const days = props.workingDays.map(wd => {
    return (
      <tr key={wd.id}>
        <td>{wd.date}</td>
        <td>{wd.client}</td>
        <td>{wd.place}</td>
        <td>{wd.type}</td>
        <td>{wd.taxFreePrice}</td>
        <td>{wd.price}</td>
      </tr>
    );
  });

  return (
    <tbody>
      <tr>
        <th>Date</th>
        <th>Client</th>
        <th>Lieu</th>
        <th>Type</th>
        <th>Prix HT</th>
        <th>Prix TTC</th>
      </tr>
      {days}
    </tbody>
  );
}

class WorkingDays extends Component {
  constructor(props){
    super(props);

    this.state = {};
  }

  render() {
    return (
      <table className="General-info">
        <TableHeader onNewWorkDay={this.props.onNewWorkDay}/>
        <TableBody workingDays={this.state.workingDays} />
      </table>
    );
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

function GlobalInfo(props){
  const info = props.constructionSiteInfo;
  const rate = info.rate;

  return (
    <thead>
      <tr>
        <th>
          <label forhtml="client">Client </label>
          <input name="client" list="clients" defaultValue={info.client}/>
          <datalist id="clients">
            <option value="Eurovia"/>
            <option value="Gille"/>
          </datalist>
        </th>
        <th colSpan="5">
          <label forhtml="hourTaxFreePrice">Prix horaire HT </label>
          <input
            name="hourTaxFreePrice" type="number" step="any" defaultValue={rate.hourTaxFreePrice}
          />
        </th>
      </tr>
      <tr>
        <th>
          <label forhtml="place">Lieu </label>
          <input type="text" name="place" defaultValue={info.place}/>
        </th>
        <th colSpan="5">
          <label forhtml="dayTaxFreePrice">Prix journalier HT </label>
          <input
            type="number" name="dayTaxFreePrice" step="any" defaultValue={rate.dayTaxFreePrice}
          />
        </th>
      </tr>
      <tr>
        <th>
        </th>
        <th colSpan="6">
          <label forhtml="taxPercent">TVA (en %) </label>
          <input
            type="number" name="taxPercent" step="any" defaultValue={rate.taxPercent}
          />
        </th>
      </tr>
    </thead>
  );
}

function TableDay(props){
  return (
    <tr>
      <th>Date</th>
      <th>Type</th>
      <th>Heures</th>
      <th>Prix HT</th>
      <th>Prix TTC</th>
      <th></th>
    </tr>
  );
}

function DayInfo(props){
  const day = props.day ? props.day : {};
  const onDayChange = (event) => props.onDayChange(day, event.target.name, event.target.value);

  return (
    <tr>
      <td>
        <input type="date" name="date" defaultValue={day.date} onChange={onDayChange}/>
      </td>
      <td>
        <select name="type" defaultValue={day.type} onChange={onDayChange}>
          <option value="TRANSFER">Transfert</option>
          <option value="DAY">Jour complet</option>
          <option value="HOURS">Heures travaillé</option>
        </select>
      </td>
      <td>
        {day.type === "HOURS" ? <input type="number" name="hours" step="any" defaultValue={day.hours} onChange={onDayChange}/> : null}
      </td>
      <td>
        {day.type === "TRANSFER" ?
          <input type="number" name="taxFreePrice" step="any" defaultValue={day.taxFreePrice} onChange={onDayChange}/>
          : <p>{day.taxFreePrice}</p>
        }
      </td>
      <td>
        {day.price}
      </td>
      <td>
        <i className="fa fa-trash"></i>
      </td>
    </tr>
  );
}

function Day(props){
  const newDayNeed = (daysSorted) => {
    const len = daysSorted.length;

    return len > 0 && daysSorted[len - 1].date ? <DayInfo onDayChange={props.onDayChange}/> : null;
  };
  const daysSorted = props.days.sort((d1, d2) => d1.date < d2.date);
  const days = daysSorted.map(d => <DayInfo day={d} key={d.id} onDayChange={props.onDayChange}/>)

  return (
    <tbody>
      <TableDay />
      {days}
      {newDayNeed(daysSorted)}
    </tbody>
  )
}

class WorkingDay extends Component{
  constructor(props){
    super(props);

    this.state = {
      data: {
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
          price: 90.5
        }, {
          id: 2,
          date: "2019-03-02",
          type: "DAY",
          taxFreePrice: 60.2,
          price: 80.5
        }]
      }
    };

    this.onDayChange = this.onDayChange.bind(this);
  }

  onDayChange(day, name, value) {
    const fcts = [
      (day, name, value) => name === "date" ? {...day, date: value} : day,
      (day, name, value) => {
        if (name === 'type') {
          if (value === 'HOURS') {
            return {...day, hours: 0.0, taxFreePrice: 0.0, price: 0.0, type: value}
          }
          if (value === 'TRANSFER') {
            return {...day, hours: null, taxFreePrice: 0.0, price: 0.0, type: value}
          }
          return {...day, hours: null, taxFreePrice: this.state.data.constructionSiteInfo.rate.dayTaxFreePrice, price: 0.0, type: value}
        }
        return day;
      }
    ];
    const workingDays = this.state.data.workingDays.filter(d => d.id !== day.id);
    const newWorkingDays = fcts.reduce((d, fct) => fct(d, name, value), day);
    const data = {...this.state.data, workingDays: [...workingDays, newWorkingDays]}
    this.setState({data: data});
  }

  render() {
    return (
      <table className="Working-Days">
        <GlobalInfo constructionSiteInfo={this.state.data.constructionSiteInfo} />
        <Day
          days={this.state.data.workingDays}
          onDayChange={this.onDayChange}
        />
      </table>
    );
  }
}


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

class App extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      onNewWorkDay: false
    };

    this.newWorkDay = this.newWorkDay.bind(this);
  }

  newWorkDay(){
    this.setState({
      onNewWorkDay: true
    })
  }

  render() {
    return (
      <div className="App">
        <p>Menu principal</p>
        <header className="App-header">
          {//this.state.onNewWorkDay ?
            <WorkingDay />// : <WorkingDays onNewWorkDay={this.newWorkDay}/>
          }
        </header>
      </div>
    );
  }
}

export default App;
