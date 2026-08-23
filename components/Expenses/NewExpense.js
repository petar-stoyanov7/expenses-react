import React, {
    Fragment,
    useContext,
    useEffect,
    useState
} from 'react';

import './NewExpense.scss';
import Container from "../UI/Container";
import CarList from "../Cars/CarList";
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import DatePicker from "react-datepicker";

import "../../assets/css/default-datepicker.css";
import ExpenseList from "./ExpenseList";
import FuelList from "../Cars/FuelList";
import FileUpload from "../File/FileUpload";

const FUEL_EXPENSE_ID = 1; //TODO: change if value changes in DB

const currentDate = new Date();

const API_URL = process.env.SERVER_URL;
const GET_FUEL_TYPES = process.env.GET_FUELS_PATH;
const GET_EXPENSE_TYPES = process.env.GET_EXPENSE_TYPES_PATH;
const ADD_EXPENSE = process.env.ADD_EXPENSE_PATH;
const EDIT_EXPENSE = process.env.EDIT_EXPENSE_PATH;
const IMPORT_EXPENSES = process.env.IMPORT_EXPENSES_PATH;
const HASH = process.env.HASH;

const NewExpense = ({expense, onSubmit}) => {
    const ctx = useContext(AuthContext);

    const currentUser = ctx.userDetails.user;

    const [expenseId, setExpenseId] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [expenseType, setExpenseType] = useState(null);
    const [mileage, setMileage] = useState('');
    const [date, setDate] = useState(currentDate);
    const [fuelType, setFuelType] = useState(null);
    const [quantity, setQuantity] = useState('');
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
        getFuelTypes();
        getExpenseTypes();

        /*
        very ugly hack to make sure the expenses are populated when the component and its children are ready :X
        todo: fix please!
        */
        setTimeout(() => {
            if (expense) {
                let currentCar = {};
                ctx.userDetails.user.cars.forEach((car) => {
                    if (car.id === expense.carId) {
                        currentCar = car;
                    }
                });
                setExpenseId(expense.id);
                setCar(currentCar);
                setExpenseType(expense.expenseId);
                setDate(new Date(expense.updatedAt.date));
                setValue(expense.value);
                setNotes(expense.notes);
                if (expense.expenseId === FUEL_EXPENSE_ID && null !== expense.fuelTypeId) {
                    setFuel(expense.fuelTypeId);
                    setQuantity(expense.quantity);
                }
            }
        }, 300);

    }, []);

    useEffect(() => {

    }, []);

    /** auto select first car if only one car is present */
    useEffect(() => {
        if (!expense && currentUser.cars && 1 === currentUser.cars.length) {
            setCar(currentUser.cars[0]);
        }
    }, [ctx]);

    /** validity, fuel */
    useEffect(() => {
        if (expenseType !== FUEL_EXPENSE_ID) {
            setQuantity('');
            setFuel(null);
        }
        let validity =
            null !== selectedCar &&
            null !== expenseType &&
            '' !== mileage &&
            '' !== value;
        if (validity && expenseType === FUEL_EXPENSE_ID) {
            validity = null !== fuelType;
            validity = validity && '' !== quantity;
        }
        setFormIsValid(validity);
    }, [selectedCar, expenseType, fuelType, mileage, date, value, quantity]);

    const getFuelTypes = async () => {
        try {
            const response = await axios.post(API_URL + GET_FUEL_TYPES, {hash: HASH});
            if (response.data.success && response.data.data) {
                setFuelList(response.data.data);
            }

        } catch (e) {
            console.log("Error getting fuel types: ", e);
        }
    }

    const getExpenseTypes = async () => {
        try {
            const response = await axios.get(API_URL + GET_EXPENSE_TYPES, {hash: HASH});
            if (response.data.success && response.data.data) {
                setExpenseList(response.data.data);
            }
        } catch (e) {
            console.log("Error fetching expense types: ", e);
        }
    }

    const setCar = (car) => {
        if (!car.isActive) {
            return;
        }
        setSelectedCar(car);
        setMileageValue(car.mileage);
        setExpenseType(null);
        setFuelType(null);
        setQuantity('');

        const carFuelsList = car.fuel.map((fuel) => {
            return fuel;
        });

        setPossibleFuels(carFuelsList);
    }

    const setMileageValue = (val) => {
        setMileage(val);
    }

    const setExpense = (expenseId) => {
        setExpenseType(expenseId);
        setFuelType(null);

        //if only one fuel is available - auto set it
        if (expenseId === FUEL_EXPENSE_ID && possibleFuels.length === 1) {
            setFuel(possibleFuels[0].id);
        }
    }

    //todo: maybe remove?
    const setFuel = (fuelId) => {
        setFuelType(fuelId);
    }

    const resetForm = () => {
        setExpense(null);
        setSelectedCar(null);
        setFuelType(null);
        setMileageValue('');
        setDate(currentDate);
        setPossibleFuels([]);
        setValue('');
        setNotes('');
        setIsFormSubmit(true);
        if (onSubmit) {
            onSubmit();
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (formIsValid) {
            let url = API_URL + ADD_EXPENSE;
            const expenseData = {
                hash: HASH,
                userId: currentUser.id,
                carId: selectedCar.id,
                date: new Date(date).toISOString().split('T')[0],
                mileage: mileage,
                expenseId: expenseType,
                value: value,
                fuelId: fuelType,
                quantity: quantity,
                notes: notes
            }
            if (null !== expenseId) {
                url = API_URL + EDIT_EXPENSE.replace('%u', expenseId);
            }

            axios.post(url, expenseData)
                .then((response) => {
                    const result = response.data;

                    if (result.success) {
                        const currentCar = selectedCar; //after resetting the form the state value is erased
                        /* update context to match new mileage */
                        if (mileage !== currentCar.mileage) {
                            const tempCurrentUser = {...currentUser};
                            const idx = currentUser.cars.findIndex((car) => {
                                return car.id === currentCar.id;
                            });
                            tempCurrentUser.cars[idx].mileage = mileage;
                            ctx.updateUserData(tempCurrentUser);
                        }
                    }
                    console.log("Expense submitted: ", response);
                })
                .catch((error) => {
                    console.log('Error with execution: ', error);
                })
                .finally(() => {
                    resetForm();
                })
        }
    }

    const importHandler = (e) => {
        if (!selectedCar) {
            return;
        }
        const formData = new FormData();
        const file = e.target.files[0];
        formData.append('file', file);
        formData.append('fileName', file.name);
        const path = API_URL + IMPORT_EXPENSES
            .replace('%u', currentUser.id)
            .replace('%c', selectedCar.id);

        axios.post(
            path,
            formData,
            {
                headers: {'content-type': 'multipart/form-data'}
            }
        )
            .then((response) => {
                console.log('r', response);
            })
            .catch(e => {
                console.log('Error with file import', e);
            })
    }

    return (
        <Fragment>
            <Container customClass="new-expense">
                <h1 className="new-expense__title">
                    {null !== expenseId ? "Edit Expense" : "New Expense"}
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
                        showDisabled={false}
                        clickAction={setCar}
                        selectedCar={selectedCar}
                    />
                </div>
                <hr />
                <ExpenseList
                    multiple={false}
                    expenseList={expenseList}
                    activeExpenses={expenseType}
                    clickAction={setExpense}
                    customClass="new-expense__type item-list"
                    elementClass="new-expense__type-"
                />
                <hr />
                <div className="new-expense__inputs xp-form">
                    {expenseType === FUEL_EXPENSE_ID && (
                        <div className="xp-form__container input-full">
                            <div className="new-expense__fuel">
                                <input
                                    className="fuel-input"
                                    type="number"
                                    placeholder="Quantity"
                                    value={quantity}
                                    onChange={(e) => {
                                        setQuantity(e.target.value);
                                    }}
                                />
                                <FuelList
                                    multiple={false}
                                    fuelList={possibleFuels}
                                    selectedFuels={fuelType}
                                    customClass="new-expense__fuel-list"
                                    elementClass="item-selector"
                                    clickAction={setFuel}
                                />
                            </div>
                        </div>
                    )}
                    <div className="xp-form__container input-half">
                        <input
                            type="number"
                            value={mileage}
                            placeholder="Mileage"
                            onChange={(e) => {
                                setMileageValue(e.target.value);
                            }}
                        />
                    </div>
                    <div className="xp-form__container input-half">
                        <DatePicker
                            dateFormat="dd-MMM-YYYY"
                            selected={date}
                            onChange={(date) => {
                                setDate(date)
                            }}
                        />
                    </div>
                    <div className="xp-form__container input-full">
                        <input
                            className="new-expense__inputs-value new-expense__input"
                            type="number"
                            value={value}
                            placeholder="Value"
                            onChange={(e) => {
                                setValue(e.target.value);
                            }}
                        />

                    </div>
                    <div className="xp-form__container input-half"></div>

                    <textarea
                        placeholder="Additional info"
                        className="new-expense__input new-expense__inputs-notes"
                        onChange={(e) => {
                            setNotes(e.target.value)
                        }}
                        value={notes}
                    />
                    <div className="xp-form__actions">
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
                        {/* Disabling import for now */}
                        {/*<FileUpload*/}
                        {/*    text="Import"*/}
                        {/*    type="text/csv"*/}
                        {/*    isDisabled={!selectedCar}*/}
                        {/*    uploadHandler={importHandler}*/}
                        {/*/>*/}
                    </div>
                </div>
            </Container>
        </Fragment>

    );
}

export default NewExpense;