import React, { Component } from 'react';
import './selectionAccountingInvoicing.css';

function Button(props){
    return (
        <button className={props.className}
            onMouseOver={props.overCb}
            onMouseOut={props.overCb}
            onClick={props.onClick}
        >
            {props.title}
        </button>
    )
}

class SelectionAccountingInvoicing extends Component {
    constructor(props){
        super(props);

        this.state = {
            invoicingStyle: false,
            accountingStyle: false
        };
    }

    hover(element){
        this.setState({[element]: !this.state[element]});
    }

    getWidth(element, min = false){
        if (min){
            return this.state[element] ? 'normalWidth' : 'smallWidth';
        }
        return this.state[element] ? 'largeWidth' : 'normalWidth';
    }

    render(){
        return (
            <table>
                <tbody>
                    <tr>
                        <td>
                            <Button
                                className={`buttonStyle invoicingStyle ${this.getWidth('invoicingStyle')}`}
                                overCb={() => this.hover('invoicingStyle')}
                                onClick={() => this.props.isInvoicing()}
                                title="Facture"
                            />
                        </td>
                        <td>
                            <Button
                                className={`buttonStyle accountingStyle ${this.getWidth('accountingStyle')}`}
                                overCb={() => this.hover('accountingStyle')}
                                onClick={() => this.props.isAccounting()}
                                title="Comptabilité"
                            />
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan="2">
                            <Button
                                className={`buttonStyle backStyle ${this.getWidth('backStyle', true)}`}
                                overCb={() => this.hover('backStyle')}
                                onClick={() => this.props.back()}
                                title="Revenir"
                            />
                        </td>
                    </tr>
                </tfoot>
            </table>
        );
    }
}

export default SelectionAccountingInvoicing;