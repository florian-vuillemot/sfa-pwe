import React, { Component } from 'react';
import './App.css';
import {Accounting, CategoryType, PaymentMethod} from './lib/Accounting';

function getAccounting() {
  return [{
    id: 1,
    date: {year: 2019, month: 3, day: 3},
    price: {price: 120.00, taxPercent: 20, taxFreePrice: 100},
    payment: {method: "CASH", chequeNumber: null},
    info: {description: "libelle", invoiceNumber: "FDS23"}
  }, {
    id: 2,
    date: {year: 2019, month: 3, day:1},
    price: {price: 240.00, taxPercent: 20, taxFreePrice: 200},
    payment: {method: "CB", chequeNumber: null},
    info: {description: "libelle", invoiceNumber: "FDS23"}
  }];
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

  updateExpense(expense) {
    const newAccounting = this.state.accounting
                              .removeExpense(expense)
                              .addExpense(expense)
                              .compute();
    this.setState({accounting: newAccounting});
  }

  categoryExpenseSelect(expense, onChange) {
    return (
      <select defaultValue={CategoryType.toString(expense.category)}
              name="category" onChange={onChange}
      >
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
  }

  paymentMethodSelect(expense, onChange) {
    return (
      <select defaultValue={PaymentMethod.toString(expense.paymentMethod)}
              name="paymentMethod" onChange={onChange}
      >
        <option value="CB">CB</option>
        <option value="CHEQUE">Chèque</option>
        <option value="CASH">Cash</option>
        <option value="DIRECT_DEBIT">Débit</option>
        <option value="CREDIT">Crédit</option>
      </select>
    );
  }

  onChange(expense, field, value) {
    const newExpense = expense.update(field, value);
    this.updateExpense(newExpense);
  }

  tableLine(expense){
    const onChange = (e) => this.onChange(expense, e.target.name, e.target.value);

    return (
      <tr key={expense.id}>
        <td>
          <input  type="date" name="date"
                  defaultValue={expense.stringDate}
                  onChange={onChange}
                  /></td>
        <th>
          {this.categoryExpenseSelect(expense, onChange)}</th>
        <th>
          <input  type="text" name="description"
                  defaultValue={expense.description}
                  onChange={onChange}
                  /></th>
        <th>
          {this.paymentMethodSelect(expense, onChange)}</th>
        <th>
          {expense.paymentMethod === PaymentMethod.CHEQUE &&
            <input  type="text" name="chequeNumber"
                    className="Cheque-number" defaultValue={expense.chequeNumber}
                    onChange={onChange}
                    />
          }</th>
        <th>
            <input  type="text" name="invoiceNumber"
                    className="Invoice-number" defaultValue={expense.invoiceNumber}
                    onChange={onChange}
                    /></th>
        <th>
          <input  type="number" name="taxPercent"
                  step="any" defaultValue={expense.taxPercent}
                  onChange={onChange}
                  /></th>
        <th>
          {expense.taxFreePrice}</th>
        <th>
          <input  type="number" name="realPrice"
                  step="any" defaultValue={expense.realPrice}
                  onChange={onChange}
                  /></th>
      </tr>
    );
  }

  render() {
    return (
      <div className="App">
          <table>
            <thead>

            </thead>
            <tbody>
              <tr>
                <th></th>
                <th colSpan="2">Général</th>
                <th colSpan="3">Paiment</th>
                <th colSpan="3">Prix</th>
              </tr>
              <tr>
                <th>Date</th>
                <th>Catégorie</th>
                <th>Libellé</th>
                <th>Paiement</th>
                <th>{this.state.accounting.nbCheque !== 0 && "Num"}</th>
                <th>Facture</th>
                <th>TVA</th>
                <th>HT</th>
                <th>TTC</th>
              </tr>
              {this.accountingSort().map(e => this.tableLine(e))}
              {this.tableLine(this.state.accounting.newExpense())}
            </tbody>
          </table>
      </div>
    );
  }
}

export default App;
