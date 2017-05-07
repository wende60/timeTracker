import './ItemForm.scss';
import React, { PropTypes, Component } from 'react';
import ItemList from '../ItemList/ItemList.js';

class ItemForm extends Component {

    constructor(props) {
        super(props);
        this.state = {error: false}

        this.errorMessage = {
            customer: 'Bitte Kunden eintragen!',
            project: 'Bitte Projekt eintragen!'
        }

        this.buttonText = {
            customer: 'Neuen Kunden anlegen',
            project: 'Neues Projekt anlegen'
        }

        this.headerText = {
            customer: 'Bitte Kunden auswählen oder neu anlegen',
            project: 'Bitte Projekt auswählen oder neu anlegen'
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
        } else {
            this.setState({error: true})
        }
    }

    resetError = () => {
        this.setState({error: false})
    }

    render() {
        return (
            <div className='itemFormWrapper'>

                <h2>{this.headerText[this.props.mode]}</h2>

                {this.props.items &&
                    <ItemList
                        items={this.props.items}
                        selectClick={this.props.selectClick}
                        deleteClick={this.props.deleteClick} />
                }

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
            </div>
        );
    }
};

export default ItemForm;

