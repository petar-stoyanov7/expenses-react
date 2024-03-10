import React, {useState, useContext, useEffect} from 'react';
import './HomePage.scss';
import Container from "../UI/Container";
import CarList from "../Cars/CarList";
import AuthContext from "../../Store/auth-context";
import LastFive from "../LastFive/LastFive";
import axios from "axios";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const dummyData = {
    firstName: 'Guest',
    lastName: 'User',
    cars: [],
    yearTotal: 4315,
    lastYear: currentYear,
};

const HomePage = (props) => {
    const ctx = useContext(AuthContext);

    const [userData, setUserData] = useState(dummyData);
    const [lastFive, setLastFive] = useState([]);

    console.log('l', lastFive);

    useEffect(() => {
        console.log('u', ctx.userDetails);
        const userDetails = ctx.userDetails.user;
        if (undefined !== userDetails && Object.keys(userDetails).length !== 0) {
            setUserData(userDetails);

            const path = ctx.ajaxConfig.server + ctx.ajaxConfig.getUserExpenses.replace('%u', ctx.userDetails.user.id);

            axios.post(path, {
                count: 5,
                orderBy: 'date',
                order: 'DESC',
                // from: `${currentYear}-01-01`, //TODO: uncomment when we have more recent data
                // to: currentDate.toISOString().split('T')[0],
                hash: ctx.ajaxConfig.hash
            }).then((response) => {
                console.log('d', response.data);

                if (response.data.success) {
                    const data = response.data.data;
                    setLastFive(data);

                    let total = 0;
                    data.forEach((row) => {
                        total += row.value;
                    });
                    console.log('t', total);

                    setUserData({
                        ...userDetails,
                        yearTotal: total
                    })
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
                <h3 className='container-title'>Welcome back, {userData.firstName} {userData.lastName}</h3>
                <div className="content">
                <div>
                    <strong>Number of cars:</strong> {userData.cars.length}
                </div>
                <div>
                    <strong>Total spent for this year</strong>: {userData.yearTotal}
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
                <LastFive type="user" lastFive={lastFive}/>
            </Container>
        </div>
        );
};

export default  HomePage;