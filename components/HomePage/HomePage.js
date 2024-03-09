import React, {useState, useContext, useEffect} from 'react';
import './HomePage.scss';
import Container from "../UI/Container";
import CarList from "../Cars/CarList";
import AuthContext from "../../Store/auth-context";
import LastFive from "../LastFive/LastFive";
import axios from "axios";

const currentDate = new Date();
const currentMonth = ('0' + (currentDate.getMonth() + 1)).slice(-2);
const currentYear = currentDate.getFullYear();

const dummyData = {
    name: 'Guest',
    carsNumber: 1,
    yearTotal: 4315,
    monthTotal: 325,
    lastMonth: currentDate.toLocaleDateString('en-us', {month: 'long'}),
    lastYear: currentYear,
};

const HomePage = (props) => {
    const ctx = useContext(AuthContext);

    const [userData, setUserData] = useState(dummyData);

    useEffect(() => {
        if (undefined !== ctx.userDetails.user && Object.keys(ctx.userDetails.user).length !== 0) {

            setUserData((userData) => ({
                ...userData,
                name: `${ctx.userDetails.user.firstName} ${ctx.userDetails.user.lastName}`
            }));
            const path = ctx.ajaxConfig.server + ctx.ajaxConfig.getOverall;
            // monthly stats
            axios.post(path, {
                userId: ctx.userDetails.user.id,
                start: `${currentYear}${currentMonth}01`,
                end: `${currentYear}${currentMonth}31`,
                hash: ctx.ajaxConfig.hash
            }).then((response) => {
                const data = response.data;

                if (data.success) {
                    setUserData(prevState => ({
                        ...prevState,
                        monthTotal: data.sum
                    }));
                } else {
                    setUserData(userData => ({
                        ...userData,
                        monthTotal: 0
                    }));
                }
            });
            // Yearly stats
            axios.post(path, {
                userId: ctx.userDetails.user.id,
                start: `${currentYear}0101`,
                end: `${currentYear}1231`,
                hash: ctx.ajaxConfig.hash
            }).then((response) => {
                const data = response.data;

                if (data.success) {
                    setUserData(prevState => ({
                        ...prevState,
                        yearTotal: data.sum
                    }));
                } else {
                    setUserData(userData => ({
                        ...userData,
                        yearTotal: 0
                    }));
                }
            });

        } else {
            setUserData(dummyData);
        }
    }, [ctx.userDetails, ctx.ajaxConfig]);


    return (
        <div className='homepage'>
            <Container customClass="half-width">
                {!ctx.userDetails.isLogged && (
                    <h1 style={{color: 'red'}}>This is an example page!</h1>
                )}
                <h3 className='container-title'>Welcome back, {userData.name}</h3>
                <div className="content">
                <div>
                    <strong>Number of cars:</strong> {userData.carsNumber}
                </div>
                <div>
                    <strong>Total spent for {userData.lastMonth}</strong>: {userData.monthTotal}
                </div>
                <div>
                    <strong>Total spent for {userData.lastYear}</strong>: {userData.yearTotal}
                </div>
                </div>
            </Container>
            <Container customClass="half-width">
                <CarList
                    isDetailed={true}
                    hasModal={true}
                />
            </Container>
            <Container customClass="full-width">
                <LastFive type="user" userId={ctx.userDetails.user.id}/>
            </Container>
        </div>
        );
};

export default  HomePage;