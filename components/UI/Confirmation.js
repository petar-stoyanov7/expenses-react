import React, {useContext, useEffect, useState} from 'react';

import ReactDOM from 'react-dom'
import Card from './Card'
const overlayContainer = document.getElementById('black-overlay-1');

import './Confirmation.scss';
import iconClose from '../../assets/icons/icon-close.svg'

const Confirmation = (props) => {
  let classString = 'confirmation-window';
  classString += props.customClass ? " " + props.customClass : '';
  const confirmColor = props.confirmColor ? props.confirmColor : 'green';
  const cancelColor = props.cancelColor ? props.cancelColor : 'red';

  const generateColorClass = (color) => {
    switch(color) {
      case 'blue':
        return "exp-button__new";
      case 'red':
        return "exp-button__danger";
      case 'green':
      default:
        return "exp-button__success";
    }
  }


  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <div className="site-overlay black-overlay-2" onClick={props.onCancel}></div>,
        overlayContainer
      )}
      <Card
        customClass={classString}
      >
        <button className="icon-modal-close" onClick={props.onCancel}>
          <img src={iconClose} className="icon-modal-close__icon" alt="close button"/>
        </button>
        <h2>{props.title ? props.title : "Are you sure?"}</h2>
        <span className={`confirmation-window__text ${props.textClass ? props.textClass : ''}`}>
          {props.text ? props.text : "Are you sure you want to proceed?"}
        </span>
        <div className={`confirmation-window__actions ${props.actionClass}`}>
          <button
            className={`exp-button ` + generateColorClass(confirmColor)}
            onClick={props.onConfirm}
          >
            {props.confirmText ? props.confirmText : 'Confirm'}
          </button>
          <button
            className={`exp-button ` + generateColorClass(cancelColor)}
            onClick={props.onCancel}
          >
            {props.cancelText ? props.cancelText : 'Cancel'}
          </button>
        </div>
      </Card>
    </React.Fragment>
  )
}

export default Confirmation;