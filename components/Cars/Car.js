import React from 'react';
import './Car.scss';
import Card from "../UI/Card";


const Car = (props) => {
    const car = props.currentCar;
    const isDetailed = null != props.isDetailed ? props.isDetailed : false;
    const customClass = null != props.customClass ? props.customClass : '';
    let fuelString = "";

    car.fuel.forEach((fuel,i) => {
        console.log('f', fuel);
        console.log('i', i);
        fuelString += fuel.displayName ? fuel.displayName : fuel.name;
        if (i < (car.fuel.length - 1)) {
            fuelString += ' / ';
        }
    });
    console.log('f', fuelString);

    return (
        <Card
            customClass={`car-element ${customClass} ${!isDetailed && 'brief'}`}
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