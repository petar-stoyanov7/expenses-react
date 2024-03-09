import React from 'react';
import ReactDOM from 'react-dom';
import {CookiesProvider} from "react-cookie";
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {AuthContextProvider} from "./Store/auth-context";
import {BrowserRouter as Router} from "react-router-dom";


let rootElement = document.getElementById('root');

ReactDOM.render(
    <Router>
        <CookiesProvider>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </CookiesProvider>
    </Router>,
    rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
