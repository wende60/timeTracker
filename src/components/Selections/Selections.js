import './Selections.scss';
import React from 'react';
import translate from '../../helper/translate.js';
import PropTypes from 'prop-types';

const Selections = props => {
    const customerClass = props.customerName ? 'isActive' : '';
    return (
        <div className='selectionsWrapper'>
            <p onClick={props.customerClick} className={customerClass}>
                <span>{translate(props.dict, 'customer')}</span>
                <span>{props.customerName}</span>
            </p>
            <p>
                <span>{translate(props.dict, 'project')}</span>
                <span>{props.projectName}</span>
            </p>
        </div>
    );
};

Selections.propTypes = {
    projectName: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    customerClick: PropTypes.func.isRequired
};

export default Selections;
