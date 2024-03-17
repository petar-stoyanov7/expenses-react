import React from 'react';
import './Car.scss';
import Card from "../UI/Card";
import {generateFuelString} from "../../helpers/fuel-string-generator";


const Car = (props) => {
    const car = props.currentCar;
    const isDetailed = null != props.isDetailed ? props.isDetailed : false;
    const customClass = null != props.customClass ? props.customClass : '';
    const fuelString = generateFuelString(car.fuel);

    return (
        <Card
            customClass={`car-element ${customClass} ${!isDetailed && 'brief'}`}
            isButton={true}
            clickAction={props.clickAction}
        >
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