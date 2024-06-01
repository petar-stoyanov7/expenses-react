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

const firstOfJan = new Date();
firstOfJan.setMonth(0);
firstOfJan.setDate(1);

const FUEL_EXPENSE_ID = 1;

const Statistics = () => {
    const ctx = useContext(AuthContext);
    const ajx = ctx.ajaxConfig;

    const currentUser = ctx.userDetails.user;

    const [formIsValid, setFormIsValid] = useState({
        isValid: false,
        message: ''
    });

    const [selectedCar, setSelectedCar] = useState(null);
    const [dateFrom, setDateFrom] = useState(firstOfJan);
    const [dateTo, setDateTo] = useState(new Date());
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [selectedExpenses, setSelectedExpenses] = useState([]);
    const [possibleFuels, setPossibleFuels] = useState([]);
    const [selectedFuels, setSelectedFuels] = useState([]);


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

    /* form validation */
    useEffect(() => {
        const validity =
            null !== selectedCar &&
            selectedExpenses.length > 0;

        const formValid = {...formIsValid};
        //TODO: finish

    }, [selectedCar, dateFrom, dateTo, expenseTypes, selectedExpenses]);

    /* car change */
    useEffect(() => {
        if (!selectedCar) {
            return;
        }

        let fuelList = [];
        if ('all' === selectedCar) {
            currentUser.cars.forEach((car) => {
                fuelList = fuelList.concat(car.fuel);
            });
        } else {
            fuelList = fuelList.concat(selectedCar.fuel);
        }

        setSelectedFuels([]);
        setPossibleFuels(fuelList);

    }, [selectedCar])

    //---//

    const setCar = (car) => {
        if (!car.isActive && "all" !== car) {
            return;
        }

        setSelectedCar(car);
    }

    const setExpenses = (expenseId) => {
        const tempExpenses = [...selectedExpenses];
        if (tempExpenses.includes(expenseId)) {
            const i = tempExpenses.indexOf(expenseId);
            tempExpenses.splice(i, 1);
        } else {
            tempExpenses.push(expenseId);
        }
        setSelectedExpenses(tempExpenses);
    }

    const setFuel = (fuel) => {
        if ('all' === fuel) {
            setSelectedFuels(fuel);
            return;
        }

        const tempFuels = [...selectedFuels];
        if (tempFuels.includes(fuel)) {
            const i = tempFuels.indexOf(fuel);
            tempFuels.splice(i, 1);
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
    }

    const submitHandler = () => {
        //todo: FINISH!
        console.log('submitted');
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
                            selected={dateTo}
                            onChange={(date) => {
                                setDateTo(date)
                            }}
                        />
                    </div>
                </div>
                <ExpenseList
                    multiple={true}
                    expenseList={expenseTypes}
                    activeExpenses={selectedExpenses}
                    clickAction={setExpenses}
                    customClass="stat-form__expenses"
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
                        // disabled={!formIsValid.isValid}
                        disabled={true}
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
                {/*    Overall*/}
                {/*    Statistics */}
            </Container>
        </div>
    )
}

export default Statistics;