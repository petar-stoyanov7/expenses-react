import React, {useEffect, useState, createContext} from 'react';
import {useCookies} from "react-cookie";
import Login from "../components/Login/Login";
import UserForm from '../components/User/UserForm'
import axios from "axios";

const API_URL = process.env.SERVER_URL;
const HASH = process.env.HASH;
const GET_USER = process.env.GET_USER_PATH;

const AuthContext = createContext({
    isLoggedIn: false,
    showLogin: () => {},
    showRegister: () => {},
    onLogin: (user, isAdmin) => {},
    onLogout: () => {},
    updateUserData: () => {},
});

export const AuthContextProvider = (props) => {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [userDetails, setUserDetails] = useState({
        isLogged: false,
        isAdmin: false,
        user: {}
    });

    const updateUserData = (userData) => {
        setUserDetails({
            ...userDetails,
            user: userData
        })
    }

    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    useEffect(() => {
        const storedUserId = parseInt(cookies.expUserId);
        const storedLoggedIn = parseInt(cookies.expIsLoggedIn) === 1;

        if (
            Boolean(storedUserId) &&
            storedLoggedIn &&
            !userDetails.isLogged
        ) {
            const path = API_URL + GET_USER.replace('%u', storedUserId);
            axios.get(path, {
                hash: HASH
            }).then((response) => {
                let data = response.data;
                if (data.success) {
                    const userData = data.data;
                    const user = {
                        id: userData.id,
                        username: userData.username,
                        email: userData.email,
                        gender: userData.gender,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        // sex: userData.Sex,
                        notes: userData.notes,
                        cars: userData.cars,
                        currency: userData.currency
                    }

                    setUserDetails({
                        isLogged: storedLoggedIn,
                        user: user,
                    });
                    hideLoginForm();
                    hideRegisterForm();
                }
            });
        }
    }, [
        userDetails,
        cookies.expUserId,
        cookies.expIsLoggedIn
    ]);

    const showLoginForm = () => {
        if (!userDetails.isLogged) {
            setShowRegister(false);
            setShowLogin(true);
        }
    }
    const showRegisterForm = () => {
        if (!userDetails.isLogged) {
            setShowLogin(false);
            setShowRegister(true);
        }
    }

    const hideLoginForm = () => {
        setShowLogin(false);
    }

    const hideRegisterForm = () => {
        setShowRegister(false);
    }

    const logoutHandler = () => {
        console.log('logging out');
        removeCookie('expUserId');
        removeCookie('expIsLoggedIn');

        setUserDetails({
            isLogged: false,
            isAdmin: false,
            user: {}
        });

        window.location.reload();
    };

    const loginHandler = (user, isAdmin) => {
        const cookieOpts = {
            path: '/',
            maxAge: (60 * 60 * 24 * 30),
            sameSite: "Strict",
            secure: true
        };
        console.log('Logging in');
        setCookie('expUserId', user.id, cookieOpts);
        setCookie('expIsLoggedIn', 1, cookieOpts);
        setUserDetails({
            isLogged: true,
            isAdmin: isAdmin,
            user: user
        });
        hideLoginForm();
        hideRegisterForm();
    }

    return (
        <AuthContext.Provider
            value={{
                userDetails: userDetails,
                showLogin: showLoginForm,
                showRegister: showRegisterForm,
                onLogin: loginHandler,
                onLogout: logoutHandler,
                updateUserData: updateUserData
            }}
        >
            {
                showLogin &&
                <Login
                    onLogin={loginHandler}
                    onRegister={showRegisterForm}
                    onClose={hideLoginForm}
                />
            }
            {
                showRegister &&
                <UserForm
                    showLogin={true}
                    onLogin={showLoginForm}
                    onClose={hideRegisterForm}
                />
            }
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;