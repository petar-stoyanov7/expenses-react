import React from 'react';

import './CarModal.scss';
import Card from "../UI/Card";
import iconClose from "../../assets/icons/icon-close.svg";
import LastFive from "../LastFive/LastFive";

const CarModal = (props) => {
    const car = props.car;

    return (
        <Card customClass='car-details'>
            <button className='car-details__close icon-modal-close' onClick={props.onClose}>
                <img src={iconClose} className="icon-modal-close__icon" alt="close button"/>
            </button>
            <h2 className='car-details__name'>
                {`${car.brand} ${car.model}`}
            </h2>
            <article className="car-details__info">
                <span className="car-details__info-year">
                    <strong>Year: </strong>
                    {car.year}
                </span>
                <span className="car-details__info-mileage">
                    <strong>Mileage: </strong>
                    {car.mileage}
                </span>
                <span className='car-details__info-color'>
                    <strong>Color: </strong>
                    {car.color}
                </span>
                <span className='car-details__info-fuel'>
                    <strong>Fuel: </strong>
                    {`${car.mainFuel}${null !== car.secondaryFuel ? `/${car.secondaryFuel}` : ''}`}
                </span>
                <span className="car-details__info-notes">
                    {car.notes}
                </span>
            </article>
            <LastFive type='car' carId={car.id} isSmall={true}/>
            {props.showControls && (
                <div className="car-details__actions">
                    <button className="exp-button exp-button__new">
                        Edit
                    </button>
                    <button className="exp-button exp-button__danger">
                        Delete
                    </button>
                </div>
            )}
        </Card>
    );
}

export default CarModal;