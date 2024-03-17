import React,
{
    useState,
    useEffect, useContext
}
    from 'react';

import './CarModal.scss';
import Card from "../UI/Card";
import iconClose from "../../assets/icons/icon-close.svg";
import LastFive from "../LastFive/LastFive";
import {generateFuelString} from "../../helpers/fuel-string-generator";
import AuthContext from "../../Store/auth-context";
import axios from "axios";

const CarModal = (props) => {
    const car = props.car;
    const ctx = useContext(AuthContext);

    const [lastFive, setLastFive] = useState([]);
    const [lastFiveSpent, setLastFiveSpent] = useState(0);


    useEffect(() => {
        const path = ctx.ajaxConfig.server + ctx.ajaxConfig.getCarExpenses.replace('%u', car.id);

        axios.post(
            path,
            {
                count: 5,
                orderBy: 'date',
                order: 'DESC',
                // from: `${currentYear}-01-01`, //TODO: uncomment when we have more recent data
                // to: currentDate.toISOString().split('T')[0],
                hash: ctx.ajaxConfig.hash
            },
        )
            .then((response) => {
                if (response.data.success) {
                    const data = response.data.data;
                    setLastFive(data);

                    let total = 0;
                    data.forEach((row) => {
                        total += row.value;
                    });
                    setLastFiveSpent(total);
                } else {
                    console.log(`Server response: [${response.data.message}]`);
                }
            })
            .catch((error) => {
                console.log('Error with execution', error);
            });
    }, []);


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
                    {generateFuelString(car.fuel)}
                </span>
                <span className='car-details__info-fuel'>
                    <strong>Spent over the last five expenses: </strong>
                    {lastFiveSpent}
                </span>
                <span className="car-details__info-notes">
                    {car.notes}
                </span>
            </article>
            <LastFive
                isSmall={true}
                lastFive={lastFive}
            />
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