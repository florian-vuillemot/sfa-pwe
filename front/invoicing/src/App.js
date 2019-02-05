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
      <tr key={wd.date + wd.place + wd.price}>
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

    this.state = {
      workingDays: [{
        date: "20/01/2019",
        client: "Eurovia",
        place: "Paris",
        type: "Transfert",
        taxFreePrice: 80.2,
        price: 90.5
      },
      {
        date: "21/01/2019",
        client: "Gilbert",
        place: "Paris",
        type: "Chantier",
        taxFreePrice: 60.2,
        price: 80.5
      }
    ]
    };
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

function Price(props){
  return (
    <div>
      <label for="taxFreePrice">Prix HT: </label>
      <input name="number" name="taxFreePrice" step="any"/>
      <label for="price">Prix TTC: </label>
      <input name="number" name="price" step="any"/>
    </div>
  );
}

function GlobalInfo(props){
  return (
    <thead>
      <tr>
        <th>
          <label for="client">Client </label>
          <input name="client" list="clients" />
        </th>
        <th colSpan="5">
          <label for="hourTaxFreePrice">Prix horaire HT </label>
          <input name="hourTaxFreePrice" type="number" step="any"/>
        </th>
      </tr>
      <tr>
        <th>
          <label for="place">Lieu </label>
          <input type="text" name="place" />
        </th>
        <th colSpan="5">
          <label for="dayPrice">Prix journalier HT </label>
          <input type="number" name="dayPrice" step="any"/>
        </th>
      </tr>
      <datalist id="clients">
        <option value="Eurovia"/>
        <option value="Gille"/>
      </datalist>
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
  console.log(props)
  const day = props.day ? props.day : {};
  return (
    <tr>
      <td>
        <input type="date" value={day.date}/>
      </td>
      <td>
        <select name="type" value={day.type}>
          <option value="transfert">Transfert</option>
          <option value="day">Jour complet</option>
          <option value="hours">Heures travaillé</option>
        </select>
      </td>
      <td>
        <input type="number" step="any" value={day.hours}/>
      </td>
      <td>
        <input type="number" step="any" value={day.taxFreePrice}/>
      </td>
      <td>
        <input type="number" step="any" value={day.price}/>
      </td>
      <td>
        <i class="fa fa-trash"></i>
      </td>
    </tr>
  );
}

function Day(props){
  const newDayNeed = (daysSorted) => {
    const len = daysSorted.length;

    return len > 0 && daysSorted[len - 1].date ? <DayInfo /> : null;
  };
  const daysSorted = props.days.sort((d1, d2) => d1.date < d2.date);
  const days = daysSorted.map(d => <DayInfo day={d}/>)

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

    }
  }

  render() {
    const days = [
      {
        date: "20/01/2019",
        client: "Eurovia",
        place: "Paris",
        type: "Transfert",
        taxFreePrice: 80.2,
        price: 90.5
      },
      {
        date: "21/01/2019",
        client: "Gilbert",
        place: "Paris",
        type: "Chantier",
        taxFreePrice: 60.2,
        price: 80.5
      }
    ];
    return (
      <table className="Working-Days">
        <GlobalInfo />
        <Day days={days}/>
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
