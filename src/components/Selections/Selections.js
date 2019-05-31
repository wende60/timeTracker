import React from 'react';
import PropTypes from 'prop-types';
import './Selections.scss';

const Selections = props => {
    const customerClass = props.customerName ? 'isActive' : '';
    return (
        <div className='selectionsWrapper'>
            <p onClick={props.customerClick} className={customerClass}>
                <span>Kunde</span>
                <span>{props.customerName}</span>
            </p>
            <p>
                <span>Projekt</span>
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
