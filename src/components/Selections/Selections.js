import './Selections.scss';
import React, { PropTypes } from 'react';

const Selections = props => {
    return (
        <div className='selectionsWrapper'>
            <p>
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

export default Selections;

