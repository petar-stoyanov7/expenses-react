import React, {Fragment, useContext, useEffect, useState} from 'react';
import './App.scss';
import Header from './components/Header/Header';
import Footer from "./components/Footer/Footer";
import HomePage from "./components/HomePage/HomePage";
import NewExpense from "./components/Expenses/NewExpense";
import Statistics from "./components/Statistics/Statistics";
import UserPanel from './components/User/UserPanel'
import AuthContext from "./Store/auth-context";
import {Route, Switch} from 'react-router-dom'

function App() {
    const ctx = useContext(AuthContext);

    const [activeElement, setActiveElement] = useState(<HomePage />);
    const setHomepage = () => {
        setActiveElement(<HomePage />);
    }
    const setNewExpense = () => {
        setActiveElement(<NewExpense />);
    }
    const setStatistics = () => {
        setActiveElement(<Statistics />);
    }
    const setUser = () => {
        setActiveElement(<UserPanel />);
    }

    useEffect(() => {
        if (!ctx.userDetails.isLogged) {
            setActiveElement(<HomePage />);
        } else {
            setActiveElement(<Statistics />); //todo: remove
        }
    }, [ctx.userDetails.isLogged]);


    return (

        <Fragment>
            <Header
                setHomepage={setHomepage}
                setNewExpense={setNewExpense}
                setStatistics={setStatistics}
                setUser={setUser}
            />
            <main className="main-content">
                {/* Switched this app to single page */}
                {/*<Switch>*/}
                {/*    <Route path="/new">*/}
                {/*        <NewExpense />*/}
                {/*    </Route>*/}
                {/*    <Route path="/">*/}
                {/*        <HomePage />*/}
                {/*    </Route>*/}
                {/*</Switch>*/}
                {activeElement}
            </main>
            <Footer/>
        </Fragment>
    );
}

export default App;
