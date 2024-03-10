import React, {
    useContext,
    useEffect,
    useState,
    Fragment,
    Component
} from 'react';

import './LastFive.scss';
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import ExpenseTable from "../UI/ExpenseTable";
import {parseRawData} from "../../helpers/expense-parser";

const dummyData = [
    {
        id: 0,
        expense: 'fuel',
        expenseDetail: 'Gasoline',
        mileage: '114300',
        date: '2021.01.01',
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
        date: '2021.01.01',
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
        date: '2021.01.01',
        car: 'BMW 330i',
        price: 50,
        notes: 'Taxation is theft!'
    },
];

const LastFive = (props) => {
    const ctx = useContext(AuthContext);
    const [lastFive, setLastFive] = useState(dummyData);
    const refresh = props.refresh;

    useEffect(() => {
        console.log('here we go', props.lastFive);
        const lastFive = props.lastFive.map((row) => {
            console.log('r', row);
            const date = new Date(row.updatedAt.date);

            return {
                ...row,
                date: `${date.getFullYear()}.${date.getMonth()}.${date.getDay()}`
            }
        });

        setLastFive(lastFive);

    }, [ctx.userDetails, props.lastFive]);

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