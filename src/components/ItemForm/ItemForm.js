import './ItemForm.scss';
import React, { PropTypes, Component } from 'react';
import ItemList from '../ItemList/ItemList.js';

class ItemForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            displayInput: false
        }

        this.errorMessage = {
            customer: 'Bitte Kunden eintragen!',
            project: 'Bitte Projekt eintragen!'
        }

        this.buttonText = {
            customer: 'Kunde anlegen',
            project: 'Projekt anlegen'
        }

        this.headerText = {
            customer: 'Bitte Kunden wählen',
            project: 'Bitte Projekt wählen'
        }

        this.placeholderText = {
            customer: 'Kunde',
            project: 'Projekt'
        }
    }

    componentWillMount() {
        this.setState(this.state);
    }

    sender = e => {
        e.preventDefault();
        const str = this.refs.inputElement.value;
        if (str) {
            this.props.buttonClick(str);
            this.refs.inputElement.value = '';
            this.setState({displayInput: false})
        } else {
            this.setState({error: true})
        }
    }

    displayInput = () => {
        this.setState({displayInput: true})
    }

    resetError = () => {
        this.setState({error: false})
    }

    render() {
        return (
            <div className='itemFormWrapper'>

                <h2>
                    {this.headerText[this.props.mode]}
                    <span onClick={this.displayInput} className='addButton'>+</span>
                </h2>

                {this.props.items &&
                    <ItemList
                        items={this.props.items}
                        selectClick={this.props.selectClick}
                        deleteClick={this.props.deleteClick} />
                }

                {this.state.displayInput &&
                    <form onSubmit={this.sender}>
                        <input
                            type="text"
                            placeholder={this.placeholderText[this.props.mode]}
                            ref="inputElement"
                            onFocus={this.resetError} />
                        <button>{this.buttonText[this.props.mode]}</button>
                        {this.state.error &&
                            <p className='inputErrorMessage'>{this.errorMessage[this.props.mode]}</p>
                        }
                    </form>
                }
            </div>
        );
    }
};

export default ItemForm;

