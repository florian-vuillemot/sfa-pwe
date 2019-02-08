import React, { Component } from 'react';
import './ConstructionsSite.css';
  
function GeneralInformation({nbDaysWork, nbTransfer, nbDaysWithHours, onNewWorkDay}) {
    return (
      <thead>
        <tr>
          <th>Nombreux de jour complet: {nbDaysWork}</th>
          <th></th>
          <th rowSpan="3" colSpan="4">
            <button onClick={onNewWorkDay}>
              Ajouter un chantier
            </button>
          </th>
        </tr>
        <tr>
          <th>Nombreux de transfert: {nbTransfer}</th>
          <th></th>
        </tr>
        <tr>
          <th>Nombreux de jour partiel: {nbDaysWithHours}</th>
          <th></th>
        </tr>
      </thead>
    );
}
  
function RenderAll({data, onConstructionSiteSelect}) {
    const constructionsSite = data.map(d => {
      return (
        <tr key={d.id} onClick={() => onConstructionSiteSelect(d)}>
          <td>{d.client}</td>
          <td>{d.place}</td>
          <td>{d.transfers.length}</td>
          <td>{d.days.length}</td>
          <td>{d.hours.length}</td>
          <td>{d.price}</td>
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
  
export class ConstructionsSite extends Component {
    constructor(props){
      super(props);
    }
  
    render() {
      const data = this.props.data;
  
      return (
        <table>
          <GeneralInformation
            onNewWorkDay={this.props.onNewWorkDay}
            nbDaysWork={data.nbDaysWorked}
            nbDaysWithHours={data.nbDaysWithHours}
            nbTransfer={data.nbTransfer}
          />
          <RenderAll
            data={data}
            onConstructionSiteSelect={this.props.onConstructionSiteSelect}
           />
        </table>
      );
    }
}
