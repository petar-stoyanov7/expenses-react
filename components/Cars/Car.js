import React from 'react';
import './Car.scss';
import Card from "../UI/Card";


const Car = (props) => {
    const car = props.currentCar;
    const isDetailed = null != props.isDetailed ? props.isDetailed : false;
    const customClass = null != props.customClass ? props.customClass : '';
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
                    {`${car.mainFuel}${null !== car.secondaryFuel ? `/${car.secondaryFuel}` : ''}`}
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