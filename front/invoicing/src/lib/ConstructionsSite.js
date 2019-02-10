export class ConstructionsSite {
    constructor(constructionsSite){
        this.constructionsSite = constructionsSite.map(cs => new ConstructionSite(cs));
    }

    get workingDays(){
        return this.constructionsSite.reduce((acc, d) => [...acc, ...d.workingDays], []);
    }
    get nbDaysWorked(){
        return this.workingDays.reduce((acc, d) => acc + (WorkingDayType.DAY === d.type), 0);
    }
    get nbDaysWithHours(){
        return this.workingDays.reduce((acc, d) => acc + (WorkingDayType.HOURS === d.type), 0);
    }
    get nbTransfer(){
        return this.workingDays.reduce((acc, d) => acc + (WorkingDayType.TRANSFER === d.type), 0);
    }

    map = (f) => this.constructionsSite.map(f);
    filter = (f) => this.constructionsSite.filter(f);
    sort = (f) => this.constructionsSite.sort(f);
}

export class ConstructionSite {
    constructor({id, constructionSiteInfo = null, workingDays = []}) {
        this.id = id;
        this.constructionSiteInfo = new ConstructionSiteInfo(constructionSiteInfo);
        this.workingDays = workingDays.map(wd => new WorkingDay(wd));
    }

    static factory(constructionsSite) {
        const greatId = constructionsSite.length ? constructionsSite.sort((c1, c2) => c1.id < c2.id)[0] : null;
        const id = greatId ? greatId.id + 1 : 0;
        const rate = greatId ? greatId.constructionSiteInfo.rate : {};
        const constructionSiteInfo = new ConstructionSiteInfo({
            client: null,
            place: null,
            rate: rate
        });
        return new ConstructionSite({
            id: id,
            constructionSiteInfo: constructionSiteInfo
        });
    }

    get client(){return this.constructionSiteInfo.client;}
    get place(){return this.constructionSiteInfo.place;}

    get transfers(){return this.workingDays.filter(wd => wd.type === WorkingDayType.TRANSFER);}
    get days(){return this.workingDays.filter(wd => wd.type === WorkingDayType.DAY);}
    get hours(){return this.workingDays.filter(wd => wd.type === WorkingDayType.HOURS)}

    get price(){return this.workingDays.reduce((acc, wd) => acc + wd.price, 0);}

    get taxPercent() {return this.constructionSiteInfo.rate.taxPercent;}
    get hourPrice() {return this.constructionSiteInfo.rate.hourTaxFreePrice;}
    get dayPrice() {return this.constructionSiteInfo.rate.dayTaxFreePrice;}

    updatePlace = (value) => this.updateConstructionSiteInfo({place: value})
    updateClient = (value) => this.updateConstructionSiteInfo({client: value})

    addWorkingDay = (wd) => this.updateWorkingDay([...this.workingDays, wd]);
    deleteWorkingDay = (id) => this.updateWorkingDay(this.workingDays.filter(wd => wd.id !== id));

    updateHourPrice = (hourPrice) => {
        const rate = new Rate({...this.constructionSiteInfo.rate, hourTaxFreePrice: hourPrice});
        return this.updateConstructionSiteInfo({rate: rate});
    }
    updateDayPrice = (dayPrice) => {
        const rate = new Rate({...this.constructionSiteInfo.rate, dayTaxFreePrice: dayPrice});
        return this.updateConstructionSiteInfo({rate: rate});
    }
    updateTaxPercent = (taxPercent) => {
        const rate = new Rate({...this.constructionSiteInfo.rate, taxPercent: taxPercent});
        return this.updateConstructionSiteInfo({rate: rate});
    }

    computePrice(){
        const cb = (wd) => WorkingDay.computePrice(wd, this.hourPrice, wd.taxFreePrice, this.dayPrice, this.taxPercent / 100);
        return this.updateWorkingDay(this.workingDays.map(wd => cb(wd)));
    }

