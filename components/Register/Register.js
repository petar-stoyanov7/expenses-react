import React, {useContext, useEffect, useState} from 'react';
import Card from "../UI/Card";
import ReactDOM from "react-dom";
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import './Register.scss';
import iconClose from '../../assets/icons/icon-close.svg';

const overlayContainer = document.getElementById('black-overlay-1');

const Register = (props) => {
    const [user, setUser] = useState({
        value: '',
        isValid: true,
        message: '',
    });
    const [pass, setPass] = useState({
        value1: '',
        value2: '',
        isValid: true,
        message1: '',
        message2: '',
    });
    const [email, setEmail] = useState({
        value1: '',
        value2: '',
        isValid: true,
        message1: '',
        message2: ''
    });
    const [firstName, setFirstName] = useState({
        value: '',
        isValid: true,
        message: '',
    });
    const [lastName, setLastName] = useState({
        value: '',
        isValid: true,
        message: '',
    });
    const [city, setCity] = useState({
        value: '',
        isValid: true,
        message: ''
    });
    const [gender, setGender] = useState('male');
    const [notes, setNotes] = useState('');


    const [form, setForm] = useState({
        isValid: false,
        message: '',
    });

    const ctx = useContext(AuthContext);

    useEffect(() => {
        if (
            user.value.length > 0 ||
            pass.value1.length > 0 ||
            email.value1.length > 0 ||
            firstName.value.length > 0 ||
            lastName.value.length > 0 ||
            city.value.length > 0
        ) {
            const timer = setTimeout(() => {
                const userIsValid = _checkUserValidity();
                const passIsValid = _checkPassValidity();
                const emailIsValid = _checkEmailValidity();
                const firstNameIsValid = _checkFirstNameValidity();
                const lastNameIsValid = _checkLastNameValidity();
                const cityIsValid = _checkCityValidity();
                if (
                    userIsValid &&
                    passIsValid &&
                    emailIsValid &&
                    firstNameIsValid &&
                    lastNameIsValid &&
                    cityIsValid
                ) {
                    setForm({
                        ...form,
                        isValid: user.isValid && pass.isValid,
                        message: ''
                    })
                }
            }, 150);

            return () => {
                clearTimeout(timer);
            }
        }
    }, [
        user.value,
        pass.value1,
        pass.value2,
        email.value1,
        email.value2,
        firstName.value,
        city.value
    ]);

    const BlackOverlay = (props) => {
        return <div className="site-overlay black-overlay-1" onClick={props.onClose}></div>;
    }

    const _checkUserValidity = () => {
        let isValid = true;
        let message = '';
        if (null === user.value.match(/^[A-Za-z0-9.-_]+$/g)) {
            isValid = false;
            message = 'Invalid characters';
        }
        if (user.value.length < 4) {
            isValid = false;
            message = 'Username is too short';
        }
        setUser({
            ...user,
            isValid: isValid,
            message: message
        });

        return isValid;
    }

    const _checkPassValidity = () => {
        let isValid = true;
        let message1 = '';
        let message2 = '';
        if (pass.value1 !== pass.value2) {
            isValid = false;
            message1 = message2 = 'Passwords don\'t match';
        }
        if (pass.value1.length < 5) {
            isValid = false;
            message1 = 'Password is too short';
        }
        if (pass.value2.length < 5) {
            isValid = false;
            message2 = 'Password is too short';
        }
        setPass({
            ...pass,
            isValid: isValid,
            message1: message1,
            message2: message2
        });

        return isValid;
    }

    const _checkEmailValidity = () => {
        let isValid = true;
        let message1 = '';
        let message2 = '';

        if (email.value1 !== email.value2) {
            isValid = false;
            message1 = message2 = 'Email addressess don\'t match';
        }

        if (null === email.value1.match(/^[a-z0-9-_.]{3,}@[a-z0-9-_.]{3,}.[a-z-_.]{2,}$/g)) {
            isValid = false;
            message1 = 'Invalid e-mail address';
        }
        if (null === email.value2.match(/^[a-z0-9-_.]{3,}@[a-z0-9-_.]{3,}.[a-z-_.]{2,}$/g)) {
            isValid = false;
            message2 = 'Invalid e-mail address';
        }
        
        setEmail({
            ...email,
            isValid: isValid,
            message1: message1,
            message2: message2
        });

        return isValid;
    }

    const _checkFirstNameValidity = () => {
        let isValid = true;
        let message = '';
        if (null === firstName.value.match(/^[A-Za-z0-9.-_]+$/g)) {
            isValid = false;
            message = 'Invalid characters';
        }
        if (firstName.value.length < 2) {
            isValid = false;
            message = 'First Name is too short';
        }
        setFirstName({
            ...firstName,
            isValid: isValid,
            message: message
        });

        return isValid;
    }

    const _checkLastNameValidity = () => {
        let isValid = true;
        let message = '';
        if (null === lastName.value.match(/^[A-Za-z0-9.-_]+$/g)) {
            isValid = false;
            message = 'Invalid characters';
        }
        if (lastName.value.length < 2) {
            isValid = false;
            message = 'Last Name is too short';
        }
        setLastName({
            ...lastName,
            isValid: isValid,
            message: message
        });

        return isValid;
    }

    const _checkCityValidity = () => {
        let isValid = true;
        let message = '';
        if (null === city.value.match(/^[A-Za-z.-_ ]+$/g)) {
            isValid = false;
            message = 'Invalid characters';
        }
        if (city.value.length < 2) {
            isValid = false;
            message = 'City is too short';
        }
        setCity({
            ...city,
            isValid: isValid,
            message: message
        });

        return isValid;
    }

    const handleInput = (e) => {
        const val = e.target.value;
        const inputName = e.target.name;
        switch(inputName) {
            case 'username':
                setUser({
                    ...user,
                    value: val,
                });
                break;
            case 'gender':
                setGender(val);
                break;
            case 'password1':
                setPass({
                    ...pass,
                    value1: val,
                });
                break;
            case 'password2':
                setPass({
                    ...pass,
                    value2: val,
                });
                break;
            case 'email1':
                setEmail({
                    ...email,
                    value1: val
                });
                break;
            case 'email2':
                setEmail({
                    ...email,
                    value2: val
                });
                break;
            case 'firstname':
                setFirstName({
                    ...firstName,
                    value: val
                });
                break;
            case 'lastname':
                setLastName({
                    ...lastName,
                    value: val
                });
                break;
            case 'city':
                setCity({
                    ...city,
                    value: val
                });
                break;
            case 'notes':
                setNotes(val);
                break;
            default:
                break;
        }
    }

    const onSubmit = (e) => {
        console.log('subm');
        /** Statuses
         * 0 - success
         * 1 - missing data
         * 2 - user exists
         */
        e.preventDefault();
        const path = ctx.ajaxConfig.server + ctx.ajaxConfig.register;
        if (form.isValid) {
            const postData = {
                username: user.value,
                gender: gender,
                password: pass.value1,
                email: email.value1,
                firstName: firstName.value,
                lastName: lastName.value,
                city: city.value,
                notes: notes,
                group: 'users',
                hash: ctx.ajaxConfig.hash
            };
            axios.post(path, postData).then((response) => {
                const data = response.data;
                if (data.success) {
                    const isAdmin = data.user.Group === 'admins';
                    const user = {
                        id: data.user.ID,
                        username: data.user.Username,
                        city: data.user.City,
                        email: data.user.Email,
                        firstName: data.user.Fname,
                        lastName: data.user.Lname,
                        sex: data.user.Sex,
                        notes: data.user.Notes,
                    }
                    ctx.onLogin(user, isAdmin);
                } else if (!data.success) {
                    let message = '';
                    switch(data.status) {
                        case 2:
                            message = 'Username is already taken';
                            break;
                        case 3:
                            message = 'Email address is already used';
                            break;
                        case 1:
                        default:
                            message = 'We have a problem with this app, please try again later';
                            break;
                    }
                    setForm({
                        ...form,
                        isValid: false,
                        message: message
                    });
                } else {
                    setForm({
                        ...form,
                        isValid: false,
                        message: 'No connection to DB. Please check later!'
                    });
                }
            });
        }
    }

    return (
        <React.Fragment>
            {ReactDOM.createPortal(
                <BlackOverlay onClose={props.onClose}/>,
                overlayContainer
            )}
            <Card customClass="register-form">
                <button className="icon-modal-close" onClick={props.onClose}>
                    <img src={iconClose} className="icon-modal-close__icon" alt="close button"/>
                </button>
                <form className="register-form__form" onSubmit={onSubmit}>
                    <h1 className="register-form__title">Register</h1>
                    <div className="register-form__container form-error">
                        {!form.isValid && (
                            <div className="register-form__error">
                                {form.message}
                            </div>
                        )}
                    </div>
                    {/*---------- user ----------*/}
                    <div className="register-form__container input-username">
                        {!user.isValid && (
                            <div className="register-form__error">
                                {user.message}
                            </div>
                        )}
                        <input
                            type='text'
                            className={`${user.isValid ? '' : ' input-error'}`}
                            name='username'
                            value={user.value}
                            onChange={handleInput}
                            placeholder='Username'
                        />
                    </div>
                    {/*---------- gender ----------*/}
                    <div className="register-form__container input-gender">
                        <select
                            name='gender'
                            onChange={handleInput}
                            value={gender}
                        >
                            <option value='male'>male</option>
                            <option value='female'>female</option>
                        </select>
                    </div>
                    {/*---------- pass ----------*/}
                    <div className="register-form__container input-password">
                        {!pass.isValid && (
                            <div className="register-form__error">
                                {pass.message1}
                            </div>
                        )}
                        <input
                            type='password'
                            className={` ${pass.isValid ? '' : 'input-error'}`}
                            name='password1'
                            value={pass.value1}
                            onChange={handleInput}
                            placeholder='Password'
                        />
                    </div>
                    <div className="register-form__container input-password">
                        {!pass.isValid && (
                            <div className="register-form__error">
                                {pass.message2}
                            </div>
                        )}
                        <input
                            type='password'
                            className={`register-form__password ${pass.isValid ? '' : 'input-error'}`}
                            name='password2'
                            value={pass.value2}
                            onChange={handleInput}
                            placeholder='Repeat Password'
                        />
                    </div>
                    {/*---------- email ----------*/}
                    <div className="register-form__container input-email">
                        {!email.isValid && (
                            <div className="register-form__error">
                                {email.message1}
                            </div>
                        )}
                        <input
                            type='email'
                            className={`${email.isValid ? '' : 'input-error'}`}
                            name='email1'
                            value={email.value1}
                            onChange={handleInput}
                            placeholder='Email Address'
                        />
                    </div>
                    <div className="register-form__container input-email">
                        {!email.isValid && (
                            <div className="register-form__error">
                                {email.message2}
                            </div>
                        )}
                        <input
                            type='email'
                            className={`${email.isValid ? '' : 'input-error'}`}
                            name='email2'
                            value={email.value2}
                            onChange={handleInput}
                            placeholder='Repeat Email Address'
                        />
                    </div>
                    {/*---------- fname ----------*/}
                    <div className="register-form__container input-firstname">
                        {!firstName.isValid && (
                            <div className="register-form__error">
                                {firstName.message}
                            </div>
                        )}
                        <input
                            type='text'
                            className={`${firstName.isValid ? '' : 'input-error'}`}
                            name='firstname'
                            value={firstName.value}
                            onChange={handleInput}
                            placeholder='First Name'
                        />
                    </div>
                    {/*---------- lname ----------*/}
                    <div className="register-form__container input-lastname">
                        {!lastName.isValid && (
                            <div className="register-form__error">
                                {lastName.message}
                            </div>
                        )}
                        <input
                            type='text'
                            className={`${lastName.isValid ? '' : 'input-error'}`}
                            name='lastname'
                            value={lastName.value}
                            onChange={handleInput}
                            placeholder='Last Name'
                        />
                    </div>
                    {/*---------- city ----------*/}
                    <div className="register-form__container input-city">
                        {!city.isValid && (
                            <div className="register-form__error">
                                {city.message}
                            </div>
                        )}
                        <input
                            type='text'
                            className={` ${city.isValid ? '' : 'input-error'}`}
                            name='city'
                            value={city.value}
                            onChange={handleInput}
                            placeholder='City of residence'
                        />
                    </div>
                    {/*---------- notes ----------*/}
                    <div className="register-form__container input-notes">
                        <textarea
                            name='notes'
                            value={notes.value}
                            onChange={handleInput}
                            placeholder='Additional Notes'
                        />
                    </div>
                    {/*---------- actions ----------*/}
                    <div className="register-form__actions">
                        <button
                            className={`exp-button exp-button__new ${form.isValid
                                ? '' : ' disabled'}`}
                            type="submit"
                        >
                            Register
                        </button>
                        <button
                            className='exp-button exp-button__success '
                            type='button'
                            onClick={props.onLogin}
                        >
                            Login
                        </button>
                        <button
                            type='button'
                            className="exp-button exp-button__danger"
                            value="Cancel"
                            onClick={props.onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Card>
        </React.Fragment>
    );
}

export default Register;