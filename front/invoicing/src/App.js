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

function Info(props){
  const info = props.constructionSiteInfo;
  const rate = info.rate;

  const onConstructionSiteChange = (e) => props.onConstructionSiteChange(e.target.name, e.target.value);
  const inputNumber = (name, text, colSpan) => {
    return (
      <th colSpan={colSpan}>
        <label forhtml={name}>{text}</label>
        <input type="number" name={name} step="any" defaultValue={rate[name]} onChange={onConstructionSiteChange}/>
      </th>
    );
  }

  return (
    <thead>
      <tr>
        <th>
          <label forhtml="client">Client </label>
          <input name="client" list="clients" defaultValue={info.client} onChange={onConstructionSiteChange} onBlur={onConstructionSiteChange}/>
          <datalist id="clients">{props.clients.map(c => <option value={c} key={c}/>)}</datalist>
        </th>
        {inputNumber("hourTaxFreePrice", "Prix horaire HT ", 5)}
      </tr>
      <tr>
        <th>
          <label forhtml="place">Lieu </label>
          <input type="text" name="place" defaultValue={info.place} onChange={onConstructionSiteChange}/>
        </th>
        {inputNumber("dayTaxFreePrice", "Prix journalier HT ", 5)}
      </tr>
      <tr>
        <th></th>
        {inputNumber("taxPercent", "TVA (en %) ", 6)}
      </tr>
    </thead>
  );
}

function Day(props){
  const day = props.day;
  const onDayChange = (event) => props.onDayChange(day, event.target.name, event.target.value);
  const inputNumber = (name) => <input type="number" name={name} step="any" defaultValue={day[name]} onChange={onDayChange}/>;

  return (
    <tr>
      <td>
        <input type="date" name="date" defaultValue={day.date} onChange={onDayChange}/>
      </td>
      <td>
        <p>
          <select name="type" defaultValue={day.type} onChange={onDayChange}>
            <option value="TRANSFER">Transfert</option>
            <option value="DAY">Jour complet</option>
            <option value="HOURS">Heures travaillé</option>
          </select>
        </p>
      </td>
      <td>
        <p>{day.type === "HOURS" ? inputNumber("hours") : null}</p>
      </td>
      <td>
        <p>{day.type === "TRANSFER" ? inputNumber("taxFreePrice") : day.taxFreePrice}</p>
      </td>
      <td>
        <p>{day.price}</p>
      </td>
      <td>
        <i className="fa fa-trash" onClick={() => props.deleteDay(day)}></i>
      </td>
    </tr>
  );
}

function newDay(){
  return {
    id: 10,
    date: null,
    type: null,
    taxFreePrice: null,
    price: null
  };
}

function Days(props){
  const daysSorted = props.days.sort((d1, d2) => d1.date ? d1.date < d2.date : true);
  const days = daysSorted.map(d => <Day day={d} key={d.id} onDayChange={props.onDayChange} deleteDay={props.deleteDay}/>)

  const newDayNeed = (daysSorted) => {
    const len = daysSorted.length;
    const day = newDay();
    const createDay = len === 0 || !daysSorted.find(d => !d.date);
    return createDay ? <Day day={day} key={day.id} onDayChange={props.onDayChange} deleteDay={props.deleteDay}/> : null;
  };

  return (
    <tbody>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Heures</th>
        <th>Prix HT</th>
        <th>Prix TTC</th>
        <th></th>
      </tr>
      {days}
      {newDayNeed(daysSorted)}
    </tbody>
  )
}

class ConstructionSite extends Component{
  constructor(props){
    super(props);

    this.state = {
      clients: ["Eurovia", "Gille", "Paul"],
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
      }
    };

    this.onDayChange = this.onDayChange.bind(this);
    this.deleteDay = this.deleteDay.bind(this);
    this.onConstructionSiteChange = this.onConstructionSiteChange.bind(this);
  }

  calculPrices(day, transferTaxFreePrice = null) {
    const data = this.state.data;
    const rate = data.constructionSiteInfo.rate;
    const tax = rate.taxPercent / 100;

    if (day.hours !== null && day.hours !== undefined) {
      return {...day, ...hoursPrice(day.hours, rate.hourTaxFreePrice, tax)};
    }
    if (day.type === "TRANSFER") {
      return {...day, ...getPrice(transferTaxFreePrice ? transferTaxFreePrice : day.taxFreePrice, tax)};
    }
    return {...day, ...getPrice(rate.dayTaxFreePrice, tax)};
  }

  onDayChange(day, name, value) {
    const dayChangeOperations = [
      (day, name, value) => name === "date" ? {...day, date: value} : day,
      (day, name, value) => name === 'hours' ? this.calculPrices({...day, hours: value}) : day,
      (day, name, value) => name === 'taxFreePrice' ? this.calculPrices(day, value) : day,
      (day, name, value) => name === 'type' ? this.calculPrices({...day, hours: value === 'HOURS' ? 0.0 : null, type: value}) : day
    ];
    const data = this.state.data;
    const workingDays = data.workingDays.filter(d => d.id !== day.id);
    const newWorkingDays = dayChangeOperations.reduce((d, fct) => fct(d, name, value), day);
    const newData = {...data, workingDays: [...workingDays, newWorkingDays]}
    this.setState({data: newData});
  }

  deleteDay(day) {
    const data = this.state.data;
    const workingDays = data.workingDays.filter(d => d.id !== day.id);
    const newData = {...data, workingDays: workingDays}
    this.setState({data: newData});
  }

  onConstructionSiteChange(name, value) {
    const data = this.state.data;
    const constructionSiteInfo = data.constructionSiteInfo;

    if (name === 'client' || name === 'place') {
      const newConstructionSiteInfo = {...constructionSiteInfo, [name]: value}
      this.setState({data: {...data, constructionSiteInfo: newConstructionSiteInfo}});
    }
    else {
      const rate = constructionSiteInfo.rate;
      const newRate = {...rate, [name]: parseFloat(value)};
      const newConstructionSiteInfo = {...constructionSiteInfo, rate: newRate};

      this.setState({data: {...data, constructionSiteInfo: newConstructionSiteInfo}}, () => {
        const workingDays = this.state.data.workingDays.map(d => this.calculPrices(d))
        this.setState({data: {...this.state.data, workingDays: workingDays}});      
      });
    }
  }

  render() {
    return (
      <table className="Working-Days">
        <Info
          clients={this.state.clients}
          constructionSiteInfo={this.state.data.constructionSiteInfo}
          onConstructionSiteChange={this.onConstructionSiteChange}
        />
        <Days
          days={this.state.data.workingDays}
          onDayChange={this.onDayChange}
          deleteDay={this.deleteDay}
        />
      </table>
    );
  }
}

function hoursPrice(hours, hourTaxFreePrice, tax) {
  const hoursTaxFree = hourTaxFreePrice * 100;
  const priceTaxFree = hoursTaxFree * hours;
  const price = priceTaxFree + priceTaxFree * tax;
  return {taxFreePrice: priceTaxFree / 100, price: price / 100}
}

function getPrice(taxFreePrice, tax){
  const intTaxFreePrice = taxFreePrice * 100;
  const price = intTaxFreePrice + intTaxFreePrice * tax;
  return {taxFreePrice: taxFreePrice, price: price / 100};
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
            <ConstructionSite />// : <WorkingDays onNewWorkDay={this.newWorkDay}/>
          }
        </header>
      </div>
    );
  }
}

export default App;
