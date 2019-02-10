import React from 'react';
import {Client as ClientObj} from '../Client/Client';
import './Client.css';

export function Client(props){
    return (
        <table className="Client-Information">
            <thead>
                <tr>
                    <td colSpan="2">
                        Informations client
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan="2">
                        <input type="text" name="name" placeholder="Nom"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="number" name="number" placeholder="Numéro"/>
                    </td>
                    <td>
                        <input type="text" name="street" placeholder="Rue"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="text" name="postalCode" placeholder="Code postal"/>
                    </td>
                    <td>
                        <input type="text" name="city" placeholder="Ville"/>
                    </td>
                </tr>
                <tr>
                    <td colSpan="2">
                        <input type="text" name="additionalAddressDetails" placeholder="Complément d'adresse"/>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}