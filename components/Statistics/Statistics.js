import React, {
    Fragment,
    useContext,
    useEffect,
    useState
} from 'react';
import './Statistics.scss';
import Container from "../UI/Container";
import AuthContext from "../../Store/auth-context";


import "../../assets/css/default-datepicker.css";
import CarList from "../Cars/CarList";
import DatePicker from "react-datepicker";
import ExpenseList from "../Expenses/ExpenseList";
import axios from "axios";
import FuelList from "../Cars/FuelList";
import ExpenseTable from "../Expenses/ExpenseTable";

import {removeArrayElement} from "../../helpers/general";
import Overall from '../Expenses/Overall'

const firstOfJan = new Date();
firstOfJan.setMonth(0);
firstOfJan.setDate(1);

const FUEL_EXPENSE_ID = 1;

const Statistics = () => {
    const ctx = useContext(AuthContext);
    const ajx = ctx.ajaxConfig;

    const currentUser = ctx.userDetails.user;

    const [formIsValid, setFormIsValid] = useState(false);

    const [dateFrom, setDateFrom] = useState(firstOfJan);
    const [dateTo, setDateTo] = useState(new Date());
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [possibleFuels, setPossibleFuels] = useState([]);
    const [selectedCar, setSelectedCar] = useState("all");
    const [selectedExpenses, setSelectedExpenses] = useState("all");
    const [selectedFuels, setSelectedFuels] = useState([]);

    const [expenseList, setExpenseList] = useState([]);
    const [overall, setOverall] = useState({});

    //---//

    /* startup */
    useEffect(() => {
        axios.get(ajx.server+ajx.getExpenseTypes, {hash: ajx.hash})
            .then((response) => {
                if (response.data.success && response.data.data) {
                    setExpenseTypes(response.data.data);
                }
            })
            .catch((e) => {
                console.log("Error with getting expense list: ", e);
            });
    }, []);

    /* car change */
    useEffect(() => {
        if (!selectedCar) {
            return;
        }

        let fuelList = [];
        let selectedFuels = [];
        if ('all' === selectedCar) {
            currentUser.cars.forEach((car) => {
                fuelList = fuelList.concat(car.fuel);
            });
        } else {
            fuelList = fuelList.concat(selectedCar.fuel);
            // when we have one fuel type - we don't display fuel types menu and we auto select "all"
            selectedFuels = selectedCar.fuel.length < 2 ? ['all'] : [];
        }

        setPossibleFuels(fuelList);
        setSelectedFuels(selectedFuels);

    }, [selectedCar]);

    /* expense change */
    useEffect(() => {
        if (!selectedExpenses.includes(FUEL_EXPENSE_ID)) {
            setSelectedFuels([]);
        }

        if (selectedExpenses.length === expenseTypes.length) {
            setSelectedExpenses(['all']);
        }
    }, [selectedExpenses]);

    /* form validation */
    useEffect(() => {
        let validity =
            null !== selectedCar &&
            selectedExpenses.length > 0 &&
            dateFrom < dateTo;

        if (selectedExpenses.includes(FUEL_EXPENSE_ID)) {
            validity = validity && selectedFuels.length > 0;
        }

        setFormIsValid(validity);
    }, [selectedCar, dateFrom, dateTo, expenseTypes, selectedExpenses, selectedFuels]);

    /* expenses list change */
    useEffect(() => {
        if (!expenseList.length) {
            return null;
        }

        let overallData = {};
        let overall = 0;
        let liters = 0;
        let minMileage = 999999999;
        let maxMileage = 0;
        expenseList.map((expense) => {
            overall += expense.value;
            if ('all' !== selectedCar && selectedCar.id) {
                minMileage = expense.mileage < minMileage ? expense.mileage : minMileage;
                maxMileage = expense.mileage > maxMileage ? expense.mileage : maxMileage;
            }
            if (selectedFuels.length === 1) {
                liters += expense.liters;
            }
        });
        overallData.overall = overall;
        if (maxMileage !== 0 && minMileage !== 999999999) {
            overallData.mileage = maxMileage - minMileage;
        }
        if (liters) {
            overallData.liters = liters;
        }
        if (overallData.mileage) {
            overallData.rate = (overallData.overall / overallData.mileage).toFixed(2);
        }

        setOverall(overallData);
    }, [expenseList]);

    //---//

    const setCar = (car) => {
        if (!car.isActive && "all" !== car) {
            return;
        }

        setSelectedCar(car);
    }

    const setExpenses = (expenseId) => {
        if ('all' === expenseId) {
            setSelectedExpenses('all');
            return;
        }

        let tempExpenses = "all" === selectedExpenses
            ? []
            : [...selectedExpenses];

        if (tempExpenses.includes(expenseId)) {
            tempExpenses = removeArrayElement(tempExpenses, expenseId);
        } else {
            tempExpenses.push(expenseId);
        }

        setSelectedExpenses(tempExpenses);
    }

    const setFuel = (fuel) => {
        if ('all' === fuel) {
            setSelectedFuels([fuel]);
            return;
        }

        let tempFuels = [...selectedFuels];
        if (tempFuels.includes("all")) {
            tempFuels = removeArrayElement(tempFuels, "all");
        }

        if (tempFuels.includes(fuel)) {
            tempFuels = removeArrayElement(tempFuels, fuel);
        } else {
            tempFuels.push(fuel);
        }

        setSelectedFuels(tempFuels);
    }

    const resetForm = () => {
        setSelectedCar(null);
        setDateFrom(firstOfJan);
        setDateTo(new Date());
        setSelectedExpenses([]);
        setPossibleFuels([]);
        setSelectedFuels([])
        setExpenseList([]);
        setOverall({});
    }

    const submitHandler = () => {
        const expenseData = {
            from: dateFrom.toISOString().split('T')[0],
            to: dateTo.toISOString().split('T')[0],
        };
        if ('all' !== selectedCar) {
            expenseData['car'] = selectedCar.id;
        }
        if ('all' !== selectedExpenses) {
            expenseData['expenses'] = selectedExpenses;
        }
        if (!selectedFuels.includes('all') && selectedFuels.length > 0) {
            expenseData['fuels'] = selectedFuels;
        }

        const path = ctx.ajaxConfig.server + ctx.ajaxConfig.getUserExpenses.replace('%u', currentUser.id);

        axios.post(
            path,
            expenseData
        ).then((response) => {
            if (!response.data || !response.data.success) {
                console.log('Error with execution!');
                return;
            }

            setExpenseList(response.data.data);
        }).catch((e) => {
            console.log('Error with execution: ', e);
        })

    }


    return (
        <div className="statistics">
            <Container customClass="full-width stat-form">
                <h1>Statistics</h1>
                <div
                    className="stat-form__errors"
                    style={{display: formIsValid.isValid ? 'none' : 'block'}}
                >
                    <h3>
                        {formIsValid.message}
                    </h3>
                </div>
                <CarList
                    customClass="stat-form__cars"
                    isDetailed={false}
                    clickAction={setCar}
                    allCars={true}
                    selectedCar={selectedCar}
                />
                <div className="stat-form__dates">
                    <div className="stat-form__date">
                        <h4>From</h4>
                        <DatePicker
                            dateFormat="dd-MMM-YYYY"
                            className="new-expense__input new-expense__inputs-date"
                            showYearDropdown={true}
                            selected={dateFrom}
                            onChange={(date) => {
                                setDateFrom(date)
                            }}
                        />
                    </div>
                    <div className="stat-form__date">
                        <h4>To</h4>
                        <DatePicker
                            dateFormat="dd-MMM-YYYY"
                            className="new-expense__input new-expense__inputs-date"
                            showYearDropdown={true}
                            selected={dateTo}
                            onChange={(date) => {
                                setDateTo(date)
                            }}
                        />
                    </div>
                </div>
                <ExpenseList
                    showAll={true}
                    multiple={true}
                    expenseList={expenseTypes}
                    activeExpenses={selectedExpenses}
                    clickAction={setExpenses}
                    customClass="stat-form__expenses"
                    elementClass="expense"
                />
                {(selectedExpenses.includes(FUEL_EXPENSE_ID) && possibleFuels.length > 1) && (
                    <FuelList
                        multiple={true}
                        showAll={true}
                        fuelList={possibleFuels}
                        selectedFuels={selectedFuels}
                        customClass="new-expense__fuels-list"
                        elementClass="item-selector"
                        clickAction={setFuel}
                    />
                )}
                <div className="stat-form__actions">
                    <button
                        disabled={!formIsValid}
                        className={`exp-button exp-button__success`}
                        type='submit'
                        onClick={submitHandler}
                    >
                        Submit
                    </button>
                    <button
                        type='button'
                        className="exp-button exp-button__danger"
                        value="Reset"
                        onClick={resetForm}
                    >
                        Reset
                    </button>
                </div>

            </Container>
            <Container customClass="full-width">
                <h3>Statistics</h3>
                {expenseList.length !== 0 && (
                  <>
                      <Overall data={overall} />
                      <ExpenseTable
                        expenses={expenseList}
                        isSmall={false}
                        isDetailed={true}
                      />
                  </>
                )}
            </Container>
        </div>
    )
}

export default Statistics;