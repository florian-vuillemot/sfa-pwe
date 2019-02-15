import React, { Component } from 'react';
import './ConstructionSite.css';
import {WorkingDayType, WorkingDay} from '../lib/ConstructionsSite';
import {Client} from '../Client/Client';

function Info(props){
    const info = props.constructionSiteInfo;
  
    const onConstructionSiteChange = (e) => props.onConstructionSiteChange(e.target.name, e.target.value);
    const onClientBlur = (e) => {
        if (props.clients.find(e.target.value) === undefined){
            props.createClient()
        }
        else {
            props.onConstructionSiteChange(e.target.name, e.target.value);
        }
    };
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
            <input name="client" list="clients" defaultValue={info.client} onChange={onConstructionSiteChange} onBlur={onClientBlur}/>
            <datalist id="clients">{props.clients.clientsName.map(c => <option value={c} key={c}/>)}</datalist>
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
        const createDay = daysSorted.length === 0 || !daysSorted.find(d => !d.date);
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

function ValidateOrDelete(props){
    const onValidate = () => {
        if (props.clients.clientsName.includes(props.client)){
            props.onValidate();
        }
        else {
            alert('Impossible de valider le chantier sans les informations sur le client');
        }

    }
    return (
        <tfoot>
            <tr>
                <td colSpan="6">
                    <button onClick={onValidate}>
                        Valider
                    </button>
                </td>
            </tr>
            <tr>
                <td colSpan="6">
                    <button
                        onClick={
                            () => window.confirm('Voulez-vous vraiment supprimer ce chantier ?') ? props.onDelete() : null
                        }
                    >
                        Supprimer
                    </button>
                </td>
            </tr>
        </tfoot>
    );
}

export class ConstructionSite extends Component{
    constructor(props){
        super(props);

        this.state = {
            clients: props.clients,
            data: props.constructionSite,
            createClient: false
        };

        this.onDayChange = this.onDayChange.bind(this);
        this.deleteDay = this.deleteDay.bind(this);
        this.onConstructionSiteChange = this.onConstructionSiteChange.bind(this);
        this.createClient = this.createClient.bind(this);
        this.createNewClient = this.createNewClient.bind(this);
        this.cancelNewClient = this.cancelNewClient.bind(this);
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

    deleteDay = (day) => this.setState({data: this.state.data.deleteWorkingDay(day.id)});

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
                default:
                    throw Error('Bad construction site type');
            }
            this.setState({data: newData.computePrice()});
        }
    }
    
    createClient(){
        this.setState({
            createClient: true
        });
    }
    createNewClient(client){
        this.setState({
            clients: this.state.clients.add(client),
            data: this.state.data.updateClient(client.name),
            createClient: false
        }, () => this.props.onUpdateClients(this.state.clients));
        
    }
    cancelNewClient() {
        this.setState({
            createClient: false
        });
    }

    render() {
        if (this.state.createClient){
            return (
                <Client 
                    onCancel={this.cancelNewClient}
                    onCreateClient={this.createNewClient}
                    name={this.state.data.constructionSiteInfo.client}
                />
            );
        }
        return (
            <table className="Construction-Site">
                <Info
                    clients={this.state.clients}
                    constructionSiteInfo={this.state.data}
                    onConstructionSiteChange={this.onConstructionSiteChange}
                    onClientUpdate={this.props.onClientUpdate}
                    createClient={this.createClient}
                />
                <Days
                    days={this.state.data.workingDays}
                    onDayChange={this.onDayChange}
                    deleteDay={this.deleteDay}
                />
                <ValidateOrDelete
                    client={this.state.data.client}
                    clients={this.state.clients}
                    onValidate={() => this.props.onUpdate(this.state.data)}
                    onDelete={() => this.props.onDeleteConstructionSite(this.state.data.id)}
                />
            </table>
        );
    }
}
