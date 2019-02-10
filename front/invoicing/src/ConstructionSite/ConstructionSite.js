import React, { Component } from 'react';
import './ConstructionSite.css';
import {WorkingDayType, WorkingDay, ConstructionSite as ConstructionSiteObj, ConstructionsSite} from '../lib/ConstructionsSite';

function Info(props){
    const info = props.constructionSiteInfo;
  
    const onConstructionSiteChange = (e) => props.onConstructionSiteChange(e.target.name, e.target.value);
    const inputNumber = (name, value, text, colSpan) => {
      return (
        <th colSpan={colSpan}>
          <label forhtml={name}>{text}</label>
          <input type="number" name={name} step="any" defaultValue={value} onChange={onConstructionSiteChange}/>
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
          {inputNumber("hourPrice", info.hourPrice, "Prix horaire HT ", 5)}
        </tr>
        <tr>
          <th>
            <label forhtml="place">Lieu </label>
            <input type="text" name="place" defaultValue={info.place} onChange={onConstructionSiteChange} onBlur={onConstructionSiteChange}/>
          </th>
          {inputNumber("dayPrice", info.dayPrice, "Prix journalier HT ", 5)}
        </tr>
        <tr>
          <th></th>
          {inputNumber("taxPercent", info.taxPercent, "TVA (en %) ", 6)}
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
            <select name="type" defaultValue={WorkingDayType.toString(day.type)} onChange={onDayChange}>
                <option disabled value="">-- Type --</option>
                <option value="DAY">Jour complet</option>
                <option value="TRANSFER">Transfert</option>
                <option value="HOURS">Heures travaillé</option>
            </select>
            </p>
        </td>
        <td>
            <p>{day.type === WorkingDayType.HOURS ? inputNumber("hours") : null}</p>
        </td>
        <td>
            <p>{day.type === WorkingDayType.TRANSFER ? inputNumber("taxFreePrice") : day.taxFreePrice}</p>
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

function Days(props){
    const daysSorted = props.days.sort((d1, d2) => d1.date ? d1.date < d2.date : true);
    const days = daysSorted.map(d => <Day day={d} key={d.id} onDayChange={props.onDayChange} deleteDay={props.deleteDay}/>)

    const newDayNeed = (daysSorted) => {
        const len = daysSorted.length;
        const createDay = len === 0 || !daysSorted.find(d => !d.date);
        if (createDay){
            const day = WorkingDay.factory(props.days);
            return <Day day={day} key={day.id} onDayChange={props.onDayChange} deleteDay={props.deleteDay}/>;
        }
        return null;
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

export class ConstructionSite extends Component{
    constructor(props){
        super(props);

        this.state = {
            clients: ["Eurovia", "Gille", "Paul"],
            data: props.constructionSite
        };

        this.onDayChange = this.onDayChange.bind(this);
        this.deleteDay = this.deleteDay.bind(this);
        this.onConstructionSiteChange = this.onConstructionSiteChange.bind(this);
    }

    calculPrices(day, hours = null, type = null, transferPrice = null) {
        const data = this.state.data;
        const tax = data.taxPercent / 100;

        if (hours !== null) {
            return WorkingDay.updateHoursPrice(day, hours, data.hourPrice, tax);
        }
        if (type === WorkingDayType.TRANSFER || WorkingDayType[type] === WorkingDayType.TRANSFER) {
            const _transferPrice = () => typeof transferPrice === "string" ? parseFloat(transferPrice) : transferPrice * 1.0;
            return WorkingDay.updatePrice(day, transferPrice ? _transferPrice() : day.dayPrice, tax);
        }
        return WorkingDay.updatePrice(day, data.dayPrice, tax);
    }

    onDayChange(day, name, value) {
        const dayChangeOperations = [
            (day, name, value) => name === "date" ? new WorkingDay({...day, date: value}) : day,
            (day, name, value) => name === "hours" ? this.calculPrices(day, value) : day,
            (day, name, value) => name === "taxFreePrice" ? this.calculPrices(day, null, day.type, value) : day,
            (day, name, value) => name === "type" ? WorkingDay.updateType(day, value) : day
        ];
        const newWorkingDay = dayChangeOperations.reduce((d, fct) => fct(d, name, value), day);
        this.setState({
            data: this.state.data.deleteWorkingDay(day.id).addWorkingDay(newWorkingDay).computePrice()});
    }

    deleteDay(day) {
        const data = this.state.data;
        const workingDays = data.workingDays.filter(d => d.id !== day.id);
        const newData = {...data, workingDays: workingDays}
        this.setState({data: newData});
    }

    onConstructionSiteChange(name, value) {
        const data = this.state.data;

        if (name === 'client' || name === 'place') {
            const newData = name === 'place' ? data.updatePlace(value) : data.updateClient(value);
            this.setState({data: newData});
        }
        else {
            const _value = parseFloat(value);
            let newData = null;
            switch (name){
                case 'hourPrice':
                    newData = data.updateHourPrice(_value);
                    break;
                case 'dayPrice':
                    newData = data.updateDayPrice(_value);
                    break;
                case 'taxPercent':
                    newData = data.updateTaxPercent(_value);
                    break;
            }
            this.setState({data: newData.computePrice()});
        }
    }

    render() {
        return (
        <table className="Construction-Site">
            <Info
                clients={this.state.clients}
                constructionSiteInfo={this.state.data}
                onConstructionSiteChange={this.onConstructionSiteChange}
            />
            <Days
                days={this.state.data.workingDays}
                onDayChange={this.onDayChange}
                deleteDay={this.deleteDay}
            />
            <tfoot>
                <tr>
                    <td colSpan="6">
                        <button onClick={() => this.props.onUpdate(this.state.data)}>
                            Valider
                        </button>
                    </td>
                </tr>
                <tr>
                    <td colSpan="6">
                        <button
                            onClick={
                                () => window.confirm('Voulez-vous vraiment supprimer ce chantier ?') ? this.props.onDeleteConstructionSite(this.state.data.id) : null
                            }
                        >
                            Supprimer
                        </button>
                    </td>
                </tr>
            </tfoot>
        </table>
        );
    }
}
