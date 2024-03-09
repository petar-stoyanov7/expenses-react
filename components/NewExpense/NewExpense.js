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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LastFive from "../LastFive/LastFive";

const currentDate = new Date();

const NewExpense = () => {
    const ctx = useContext(AuthContext);
    const ajx = ctx.ajaxConfig;

    const [activeCar, setActiveCar] = useState(null);
    const [expenseType, setExpenseType] = useState(null);
    const [mileage, setMileage] = useState('');
    const [date, setDate] = useState(currentDate);
    const [fuelType, setFuelType] = useState(null);
    const [liters, setLiters] = useState('');
    const [insuranceType, setInsuranceType] = useState(null);
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
    const [expenseList, setExpenseList] = useState([]);
    const [fuelList, setFuelList] = useState([]);
    const [insuranceList, setInsuranceList] = useState([]);
    const [possibleFuels, setPossibleFuels] = useState([]);
    const [formIsValid, setFormIsValid] = useState({
        isValid: false,
        message: ''
    });
    const [isFormSubmit, setIsFormSubmit] = useState(true);


    useEffect(() => {
        axios.post(ajx.server+ajx.getExpenses, {hash: ajx.hash})
            .then((response) => {
                if (response.data.success) {
                    setExpenseList(response.data.expenses);
                }
            });
        axios.post(ajx.server+ajx.getFuels, {hash: ajx.hash})
            .then((response) => {
                if (response.data.success) {
                    setFuelList(response.data.fuels);
                }
            });
        axios.post(ajx.server+ajx.getInsurances, {hash: ajx.hash})
            .then((response) => {
                if (response.data.success) {
                    setInsuranceList(response.data.insurances);
                }
            });
    }, []);

    /** validty */
    useEffect(() => {
        let validity =
            null !== activeCar &&
            null !== expenseType &&
            '' !== mileage &&
            '' !== value;
        if (validity && expenseType === '1') {
            validity = null !== fuelType && '' !== liters;
        }
        if (validity && expenseType === '2') {
            validity = null !== insuranceType;
        }
        setFormIsValid(validity);
    }, [activeCar, expenseType, fuelType, insuranceType, mileage, date, value, liters]);

    const setCar = (car) => {
        setActiveCar(car);
        setMileageValue(car.mileage);
        setExpenseType(null);
        setInsuranceType(null);
        setFuelType(null);
        setLiters('');

        let carFuels = [];
        fuelList.map((fuel) => {
            if (fuel.ID === car.fuelId) {
                carFuels.push({
                    id: fuel.ID,
                    name: fuel.Name
                })
            }
            if (fuel.ID === car.fuelId2) {
                carFuels.push({
                    id: fuel.ID,
                    name: fuel.Name
                })
            }
        });
        setPossibleFuels(carFuels);
        if (carFuels.length === 1) {
            setFuel(carFuels[0].id);
        }
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

    const setInsurance = (insuranceId) => {
        setInsuranceType(insuranceId);
    }

    const resetForm = () => {
        console.log('form reset');
        setExpense(null);
        setActiveCar(null);
        setFuelType(null);
        setInsuranceType(null);
        setMileageValue('');
        setDate(currentDate);
        setPossibleFuels([]);
        setValue('');
        setIsFormSubmit(true);
    }

    const submitHandler = (e) => {
        e.preventDefault();
        if (formIsValid) {
            const expenseData = {
                hash: ajx.hash,
                userId: ctx.userDetails.user.id,
                carId: activeCar.id,
                date: new Date(date).toISOString().split('T')[0],
                mileage: mileage,
                expenseType: expenseType,
                value: value,
                fuelType: fuelType,
                liters: liters,
                insuranceType: insuranceType,
                partName: null, //TODO IMPLEMENT PARTS FFS!
                description: notes
            }

            axios.post(ajx.server+ajx.addExpense, expenseData)
                .then((response) => {
                    const result = response.data;
                    if (result.success) {
                        resetForm();
                        //refresh last5
                    } else {
                        setFormIsValid(false); //TODO FIX

                    }
                    console.log('response');
                    console.log(response);
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
                        activeCar={null != activeCar ? activeCar.id : null}
                    />
                </div>
                <hr />
                <div className="new-expense__type item-list">
                    {expenseList.map((expense) => {
                        let customClass = `item-selector new-expense__type-${expense.Name.toLowerCase()}`;
                        if (expense.ID === expenseType) {
                            customClass += ' is-active';
                        }
                        return (
                            <Card
                                key={expense.ID}
                                customClass={customClass}
                                clickAction={() => {setExpense(expense.ID)}}
                            >
                                {expense.Name}
                            </Card>
                        )
                    })}

                </div>
                <hr />
                <div
                    className="new-expense__insurances item-list"
                    style={{display: expenseType === '2' ? 'flex' : 'none'}}
                >
                    {insuranceList.map((insurance) => {
                        let customClass = "item-selector";
                        customClass += insurance.ID === insuranceType ? ' is-active' : '';
                        return (
                            <Card
                                customClass={customClass}
                                key={insurance.ID}
                                clickAction={() => {setInsurance(insurance.ID)}}
                            >
                                {insurance.Name}
                            </Card>
                        )
                    })}
                </div>
                <div
                    className="new-expense__fuels item-list"
                    style={{display: expenseType === '1' && null != activeCar ? 'flex' : 'none'}}
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
                        {possibleFuels.map((fuel) => {
                            let customClass = "item-selector";
                            customClass += fuel.id === fuelType ? ' is-active' : '';
                            return (
                                <Card
                                    customClass={customClass}
                                    key={fuel.id}
                                    clickAction={() => {setFuel(fuel.id)}}
                                >
                                    {fuel.name}
                                </Card>
                            );
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
            <Container>
                <LastFive
                    type="user"
                    refresh={isFormSubmit}
                    clearRefresh={setIsFormSubmit}
                />
            </Container>
        </Fragment>

    );
}

export default NewExpense;