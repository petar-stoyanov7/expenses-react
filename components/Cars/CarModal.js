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

const API_URL = process.env.SERVER_URL;
const CAR_EXPENSES = process.env.GET_CAR_EXPENSES_PATH;
const HASH = process.env.HASH;

const CarModal = ({ car, onClose, showControls }) => {

    const [lastFive, setLastFive] = useState([]);
    const [lastFiveSpent, setLastFiveSpent] = useState(0);


    useEffect(() => {
        const path = API_URL + CAR_EXPENSES.replace('%u', car.id);

        axios.post(
            path,
            {
                count: 5,
                orderBy: 'date',
                order: 'DESC',
                // from: `${currentYear}-01-01`, //TODO: uncomment when we have more recent data
                // to: currentDate.toISOString().split('T')[0],
                hash: HASH
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
            <button className='car-details__close icon-modal-close' onClick={onClose}>
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
                <span className='car-details__info-spent'>
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
            {showControls && (
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