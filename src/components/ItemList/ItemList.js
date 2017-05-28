import './ItemList.scss';
import React, { PropTypes } from 'react';

const ItemList = props => {
    return (
        <ul className='itemList'>
            { props.items.map((item, index) => {
                return (
                    <li key={index}>
                        <span data-item={item._id} onClick={props.selectClick}>{item.name}</span>
                        <span data-item={item._id} onClick={props.deleteClick}>Löschen</span>
                    </li>
                )
            })}
        </ul>
    );
};

export default ItemList;