    /*
    * Private
    */
    updateConstructionSiteInfo(newData){
        const newConstructionSiteInfo = new ConstructionSiteInfo({...this.constructionSiteInfo, ...newData});
        return new ConstructionSite({id: this.id, constructionSiteInfo: newConstructionSiteInfo, workingDays: this.workingDays});
    }
    updateWorkingDay = (workingDays) => new ConstructionSite({
        id: this.id, 
        constructionSiteInfo: this.constructionSiteInfo,
        workingDays: workingDays
    });
}

class ConstructionSiteInfo {
    constructor({client, place, rate}) {
        this.client = client;
        this.place = place;
        this.rate = new Rate(rate);
    }
}

class Rate {
    constructor({hourTaxFreePrice = null, dayTaxFreePrice = null, taxPercent = null}){
        this.hourTaxFreePrice = hourTaxFreePrice;
        this.dayTaxFreePrice = dayTaxFreePrice;
        this.taxPercent = taxPercent;
    }
}

export const WorkingDayType = Object.freeze({
    null: Symbol(null),
    DAY: Symbol("DAY"),
    HOURS: Symbol("HOURS"),
    TRANSFER: Symbol("TRANSFER"),

    toString: (v) => {
        if (v === WorkingDayType.null) return "";
        if (v === WorkingDayType.DAY) return "DAY";
        if (v === WorkingDayType.HOURS) return "HOURS";
        if (v === WorkingDayType.TRANSFER) return "TRANSFER";
        return null;
    }
});

export class WorkingDay {
    constructor({id, date = null, type = null, taxFreePrice = null, price = null, hours = null}){
        const typeIsSymbol = typeof type === 'symbol';

        if (type && !typeIsSymbol && !WorkingDayType[type]){
            throw new Error("Bad Symbol");
        }
        this.id = id;
        this.date = date;
        this.type = typeIsSymbol ? type : WorkingDayType[type];
        this.taxFreePrice = taxFreePrice;
        this.price = price;
        this.hours = hours;
    }

    static factory(workingsDay, args = {}) {
        const greatId = workingsDay.length ? workingsDay.sort((c1, c2) => c1.id < c2.id)[0].id + 1 : 0;
        return new WorkingDay({id: greatId, ...args});
    }

    static updateType(workingDay, type){
        if (WorkingDayType[type] === WorkingDayType.HOURS){
            return new WorkingDay({...workingDay, type: WorkingDayType.HOURS, hours: 0.0, taxFreePrice: 0.0, price: 0.0});
        }
        return WorkingDay.updatePrice(new WorkingDay({...workingDay, type: type}));
    }

    static computePrice(workingDay, hourTaxFreePrice, customTaxFreePrice, dayTaxFreePrice, taxPercent){
        if (workingDay.hours !== null){
            return WorkingDay.updateHoursPrice(workingDay, workingDay.hours, hourTaxFreePrice, taxPercent);
        }
        const price = workingDay.type === WorkingDayType.DAY ? dayTaxFreePrice : customTaxFreePrice;
        return WorkingDay.updatePrice(workingDay, price, taxPercent);
    }

    static updateHoursPrice(workingDay, hours, hourTaxFreePrice, tax) {
        const hoursTaxFree = hourTaxFreePrice * 100;
        const priceTaxFree = hoursTaxFree * hours;
        const price = priceTaxFree + priceTaxFree * tax;
        return new WorkingDay({
            ...workingDay,
            taxFreePrice: priceTaxFree / 100,
            price: price / 100,
            hours: hours
        });
    }
    
    static updatePrice(workingDay, taxFreePrice, tax){
        const intTaxFreePrice = taxFreePrice * 100;
        const price = intTaxFreePrice + intTaxFreePrice * tax;
        return new WorkingDay({...workingDay, taxFreePrice: taxFreePrice, price: Math.trunc(price) / 100, hours: null});
    }
}
