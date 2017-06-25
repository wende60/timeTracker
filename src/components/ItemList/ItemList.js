import './ItemList.scss';
import React, { PropTypes } from 'react';

const ItemList = props => {
    return (
        <ul className='itemList'>
            { props.items.map((item, index) => {
                return (
                    <li key={index}>
                        <div>
                            <span data-item={item._id} onClick={props.selectClick}>{item.name}</span>
                        </div>
                        <div>
                            <span data-item={item._id} onClick={props.deleteClick} className='deleteButton'>-</span>
                        </div>
                    </li>
                )
            })}
        </ul>
    );
};

export default ItemList;