import React, { Component } from 'react';
import './App.css';
import {Accounting, CategoryType, PaymentMethod} from './lib/Accounting';

function getAccounting() {
  return [{
    id: 1,
    date: {year: 2019, month: 3, day: 3},
    price: {price: 120.00, taxPercent: 20, taxFreePrice: 100},
    payment: {method: "CHEQUE", chequeNumber: "323"},
    info: {description: "libelle", invoiceNumber: "FDS23"}
  }, {
    id: 2,
    date: {year: 2019, month: 3, day:1},
    price: {price: 240.00, taxPercent: 20, taxFreePrice: 200},
    payment: {method: "CB", chequeNumber: null},
    info: {description: "libelle", invoiceNumber: "FDS23"}
  }];
}

const categoryExpenseSelect = (category, onChange) => (
    <select defaultValue={CategoryType.toString(category)} name="category" onChange={onChange} >
      <option disabled value="">----</option>
      <option value="GIFT">Cadeau client</option>
      <option value="DIESEL_MACHINES">Diesel machines</option>
      <option value="DIESEL_VAN">Diesel fourgon</option>
      <option value="ADMINISTRATIVE">Adminstratif</option>
      <option value="MAINTENANCE_VAN">Maintenance fourgon</option>
      <option value="MAINTENANCE_OK">Maintenance O&K</option>
      <option value="MAINTENANCE_VOLVO">Maintenace Volvo</option>
      <option value="OTHER">Autre</option>
      <option value="CREDIT">Crédit</option>
    </select>
);

const paymentMethodSelect = (paymentMethod, onChange) => (
  <select defaultValue={PaymentMethod.toString(paymentMethod)} name="paymentMethod" onChange={onChange} >
    <option value="CB">CB</option>
    <option value="CHEQUE">Chèque</option>
    <option value="CASH">Cash</option>
    <option value="DIRECT_DEBIT">Débit</option>
    <option value="CREDIT">Crédit</option>
  </select>
);

const chequeView = (paymentMethod, chequeNumber, onChange) => (
  <th>{
    paymentMethod === PaymentMethod.CHEQUE &&
    <input  type="text" name="chequeNumber"
            className="Cheque-number" defaultValue={chequeNumber}
            onChange={onChange}
            />
  }</th>
);

const invoiceView = (invoiceNumber, onChange, useColspan = false) => {
  const colspan = useColspan ? {"colSpan": 2} : {};
  return (
    <th {...colspan}>
      <input  type="text" name="invoiceNumber"
              className="Invoice-number" defaultValue={invoiceNumber}
              onChange={onChange}
              />
    </th>
  );
};

const chequeNumberAndBillingView = (nbChequeNotNull) => {
  if (nbChequeNotNull){
    return (
      <>
        <th>Cheque</th>
        <th>Facture</th>
      </>
    );
  }
  return (<th colSpan="2">Facture</th>)
}

const chequeAndInvoiceView = (nbChequeNotNull, onChange, {paymentMethod, chequeNumber, invoiceNumber}) => {
  if (nbChequeNotNull) {
    return (
      <>
        {chequeView(paymentMethod, chequeNumber, onChange)}
        {invoiceView(invoiceNumber, onChange)}
      </>
    );
  }
  return (<>{invoiceView(invoiceNumber, onChange, true)}</>);
}

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      accounting: new Accounting(getAccounting())
    };

    this.onChange = this.onChange.bind(this);
    this.updateExpense = this.updateExpense.bind(this);
  }

  accountingSort = () => this.state.accounting.sort((a1, a2) => a1.id > a2.id);
  nbChequeNotNull = () => this.state.accounting.nbCheque !== 0;

  updateExpense(expense) {
    const accounting = this.state.accounting;
    const newAccounting = accounting.removeExpense(expense).addExpense(expense);
    const newAccountingCompute = newAccounting.compute();
    this.setState({accounting: newAccountingCompute});
  }

  onChange = (expense, field, value) => this.updateExpense(expense.update(field, value));

  tableLine(expense){
    const onChange = (e) => this.onChange(expense, e.target.name, e.target.value);
    const inputView = (type, name, value) => {
      const step = type === "number" ? {"step": "Any"} : {};
      return (<input type={type} name={name} defaultValue={value} onChange={onChange} {...step} />);
    };

    return (
      <tr key={expense.id}>
        <td>{inputView("date", "date", expense.stringDate)}</td>
        <th>{categoryExpenseSelect(expense.category, onChange)}</th>
        <th>{inputView("text", "description", expense.description)}</th>
        <th>{paymentMethodSelect(expense.paymentMethod, onChange)}</th>
        {chequeAndInvoiceView(this.nbChequeNotNull, onChange, expense)}
        <th>{inputView("number", "taxPercent", expense.taxPercent)}</th>
        <th>{expense.taxFreePrice}</th>
        <th>{inputView("number", "realPrice", expense.realPrice)}</th>
      </tr>
    );
  }

  render() {
    return (
      <div className="App">
        <p><a href={this.props.conf.entrypointUrl}>Menu principal</a></p>
        <div className="App-font">
          <table border="1">
            <thead>
            <tr>
                <th></th>
                <th colSpan="2">Général</th>
                <th colSpan="3">Paiment</th>
                <th colSpan="3">Prix</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Date</th>
                <th>Catégorie</th>
                <th>Libellé</th>
                <th>Paiement</th>
                {chequeNumberAndBillingView(this.nbChequeNotNull())}
                <th>TVA</th>
                <th>HT</th>
                <th>TTC</th>
              </tr>
              {this.accountingSort().map(e => this.tableLine(e))}
              {this.tableLine(this.state.accounting.newExpense())}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
