import React, {useContext, useEffect, useState} from 'react';
import Card from "../UI/Card";
import ReactDOM from "react-dom";
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import './Login.scss';
import iconClose from '../../assets/icons/icon-close.svg';

const overlayContainer = document.getElementById('black-overlay-1');

const Login = (props) => {
    const [user, setUser] = useState({
        value: '',
        isValid: true,
        message: '',
    });
    const [pass, setPass] = useState({
        value: '',
        isValid: true,
        message: '',
    });
    const [form, setForm] = useState({
        isValid: false,
        isEmail: false,
        message: '',
    });

    const ctx = useContext(AuthContext);

    useEffect(() => {
        if (user.value.length > 0 || pass.value.length > 0) {
            const timer = setTimeout(() => {
                const userIsValid = _checkUserValidity();
                const passIsValid = _checkPassValidity();
                if (userIsValid && passIsValid) {
                    setForm({
                        ...form,
                        isValid: userIsValid && passIsValid,
                        message: ''
                    })
                }
            }, 150);

            return () => {
                clearTimeout(timer);
            }
        }
    }, [user.value, pass.value]);

    const BlackOverlay = (props) => {
        return <div className="site-overlay black-overlay-1" onClick={props.onClose}></div>;
    }

    const _checkUserValidity = () => {
        let isValid = true;
        let message = '';
        if (user.value.length < 4) {
            isValid = false;
            message = 'Username is too short';
        }
        if (user.value.includes('@')) {
            if (null === user.value.toLowerCase().match(/^[a-z0-9-_.]{3,}@[a-z0-9-_.]{3,}.[a-z-_.]{2,}$/g)) {
                isValid = false;
                message = 'Invalid e-mail address';
            } else {
                setForm({
                    ...form,
                    isEmail: true
                })
            }
        } else {
            if (null === user.value.match(/^[A-Za-z0-9.-_]+$/g)) {
                isValid = false;
                message = 'Invalid characters';
            } else {
                setForm({
                    ...form,
                    isEmail: false
                })
            }
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
        let message = '';
        if (pass.value.length < 5) {
            isValid = false;
            message = 'Password is too short';
        }
        setPass({
            ...pass,
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
            case 'password':
                setPass({
                    ...pass,
                    value: val,
                });
                break;
            default:
                break;
        }
    }

    const onSubmit = (e) => {
        /** Statuses
         * 0 - missing data
         * 1 - incorrect username/password
         */
        e.preventDefault();
        const path = ctx.ajaxConfig.server + ctx.ajaxConfig.login;
        if (user.isValid && pass.isValid && form.isValid) {
            axios.post(path, {
                user: user.value,
                pass: pass.value,
                isEmail: + form.isEmail,
                hash: ctx.ajaxConfig.hash
            }).then((response) => {
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
                            message = 'Invalid username or password';
                            if (form.isEmail) {
                                message = 'Invalid e-mail or password:';
                            }
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
            <Card customClass="login-form">
                <button className="icon-modal-close" onClick={props.onClose}>
                    <img src={iconClose} className="icon-modal-close__icon" alt="close button"/>
                </button>
                <form className="login-form__form" onSubmit={onSubmit}>
                    <h1 className="login-form__title">Login</h1>
                    {!form.isValid && (
                        <div className="login-form__error">
                            {form.message}
                        </div>
                    )}
                    {!user.isValid && (
                        <div className="login-form__error">
                            {user.message}
                        </div>
                    )}
                    <input
                        type='text'
                        className={user.isValid ? '' : 'input-error'}
                        name='username'
                        value={user.value}
                        onChange={handleInput}
                        placeholder='Username or e-mail'
                    />
                    {!pass.isValid && (
                        <div className="login-form__error">
                            {pass.message}
                        </div>
                    )}
                    <input
                        type='password'
                        className={pass.isValid ? '' : 'input-error'}
                        name='password'
                        value={pass.value}
                        onChange={handleInput}
                        placeholder='Password'
                    />
                    <div className="login-form__actions">
                        <button
                            className={`exp-button exp-button__success ${user.isValid &&
                            pass.isValid &&
                            user.value.length > 0 &&
                            pass.value.length > 0
                                ? '' : ' disabled'}`}
                            type="submit"
                        >
                            Submit
                        </button>
                        <button
                            className='exp-button exp-button__new'
                            type='button'
                            onClick={props.onRegister}
                        >
                            Register
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

export default Login;