import React, { Component } from 'react';
import './App.css';
import Calendar from './calendar/Calendar.js';
import SelectionAccountingInvoicing from './selectionAccountingInvoicing/selectionAccountingInvoicing.js';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      year: null,
      strMonth: null
    }

    this.handleClick = this.handleClick.bind(this); 
    this.clear = this.clear.bind(this); 
  }

  clear() {
    this.setState({
      year: null,
      strMonth: null
    });
  }

  handleClick(year, strMonth){
    this.setState({
      year: year,
      strMonth: strMonth
    });
  }

  getBalise(){
    if (this.state.year === null){
      return <Calendar onClick={this.handleClick} />
    }
    return <SelectionAccountingInvoicing
                isInvoicing={() => window.location.href = this.props.conf.invoicingUrl}
                isAccounting={() => console.log("account")}
                back={() => this.clear()}
            />
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          {this.getBalise()}
        </div>
      </div>
    );
  }
}

export default App;
