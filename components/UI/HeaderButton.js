import React from 'react';
import './HeaderButton.scss';

const HeaderButton = (props) => {
    return (
        <div
            className={`header-button ${undefined !== props.customClass ? props.customClass : ''}`}
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