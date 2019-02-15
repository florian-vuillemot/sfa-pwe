import React, {Component} from 'react';
import {Client as ClientObj} from '../lib/Client';
import './Client.css';

export class Client extends Component {
    constructor(props){
        super(props);

        const name = props.name ? props.name : undefined;
        this.state = {
            client: props.client ? props.client : new ClientObj({id: -1, name: name})
        }
    }

    updateClient(field, value) {
        this.setState({
            client: this.state.client.update(field, value)
        });
    }

    render() {
        const onChange = (e) => this.updateClient(e.target.name, e.target.value);

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
                            <input
                                type="text" name="name"
                                defaultValue={this.state.client.name}
                                placeholder="Nom" onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="number" name="number"
                                defaultValue={this.state.client.number}
                                placeholder="Numéro" onChange={onChange}/>
                        </td>
                        <td>
                            <input
                                type="text" name="street"
                                defaultValue={this.state.client.street}
                                placeholder="Rue" onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="text" name="postalCode"
                                defaultValue={this.state.client.postalCode}
                                placeholder="Code postal" onChange={onChange}/>
                        </td>
                        <td>
                            <input
                                type="text" name="city"
                                defaultValue={this.state.client.city}
                                placeholder="Ville" onChange={onChange}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <input
                                type="text" name="additionalAddressDetails"
                                defaultValue={this.state.client.additionalAddressDetails}
                                placeholder="Complément d'adresse" onChange={onChange}/>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td><button onClick={this.props.onCancel}>Annuler</button></td>
                        <td><button onClick={() => this.props.onCreateClient(this.state.client)}>Valider</button></td>
                    </tr>
                </tfoot>
            </table>
        );
    }
}