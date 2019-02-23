export class Accounting {
    constructor(expenses) {
      this.expenses = expenses.map(e => e instanceof Expense ? e : new Expense(e));
    }
  
    map = (e) => this.expenses.map(e);
    filter = (e) => this.expenses.filter(e);
    sort = (e) => this.expenses.sort(e);

    newExpense() {
        const len = this.expenses.length;
        const expensesSort = this.expenses.sort((e1, e2) => e1.id > e2.id);
        const lastExpense = len ? expensesSort[len - 1] : null;
        const newId = lastExpense ? lastExpense.id + 1 : 0;
        const newDate = lastExpense ? lastExpense.date : {};
        const taxPercent = lastExpense ? lastExpense.price.taxPercent : null;
        return new Expense({
            id: newId,
            date: newDate,
            price: new Price({taxPercent: taxPercent})
        });
    }

    addExpense = (expense) => new Accounting([...this.expenses, expense]);
    removeExpense = (expense) => new Accounting(this.filter(e => e.id !== expense.id));

    compute() {
        const expenses = this.expenses.map(e => e.compute());
        return new Accounting(expenses);
    }

    get nbCheque() {return this.nbGen(PaymentMethod.CHEQUE);}
    get nbCB() {return this.nbGen(PaymentMethod.CB);}
    get nbCash() {return this.nbGen(PaymentMethod.CASH);}
    get nbCredit() {return this.nbGen(PaymentMethod.CREDIT);}
    get nbDirectDebit() {return this.nbGen(PaymentMethod.DIRECT_DEBIT);}

    // Private
    nbGen = (method) => this.filter(a => a.paymentMethod === method).length;
}
  
export class Expense {
    constructor({id, date = {}, price = {}, payment = {}, info = {}}){
      this.id = id;
      this.date = new Date(date);
      this.price = new Price(price);
      this.payment = new Payment(payment);
      this.info = new Info(info);
    }
  
    get year(){return this.date.year};
    get month(){return this.date.month};
    get day(){return this.date.day};
    get stringDate(){return this.date.toString()};
  
    get taxFreePrice(){return this.price.taxFreePrice};
    get realPrice(){return this.price.price};
    get taxPercent(){return this.price.taxPercent};
  
    get description(){return this.info.description};
    get invoiceNumber(){return this.info.invoiceNumber};
    get category(){return this.info.category};
    
    get chequeNumber(){return this.payment.chequeNumber};
    get paymentMethod(){return this.payment.method};

    update(field, value) {
        if (field === "paymentMethod") {
            return this.update("method", value);
        }
        if (field === "realPrice"){
            return this.update("price", value);
        }
        const id = this.id;
        const newDate = new Date(field === "date" ? value : this.date);
        const price = new Price({...this.price, [field]: value}).compute();
        const newPayment = new Payment({...this.payment, [field]: value});
        const newInfo = new Info({...this.info, [field]: value});
        return new Expense({
            id: id,
            date: newDate,
            price: price,
            payment: newPayment,
            info: newInfo
        });
    }
    
    compute = () => this.update(null, null);
}
  
class Date {
    constructor(date){
        let year, month, day = null;
        if (typeof date === "string"){
            ([year, month, day] = [...date.split('-').map(n => parseInt(n))]);
        }
        else {
            ({year, month, day} = date);
        }
        this.year = year;
        this.month = month;
        this.day = day;
    }

    toString = () => {
        const month = this.month > 9 ? this.month : `0${this.month}`;
        const day = this.day > 9 ? this.day : `0${this.day}`;
        return `${this.year}-${month}-${day}`;
    }
}
  
class Price {
    constructor({taxFreePrice = null, price = null, taxPercent = null}) {
        this.taxFreePrice = taxFreePrice;
        this.price = price;
        this.taxPercent = taxPercent;
    }

    compute() {
        if (!this.price || !this.taxPercent){
            return this;
        }
        const price = this.price * 100;
        const tax = this.taxPercent / 100.0;
        const taxFreePrice = price / (1 + tax);
        const taxFreePriceFloat = Math.trunc(taxFreePrice) / 100;
        return new Price({
            taxFreePrice: taxFreePriceFloat,
            price: this.price,
            taxPercent: this.taxPercent
        });
    }
}
  
class Info {
    constructor({description = null, invoiceNumber = null, category = null}) {
      this.description = description;
      this.invoiceNumber = invoiceNumber;
      if (category){
        this.category = typeof category === 'symbol' ? category : CategoryType[category];
      }
      else {
        this.category = CategoryType.NULL;
      }
    }
}
  
class Payment {
    constructor({method = null, chequeNumber = null}) {
        if (method){
            this.method = typeof method === "symbol" ? method : PaymentMethod[method];
        }
        else {
            this.method = PaymentMethod.CB;
        }
      this.chequeNumber = chequeNumber;
    }
}
  
export const CategoryType = Object.freeze({
    NULL: Symbol(null),
    GIFT: Symbol("GIFT"),
    DIESEL_MACHINES: Symbol("DIESEL_MACHINES"),
    DIESEL_VAN: Symbol("DIESEL_VAN"),
    ADMINISTRATIVE: Symbol("ADMINISTRATIVE"),
    MAINTENANCE_VAN: Symbol("MAINTENANCE_VAN"),
    MAINTENANCE_OK: Symbol("MAINTENANCE_OK"),
    MAINTENANCE_VOLVO: Symbol("MAINTENANCE_VOLVO"),
    OTHER: Symbol("OTHER"),
    CREDIT: Symbol("CREDIT"),

    toString: (c) => {
        const categories = [
            [CategoryType.NULL, ""],
            [CategoryType.GIFT, "GIFT"],
            [CategoryType.DIESEL_MACHINES, "DIESEL_MACHINES"],
            [CategoryType.DIESEL_VAN, "DIESEL_VAN"],
            [CategoryType.ADMINISTRATIVE, "ADMINISTRATIVE"],
            [CategoryType.MAINTENANCE_VAN, "MAINTENANCE_VAN"],
            [CategoryType.MAINTENANCE_OK, "MAINTENANCE_OK"],
            [CategoryType.MAINTENANCE_VOLVO, "MAINTENANCE_VOLVO"],
            [CategoryType.OTHER, "OTHER"],
            [CategoryType.CREDIT, "CREDIT"]
        ];
        const category = categories.find(ct => c === ct[0]);
        return category ? category[1] : null;
    }
});
  
export const PaymentMethod = Object.freeze({
    CB: Symbol("CB"),
    CHEQUE: Symbol("CHEQUE"),
    CASH: Symbol("CASH"),
    DIRECT_DEBIT: Symbol("DIRECT_DEBIT"),
    CREDIT: Symbol("CREDIT"),

    toString: (p) => {
        if (PaymentMethod.CB === p) return "CB";
        if (PaymentMethod.CHEQUE === p) return "CHEQUE";
        if (PaymentMethod.CASH === p) return "CASH";
        if (PaymentMethod.DIRECT_DEBIT === p) return "DIRECT_DEBIT";
        if (PaymentMethod.CREDIT === p) return "CREDIT";
        return null;
    }
});