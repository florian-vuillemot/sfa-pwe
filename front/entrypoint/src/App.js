import React, { Component } from 'react';
import './App.css';
import Calendar from './calendar/Calendar.js';
import SelectionAccountingInvoicing from './selectionAccountingInvoicing/selectionAccountingInvoicing.js';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      year: null,
      month: null
    }

    this.handleClick = this.handleClick.bind(this); 
    this.clear = this.clear.bind(this); 
  }

  clear() {
    this.setState({
      year: null,
      month: null
    });
  }

  handleClick(year, month){
    this.setState({
      year: year,
      month: month
    });
  }

  getBalise(){
    if (this.state.year === null){
      return <Calendar onClick={this.handleClick} />
    }
    const args = `?year=${this.state.year}&month=${this.state.month}`;
    const invoicingUrl = `${this.props.conf.invoicingUrl}${args}`;
    const accountingUrl = `${this.props.conf.accountingUrl}${args}`;
    return <SelectionAccountingInvoicing
                isInvoicing={() => window.location.href = invoicingUrl}
                isAccounting={() => window.location.href = accountingUrl}
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
