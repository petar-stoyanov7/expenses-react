import React, {useEffect, useState, createContext} from 'react';
import {useCookies} from "react-cookie";
import Login from "../components/Login/Login";
import UserForm from '../components/User/UserForm'
import ajaxConfig from "../cfg/ajax.json";
import axios from "axios";

const AuthContext = createContext({
    isLoggedIn: false,
    ajaxConfig: {},
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
        const storedIsAdmin = parseInt(cookies.expIsAdmin) === 1;

        if (
            Boolean(storedUserId) &&
            storedLoggedIn &&
            !userDetails.isLogged
        ) {
            const path = ajaxConfig.server + ajaxConfig.getUser.replace('%u', storedUserId);
            axios.get(path, {
                hash: ajaxConfig.hash
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
                        isAdmin: storedIsAdmin,
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
        cookies.expIsLoggedIn,
        cookies.expIsAdmin
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
        removeCookie('expIsAdmin');

        setUserDetails({
            isLogged: false,
            isAdmin: false,
            user: {}
        });

        window.location.reload();
    };

    const loginHandler = (user, isAdmin) => {
        console.log('Logging in');
        setCookie('expUserId', user.id, {path: '/'});
        setCookie('expIsLoggedIn', 1, {path: '/'});
        setCookie('expIsAdmin', isAdmin ? 1 : 0, {path: '/'});
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
                ajaxConfig: ajaxConfig,
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