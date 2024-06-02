import React from 'react';
import './HeaderButton.scss';

const HeaderButton = (props) => {
    let className = "header-button";
    className += undefined !== props.customClass ? ` ${props.customClass}` : ''
    className += props.disabled ? " disabled" : '';

    return (
        <div
            className={className}
            onClick={props.clickAction}
        >
            <span className="header-button__description">
                {props.text}
            </span>
            <img
                className="header-button__image"
                src={props.imageUrl}
                alt={props.imageAlt}
            />
        </div>
    )
};

export default HeaderButton;