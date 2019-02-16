import React, { Component } from 'react';
import './App.css';

class Accounting {
  constructor(expenses) {
    this.expenses = expenses.map(a => new Expenses(a));
  }
}

class Expenses {
  constructor({id, date, price, payment, info}){
    this.id = id;
    this.date = new Date(date);
    this.price = new Price(price);
    this.payment = new Payment(payment);
    this.info = new Info(info);
  }

  get year(){return this.date.year};
  get month(){return this.date.month};
  get day(){return this.date.day};

  get taxFreePrice(){return this.price.taxFreePrice};
  get realPrice(){return this.price.price};
  get taxPercent(){return this.price.taxPercent};

  get description(){return this.payment.description};
  get invoiceNumber(){return this.payment.invoiceNumber};
  
  get chequeNumber(){return this.payment.chequeNumber};
  get method(){return this.payment.method};
}

class Date {
  constructor({year, month, day}){
    this.year = year;
    this.month = month;
    this.day = day;
  }
}

class Price {
  constructor({taxFreePrice, price, taxPercent}) {
    this.taxFreePrice = taxFreePrice;
    this.price = price;
    this.taxPercent = taxPercent;
  }
}

class Info {
  constructor({description, invoiceNumber, categorie = null}) {
    this.description = description;
    this.invoiceNumber = invoiceNumber;
    if (categorie){
      this.categorie = typeof categorie === 'symbol' ? categorie : CategorieType[categorie];
    }
    else {
      this.categorie = CategorieType[null];
    }
  }
}

class Payment {
  constructor({method, chequeNumber}) {
    this.method = typeof method === "symbol" ? method : PaymentMethod[method];
    this.chequeNumber = chequeNumber;
  }
}

export const CategorieType = Object.freeze({
  null: Symbol(null),
  GIFT: Symbol("GIFT"),
  DIESEL_MACHINES: Symbol("DIESEL MACHINES"),
  DIESEL_VAN: Symbol("DIESEL VAN"),
  ADMINISTRATIVE: Symbol("ADMINISTRATIVE"),
  MAINTENANCE_VAN: Symbol("MAINTENANCE VAN"),
  MAINTENANCE_OK: Symbol("MAINTENANCE OK"),
  MAINTENANCE_VOLVO: Symbol("MAINTENANCE VOLVO"),
  OTHER: Symbol("OTHER"),
  CREDIT: Symbol("CREDIT")
});

export const PaymentMethod = Object.freeze({
  CB: Symbol("CB"),
  CHEQUE: Symbol("CHEQUE"),
  CASH: Symbol("CASH")
});

function getAccounting() {
  return [{
    id: 1,
    date: {year: 2019, month: 3, day: 3},
    price: {price: 120.00, taxPercent: 20, taxFreePrice: 100},
    payment: {method: "CB", chequeNumber: null},
    info: {description: "libelle", invoiceNumber: "FDS23"}
  }, {
    id: 2,
    date: {year: 2018, month: 3, day:1},
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
    console.log(this.state.accounting);
  }

  render() {
    return (
      <div className="App">
          <table>
            <thead>

            </thead>
            <tbody>
              <tr>
                <th>Date</th>
                <th>Catégorie</th>
                <th>Libellé</th>
                <th>Paiement</th>
                <th>Num chèque</th>
                <th>Num facture</th>
                <th>TVA</th>
                <th>Prix HT</th>
                <th>Prix TTC</th>
              </tr>
              <tr>
                <td><input type="date" name="date" /></td>
                <th>
                  <select>
                    <option value="DIESEL">Essence</option>
                  </select>
                </th>
                <th><input type="text" name="description" /></th>
                <th>
                  <select>
                    <option value="CB">CB</option>
                    <option value="CHEQUE">Chèque</option>
                    <option value="CASH">Cash</option>
                  </select>
                </th>
                <th><input type="text" name="chequeNumber" className="Cheque-number" /></th>
                <th><input type="text" name="invoiceNumber" className="Invoice-number" /></th>
                <th><input type="number" name="taxPercent" step="any" /></th>
                <th><input type="number" name="taxFreePrice" step="any" /></th>
                <th><input type="number" name="realPrice" step="any" /></th>
              </tr>
            </tbody>
          </table>
      </div>
    );
  }
}

export default App;
