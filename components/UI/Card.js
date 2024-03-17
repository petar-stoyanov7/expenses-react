import React from 'react';
import './Card.scss';

const Card = (props) => {
    let className = `card ${props.customClass}`;
    className += props.isButton ? " is-button" : '';
    return (
        <div
            className={className}
            onClick={props.clickAction}
        >
            {props.children}
        </div>
    )
}

export default Card;