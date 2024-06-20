import React from 'react';
import './Car.scss';
import Card from "../UI/Card";
import {generateFuelString} from "../../helpers/fuel-string-generator";
import iconClose from '../../assets/icons/icon-close.svg'


const Car = (props) => {
    const car = props.currentCar;
    const isDetailed = null != props.isDetailed ? props.isDetailed : false;
    const customClass = null != props.customClass ? props.customClass : '';

    if (props.allCars) {
        return (
            <Card
                customClass={`car-element ${customClass} ${!isDetailed && 'brief'}`}
                isButton={true}
                clickAction={props.clickAction}
            >
                <h3 className='car-element__title'>
                    All Cars
                </h3>
            </Card>

        );
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        props.deleteAction();
    }

    const fuelString = generateFuelString(car.fuel);

    return (
        <Card
            customClass={`car-element ${customClass} ${!isDetailed && 'brief'}`}
            isButton={true}
            clickAction={props.clickAction}
        >
            {props.showDeleteButton && (
              <button className="car-element__delete" onClick={handleDelete}>
                  <img src={iconClose} />
              </button>
            )}
            <h3 className='car-element__title'>
                {`${car.brand} ${car.model}`}
            </h3>
            <div className="car-element__container">
                <span className='car-element__fuel'>
                    <span className="car-element__name">Fuel: </span>
                    {fuelString}
                </span>
                {props.isDetailed && (
                    <span className='car-element__color'>
                        <span className="car-element__name">Color: </span>
                        {car.color}
                    </span>
                )}
                {props.isDetailed && (
                    <span className="car-element__notes">
                        <span className="car-element__name">Notes: </span>
                        {car.notes}
                    </span>
                )}
            </div>
        </Card>
    )
}

export default Car;