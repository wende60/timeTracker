import './ItemForm.scss';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LocalizationContext from '../../context/LocalizationContext';
import translate from '../../helper/translate.js';
import ItemList from '../ItemList/ItemList.js';

class ItemForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            displayInput: false
        }
    }

    getString(type) {
        const keys = {
            error: {
                customer: 'errorEntryCustomer',
                project: 'errorEntryProject'
            },
            button: {
                customer: 'addCustomer',
                project: 'addProject'
            },
            header: {
                customer: 'headerCustomer',
                project: 'headerProject'
            },
            placeholder: {
                customer: 'placeholderCustomer',
                project: 'placeholderProject'
            }
        }
        return translate(this.context, keys[type][this.props.mode]);
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
                    {this.getString('header')}
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
                            placeholder={this.getString('placeholder')}
                            ref="inputElement"
                            onFocus={this.resetError} />
                        <button>{this.getString('button')}</button>
                        {this.state.error &&
                            <p className='inputErrorMessage'>{this.getString('error')}</p>
                        }
                    </form>
                }
            </div>
        );
    }
};

ItemForm.contextType = LocalizationContext;

ItemForm.propTypes = {
    buttonClick: PropTypes.func.isRequired,
    selectClick: PropTypes.func.isRequired,
    deleteClick: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,
    items: PropTypes.array
};

export default ItemForm;

