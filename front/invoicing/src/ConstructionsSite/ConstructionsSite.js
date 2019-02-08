import React, { Component } from 'react';
import './ConstructionsSite.css';
  
function GeneralInformation({nbDayWork, nbTransfer, nbDayWithHours, onNewWorkDay}) {
    return (
      <thead>
        <tr>
          <th>Nombreux de jour complet: {nbDayWork}</th>
          <th className="To-Right"></th>
          <th rowSpan="3" colSpan="4">
            <button className="buttonStyle normalWidth" onClick={onNewWorkDay}>
              Ajouter un chantier
            </button>
          </th>
        </tr>
        <tr>
          <th>Nombreux de transfert: {nbTransfer}</th>
          <th></th>
        </tr>
        <tr>
          <th>Nombreux de jour partiel: {nbDayWithHours}</th>
          <th></th>
        </tr>
      </thead>
    );
}
  
function RenderAll({data, onConstructionSiteSelect}) {
    const count = (d, key) => d.workingDays.reduce((acc, d) => d[key] + acc, 0);
    const countType = (d, type) => d.workingDays.reduce((acc, d) => (d.type === type) + acc, 0);
    const daysSorted = data.sort((d1, d2) => d1.price > d2.price);
    const constructionsSite = daysSorted.map((d, idx) => {
      return (
        <tr key={idx} onClick={() => onConstructionSiteSelect(d)}>
          <td>{d.constructionSiteInfo.client}</td>
          <td>{d.constructionSiteInfo.place}</td>
          <td>{countType(d, "TRANSFER")}</td>
          <td>{countType(d, "DAY")}</td>
          <td>{countType(d, "HOURS")}</td>
          <td>{count(d, "price")}</td>
        </tr>
      );
    });
  
    return (
      <tbody>
        <tr>
          <th>Client</th>
          <th>Lieu</th>
          <th>Transfert</th>
          <th>Jour complet</th>
          <th>Jour partiel</th>
          <th>Prix TTC</th>
        </tr>
        {constructionsSite}
      </tbody>
    );
}
  
class ConstructionsSite extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        data: props.data,
      };
    }
  
    nbDay = (days, key) => days.reduce((acc, d) => acc + (d.type === key), 0);
  
    render() {
      const days = this.state.data.reduce((acc, d) => [...acc, ...d.workingDays], [])
  
      return (
        <table className="General-info">
          <GeneralInformation
            onNewWorkDay={this.props.onNewWorkDay}
            nbDayWork={this.nbDay(days, "DAY")}
            nbDayWithHours={this.nbDay(days, "HOURS")}
            nbTransfer={this.nbDay(days, "TRANSFER")}
          />
          <RenderAll
            data={this.state.data}
            onConstructionSiteSelect={this.props.onConstructionSiteSelect}
           />
        </table>
      );
    }
}

export default ConstructionsSite;