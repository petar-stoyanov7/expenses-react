import React, {useContext, useEffect, useState} from 'react';
import Card from "../UI/Card";
import ReactDOM from "react-dom";
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import iconClose from '../../assets/icons/icon-close.svg';
import { checkStringValidity } from '../../helpers/general';

import '../../Style/CreateForm.scss';

const overlayContainer = document.getElementById('black-overlay-1');

const UserForm = (props) => {
    const [user, setUser] = useState({
        editable: !props.user,
        value: props.user ? props.user.username : '',
        isValid: true,
        message: '',
    });
    const [pass, setPass] = useState({
        value1: props.user ? '*******' : '',
        value2: props.user ? '*******' : '',
        isValid: true,
        message1: '',
        message2: '',
    });
    const [email, setEmail] = useState({
        value1: props.user ? props.user.email : '',
        value2: props.user ? props.user.email : '',
        isValid: true,
        message1: '',
        message2: ''
    });
    const [firstName, setFirstName] = useState({
        value: props.user ? props.user.firstName : '',
        isValid: true,
        message: '',
    });
    const [lastName, setLastName] = useState({
        value: props.user ? props.user.lastName : '',
        isValid: true,
        message: '',
    });
    const [gender, setGender] = useState(props.user ? props.user.gender : 'male');
    const [notes, setNotes] = useState({
        value: props.user ? props.user.notes : '',
        isValid: true,
        message: '',
    });
    const [currency, setCurrency] = useState(props.user ? props.user.currency : 'EUR');


    const [form, setForm] = useState({
        isValid: !!props.user,
        message: '',
    });

    const ctx = useContext(AuthContext);

    /* -- check user -- */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (user.value.length > 0) {
                _checkUserValidity();
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        }
    }, [user.value]);

    /* -- check pass -- */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (pass.value1.length || pass.value2.length) {
                _checkPassValidity();
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        }

    }, [[pass.value1, pass.value2]]);

    /* -- check email -- */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (email.value1.length || email.value2.length) {
                _checkEmailValidity();
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        }

    }, [[email.value1, email.value2]]);

    /* -- check firstname -- */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (firstName.value.length) {
                _checkStringValidity(firstName, setFirstName);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        }

    }, [firstName.value]);

    /* -- check lastname -- */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (lastName.value.length) {
                _checkStringValidity(lastName, setLastName);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        }

    }, [lastName.value]);

    /* -- check notes -- */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (notes.value.length) {
                _checkStringValidity(notes, setNotes, false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
        }

    }, [notes.value]);

    /* -- check form validity -- */
    useEffect(() => {
        const validity = user.isValid
          && pass.isValid
          && email.isValid
          && firstName.isValid
          && lastName.isValid
          && notes.isValid;

        setForm({
            ...form,
            isValid: validity
        });

    },[
      user.value,
      pass.value,
      email.value,
      firstName.value,
      lastName.value,
      notes.value

    ])

    const BlackOverlay = (props) => {
        return <div className="site-overlay black-overlay-1" onClick={props.onClose}></div>;
    }

    const _checkUserValidity = () => {
        const response = checkStringValidity(user.value, 'user');
        let isValid = response.isValid;
        let message = response.message;
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

        const response1 = checkStringValidity(email.value1, 'email');
        const response2 = checkStringValidity(email.value2, 'email');
        if (!response1.isValid) {
            message1 = response1.message;
        }
        if (!response2.isValid) {
            message2 = response2.message;
        }
        
        setEmail({
            ...email,
            isValid: isValid,
            message1: message1,
            message2: message2
        });

        return isValid;
    }

    const _checkStringValidity = (value, setter) => {
        const response = checkStringValidity(value.value);
        setter({
            ...value,
            isValid: response.isValid,
            message: response.message
        })
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
            case 'currency':
                setCurrency(val);
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
            case 'notes':
                setNotes({
                    ...notes,
                    value: val
                });
                break;
            default:
                break;
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let path = ctx.ajaxConfig.server + ctx.ajaxConfig.register;
        if (!form.isValid) {
            setForm({
                ...form,
                message: "Form is invalid"
            })
            return;
        }
        let postData = {};
        if (props.user) {
            const userData = props.user;
            console.log('ud', userData);
            if (userData.username !== user.value) {
                postData.username = user.value;
            }
            if (pass.value1 !== '*******') {
                postData.password = pass.value1;
            }
            if (userData.email !== email.value1) {
                postData.email = email.value1
            }
            if (userData.firstName !== firstName.value) {
                postData.firstName = firstName.value;
            }
            if (userData.lastName !== lastName.value) {
                postData.lastName = lastName.value;
            }
            if (userData.notes !== notes.value) {
                postData.notes = notes.value;
            }
            if (userData.gender !== gender) {
                postData.gender = gender;
            }
            if (userData.currency !== currency) {
                postData.currency = currency;
            }
            if (!Object.keys(postData).length) {
                props.onClose();
                return;
            }
            console.log('p', postData);
            path = ctx.ajaxConfig.server + ctx.ajaxConfig.userEdit.replace('%u', userData.id);
        } else {
            postData = {
                username: user.value,
                gender: gender,
                currency: currency,
                password: pass.value1,
                email: email.value1,
                firstName: firstName.value,
                lastName: lastName.value,
                notes: notes.value,
                hash: ctx.ajaxConfig.hash
            };
        }
        axios.post(path, postData).then((response) => {
            const data = response.data;
            console.log('d', data);
            if (data.success) {
                const user = data.data;
                ctx.onLogin(user, true); //TODO: change hardcoded value when roles are implemented
                props.onClose();
            } else if (data.message) {
                setForm({
                    ...form,
                    isValid: false,
                    message: data.message
                });
            } else {
                setForm({
                    ...form,
                    isValid: false,
                    message: "Error with Database Server"
                });

            }
        });
    }

    return (
        <React.Fragment>
            {ReactDOM.createPortal(
                <BlackOverlay onClose={props.onClose}/>,
                overlayContainer
            )}
            <Card customClass="create-form">
                <button className="icon-modal-close" onClick={props.onClose}>
                    <img src={iconClose} className="icon-modal-close__icon" alt="close button"/>
                </button>
                <form className="create-form__form xp-form" onSubmit={onSubmit}>
                    <h1 className="create-form__title">{props.user ? 'Edit' : 'Register'}</h1>
                    <div className="xp-form__container form-error">
                        {!form.isValid && (
                            <div className="create-form__error">
                                {form.message}
                            </div>
                        )}
                    </div>
                    {/*---------- user ----------*/}
                    <div className="xp-form__container input-half">
                        {!user.isValid && (
                            <div className="create-form__error">
                                {user.message}
                            </div>
                        )}
                        <input
                            type='text'
                            disabled={props.user}
                            className={`${user.isValid ? '' : ' input-error'}`}
                            name='username'
                            value={user.value}
                            onChange={handleInput}
                            placeholder='Username'
                        />
                    </div>
                    {/*---------- currency ----------*/}
                    <div className="xp-form__container input-quarter">
                        <select
                            name='currency'
                            onChange={handleInput}
                            value={currency}
                        >
                            <option value='EUR'>EUR</option>
                            <option value='BGN'>BGN</option>
                            <option value='USD'>USD</option>
                        </select>
                    </div>
                    {/*---------- gender ----------*/}
                    <div className="xp-form__container input-quarter">
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
                    <div className="xp-form__container input-half">
                        {!pass.isValid && (
                            <div className="create-form__error">
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
                    <div className="xp-form__container input-half">
                        {!pass.isValid && (
                            <div className="create-form__error">
                                {pass.message2}
                            </div>
                        )}
                        <input
                            type='password'
                            className={`create-form__password ${pass.isValid ? '' : 'input-error'}`}
                            name='password2'
                            value={pass.value2}
                            onChange={handleInput}
                            placeholder='Repeat Password'
                        />
                    </div>
                    {/*---------- email ----------*/}
                    <div className="xp-form__container input-half">
                        {!email.isValid && (
                            <div className="create-form__error">
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
                    <div className="xp-form__container input-half">
                        {!email.isValid && (
                            <div className="create-form__error">
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
                    <div className="xp-form__container input-half">
                        {!firstName.isValid && (
                            <div className="create-form__error">
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
                    <div className="xp-form__container input-half">
                        {!lastName.isValid && (
                            <div className="create-form__error">
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
                    {/*---------- notes ----------*/}
                    <div className="xp-form__container input-full input-textarea">
                        {!notes.isValid && (
                          <div className="create-form__error">
                              {notes.message}
                          </div>
                        )}
                        <textarea
                            name='notes'
                            value={notes.value}
                            onChange={handleInput}
                            placeholder='Additional Notes'
                        />
                    </div>
                    {/*---------- actions ----------*/}
                    <div className="xp-form__actions">
                        <button
                            className={`exp-button exp-button__new ${form.isValid
                                ? '' : ' disabled'}`}
                            type="submit"
                        >
                            {props.user ? 'Edit' : 'Register'}
                        </button>
                        {props.showLogin && (
                          <button
                            className='exp-button exp-button__success '
                            type='button'
                            onClick={props.onLogin}
                          >
                              Login
                          </button>
                        )}
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

export default UserForm;