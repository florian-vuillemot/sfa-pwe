import React, { Component } from 'react';

class Calendar extends Component {
    constructor(props){
        super(props);

        const today = new Date();
        this.state = {
            year: today.getFullYear(),
            month: this.months()[today.getMonth()]
        };

        this.handleClick = this.handleClick.bind(this);
    }
    
    render(){
        return (
            <div className="App">
                <div className="App-header">
                    <table>
                        <tbody>
                            <tr>
                                <th>Année</th>
                                <th>Mois</th>
                            </tr>
                            <tr>
                                <td>
                                    <input
                                        name="year"
                                        list="years"
                                        defaultValue={this.state.year}
                                        onChange={(e) => this.setState({'year': e.target.value})}
                                    />
                                </td>
                                <td>
                                    <input
                                        name="month"
                                        list="months"
                                        defaultValue={this.state.month}
                                        onChange={(e) => this.setState({'month': e.target.value})}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <button
                                        type="button"
                                        onClick={this.handleClick}
                                    >
                                        Valider
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <datalist id="years">
                    {this.getYears().map(i => <option value={i} key={i}/>)}
                </datalist>
                <datalist id="months">
                    {this.months().map(m => <option value={m} key={m}/>)}
                </datalist>
            </div>
        );
    }

    months = () => ['Janvier', 'Février', 'Mars', 'Avril', 'Mais', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

    handleClick() {
        const year = parseInt(this.state.year);
        const monthExist = this.months().find(m => m === this.state.month);
        
        if (2010 <= year && year < 2100 && monthExist){
            this.props.onClick(this.state.year, this.state.month);
        }
        else {
            alert('Date incorrect')
        }
    }

    getYears = () => [...Array(100)].map((_, i) => i).reduce((acc, i) => i > 9 ? [...acc, `20${i}`] : acc, []);
}


export default Calendar;