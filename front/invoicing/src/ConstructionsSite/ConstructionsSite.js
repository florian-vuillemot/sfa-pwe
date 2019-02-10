import React from 'react';
import './ConstructionsSite.css';
  
function GeneralInformation({nbDaysWork, nbTransfer, nbDaysWithHours, onNewConstructionSite}) {
    return (
      <thead>
        <tr>
          <th>Nombreux de jour complet: {nbDaysWork}</th>
          <th></th>
          <th rowSpan="3" colSpan="4">
            <button onClick={onNewConstructionSite}>
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
    const constructionsSiteSort = data.sort((cs1, cs2) => cs1.price < cs2.price);
    const constructionsSiteRender = constructionsSiteSort.map(d => {
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
        {constructionsSiteRender}
      </tbody>
    );
}
  
export function ConstructionsSite(props){
  const data = props.data;

  return (
    <table>
      <GeneralInformation
        onNewConstructionSite={props.onNewConstructionSite}
        nbDaysWork={data.nbDaysWorked}
        nbDaysWithHours={data.nbDaysWithHours}
        nbTransfer={data.nbTransfer}
      />
      <RenderAll
        data={data}
        onConstructionSiteSelect={props.onConstructionSiteSelect}
        />
    </table>
  );
}
