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
        expenseType: 'fuel',
        expenseDetail: 'Gasoline',
        mileage: '114300',
        date: '2021.01.01',
        carName: 'BMW 330i',
        liters: 8,
        price: 20,
        notes: 'theft'
    },
    {
        id: 1,
        expenseType: 'fuel',
        expenseDetail: 'LPG',
        mileage: '114500',
        date: '2021.01.01',
        carName: 'BMW 330i',
        liters: 33,
        price: 50,
        notes: 'crap gas station'
    },
    {
        id: 2,
        expenseType: 'insurance',
        expenseDetail: 'Kasko + GO',
        mileage: '115010',
        date: '2021.01.01',
        carName: 'BMW 330i',
        price: 50,
        notes: 'Taxation is theft!'
    },
];

const LastFive = (props) => {
    const ctx = useContext(AuthContext);
    const [lastFive, setLastFive] = useState(dummyData);
    const refresh = props.refresh;

    useEffect(() => {
        const ajaxCfg = ctx.ajaxConfig;
        if (refresh) {
            let data = {
                hash: ctx.ajaxConfig.hash
            }
            switch(props.type) {
                case 'car':
                    data['carId'] = props.carId;
                    break;
                case 'user':
                default:
                    data['userId'] = ctx.userDetails.user.id;
                    break;
            }
            if (undefined !== data['userId'] || undefined !== data['carId']) {
                axios.post(`${ajaxCfg.server}${ajaxCfg.getLastFive}`, data)
                    .then((response) => {
                        console.log('response');
                        const result = response.data
                        if (result.success) {
                            const formattedData = parseRawData(result.data);
                            setLastFive(formattedData);
                        } else {
                            setLastFive(dummyData);
                        }
                    });
            } else {
                setLastFive(dummyData);
            }
            props.clearRefresh(false);
        }
    }, [ctx.userDetails, refresh]);
    console.log('render');

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