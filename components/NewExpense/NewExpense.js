import React, {
    Fragment,
    useContext,
    useEffect,
    useState
} from 'react';

import './NewExpense.scss';
import Container from "../UI/Container";
import CarList from "../Cars/CarList";
import Card from "../UI/Card";
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import DatePicker from "react-datepicker";

import "./default-datepicker.css";

const currentDate = new Date();

const NewExpense = () => {
    const ctx = useContext(AuthContext);
    const ajx = ctx.ajaxConfig;
    const fuelExpenseId = 1; //TODO: change if value changes in DB

    const currentUser = ctx.userDetails.user;

    const [selectedCar, setSelectedCar] = useState(null);
    const [expenseType, setExpenseType] = useState(null);
    const [mileage, setMileage] = useState('');
    const [date, setDate] = useState(currentDate);
    const [fuelType, setFuelType] = useState(null);
    const [liters, setLiters] = useState('');
    const [insuranceType, setInsuranceType] = useState(null);
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
    //lists
    const [expenseList, setExpenseList] = useState([]);
    const [fuelList, setFuelList] = useState([]);
    const [possibleFuels, setPossibleFuels] = useState([]);
    const [formIsValid, setFormIsValid] = useState({
        isValid: false,
        message: ''
    });
    const [isFormSubmit, setIsFormSubmit] = useState(true);

    /** generate lists of available expense and fuel types */
    useEffect(() => {
        axios.post(ajx.server+ajx.getFuels, {hash: ajx.hash})
            .then((response) => {
                if (response.data.success && response.data.data) {
                    setFuelList(response.data.data);
                }
            });
        axios.get(ajx.server+ajx.getExpenseTypes, {hash: ajx.hash})
            .then((response) => {
                if (response.data.success && response.data.data) {
                    setExpenseList(response.data.data);
                }
            });
    }, []);

    /** auto select first car if only one car is present */
    useEffect(() => {
        if (currentUser.cars && 1 === currentUser.cars.length) {
            setCar(currentUser.cars[0]);
        }
    }, [ctx]);

    /** validty */
    useEffect(() => {
        let validity =
            null !== selectedCar &&
            null !== expenseType &&
            '' !== mileage &&
            '' !== value;
        if (validity && expenseType === fuelExpenseId) {
            validity = null !== fuelType;
            validity = validity && '' !== liters;
        }
        if (validity && expenseType === '2') {
            validity = null !== insuranceType;
        }
        setFormIsValid(validity);
    }, [selectedCar, expenseType, fuelType, insuranceType, mileage, date, value, liters]);

    const setCar = (car) => {
        if (!car.isActive) {
            return;
        }
        setSelectedCar(car);
        setMileageValue(car.mileage);
        setExpenseType(null);
        setInsuranceType(null);
        setFuelType(null);
        setLiters('');

        const carFuelsList = car.fuel.map((fuel) => {
            return fuel.id;
        });

        setPossibleFuels(carFuelsList);
    }

    const setMileageValue = (val) => {
        setMileage(val);
    }

    const setExpense = (expenseId) => {
        setExpenseType(expenseId);
        setInsuranceType(null);
        setFuelType(null);
    }

    const setFuel = (fuelId) => {
        setFuelType(fuelId);
    }

    const resetForm = () => {
        setExpense(null);
        setSelectedCar(null);
        setFuelType(null);
        setInsuranceType(null);
        setMileageValue('');
        setDate(currentDate);
        setPossibleFuels([]);
        setValue('');
        setNotes('');
        setIsFormSubmit(true);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (formIsValid) {
            const expenseData = {
                hash: ajx.hash,
                userId: currentUser.id,
                carId: selectedCar.id,
                date: new Date(date).toISOString().split('T')[0],
                mileage: mileage,
                expenseId: expenseType,
                value: value,
                fuelId: fuelType,
                liters: liters,
                notes: notes
            }

            axios.post(ajx.server+ajx.addExpense, expenseData)
                .then((response) => {
                    const result = response.data;

                    if (result.success) {
                        const currentCar = selectedCar; //after resetting the form the state value is erased
                        resetForm();
                        /* update context to match new mileage */
                        if (mileage !== currentCar.mileage) {
                            const tempCurrentUser = {...currentUser};
                            const idx = currentUser.cars.findIndex((car) => {
                                return car.id === currentCar.id;
                            });
                            tempCurrentUser.cars[idx].mileage = mileage;
                            ctx.updateUserData(tempCurrentUser);
                        }

                        resetForm();
                    }
                    console.log("Expense submitted: ", response);
                })
                .catch((error) => {
                    console.log('Error with execution: ', error);
                });
        }
    }

    return (
        <Fragment>
            <Container customClass="new-expense">
                <h1 className="new-expense__title">
                    New Expense
                </h1>
                <div
                    className={`new-expense__form-errors`}
                    style={{display: formIsValid.isValid ? 'none' : 'block'}}
                >
                    <h3 className="new-expense__form-error">
                        {formIsValid.message}
                    </h3>
                </div>
                <hr />
                <div className="new-expense__cars">
                    <CarList
                        isDetailed={false}
                        hasModal={false}
                        clickAction={setCar}
                        selectedCar={null != selectedCar ? selectedCar.id : null}
                    />
                </div>
                <hr />
                <div className="new-expense__type item-list">
                    {expenseList.map((expense) => {
                        let customClass = `item-selector new-expense__type-${expense.name.toLowerCase()}`;
                        if (expense.id === expenseType) {
                            customClass += ' is-selected';
                        }
                        return (
                            <Card
                                key={expense.id}
                                isButton={true}
                                customClass={customClass}
                                clickAction={() => {setExpense(expense.id)}}
                            >
                                {expense.displayName ? expense.displayName : expense.name}
                            </Card>
                        )
                    })}
                </div>
                <hr />
                <div
                    className="new-expense__fuels item-list"
                    style={{display: expenseType === fuelExpenseId && null != selectedCar ? 'flex' : 'none'}}
                >
                    <div className="new-expense__fuels-liters">
                        <input
                            className="new-expense__inputs-liters new-expense__input"
                            type="number"
                            placeholder="Liters"
                            value={liters}
                            onChange={(e) => {
                                setLiters(e.target.value);
                            }}
                        />
                    </div>
                    <div className="new-expense__fuels-list">
                        {fuelList.map((fuel) => {
                            if (possibleFuels.includes(fuel.id)) {
                                let customClass = "item-selector";
                                customClass += fuel.id === fuelType ? ' is-selected' : '';
                                return (
                                    <Card
                                        customClass={customClass}
                                        key={fuel.id}
                                        clickAction={() => {
                                            setFuel(fuel.id)
                                        }}
                                    >
                                        {fuel.displayName}
                                    </Card>
                                );
                            }
                        })}
                    </div>

                </div>
                <div className="new-expense__inputs">
                    <input
                        className="new-expense__inputs-mileage new-expense__input"
                        type="number"
                        value={mileage}
                        placeholder="Mileage"
                        onChange={(e) => {
                            setMileageValue(e.target.value);
                        }}
                    />
                    <DatePicker
                        dateFormat="dd-MMM-YYYY"
                        className="new-expense__input new-expense__inputs-date"
                        selected={date}
                        onChange={(date) => {setDate(date)}}
                    />
                    <input
                        className="new-expense__inputs-value new-expense__input"
                        type="number"
                        value={value}
                        placeholder="Value"
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                    />
                    <textarea
                        placeholder="Additional info"
                        className="new-expense__input new-expense__inputs-notes"
                        onChange={(e) => {setNotes(e.target.value)}}
                        value={notes}
                    />
                </div>
                <div className="new-expense__actions">
                    <button
                        disabled={!formIsValid}
                        className={`exp-button exp-button__success ${formIsValid ? '' : 'disabled'} `}
                        type='submit'
                        onClick={submitHandler}
                    >
                        Submit
                    </button>
                    <button
                        type='button'
                        className="exp-button exp-button__danger"
                        value="Cancel"
                        onClick={resetForm}
                    >
                        Reset
                    </button>
                </div>
            </Container>
        </Fragment>

    );
}

export default NewExpense;