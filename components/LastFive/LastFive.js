import React, {
    Fragment,
} from 'react';

import './LastFive.scss';
import ExpenseTable from "../UI/ExpenseTable";

const dummyData = [
    {
        id: 0,
        expense: 'fuel',
        expenseDetail: 'Gasoline',
        mileage: '114300',
        updatedAt: {
            date: '2021-01-01 00:00:00.000000',
            timezone: 'Europe/Helsinki',
            timezone_type: 3
        },
        car: 'BMW 330i',
        liters: 8,
        price: 20,
        notes: 'theft'
    },
    {
        id: 1,
        expense: 'fuel',
        expenseDetail: 'LPG',
        mileage: '114500',
        updatedAt: {
            date: '2021-01-01 00:00:00.00000',
            timezone: 'Europe/Helsinki',
            timezone_type: 3
        },
        car: 'BMW 330i',
        liters: 33,
        price: 50,
        notes: 'crap gas station'
    },
    {
        id: 2,
        expense: 'insurance',
        expenseDetail: 'Kasko + GO',
        mileage: '115010',
        updatedAt: {
            date: '2021-01-01 00:00:00.00000',
            timezone: 'Europe/Helsinki',
            timezone_type: 3
        },
        car: 'BMW 330i',
        price: 50,
        notes: 'Taxation is theft!'
    },
];

const LastFive = (props) => {
    const lastFive = props.lastFive ? props.lastFive : dummyData;

    return (
        <Fragment>
            <h3>Last five:</h3>
            <ExpenseTable
                expenses={lastFive}
                isSmall={props.isSmall}
                isDetailed={props.isDetailed}
            />
        </Fragment>
    );
}

export default LastFive;