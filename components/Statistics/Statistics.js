import React, {
    Fragment,
    useContext,
    useEffect,
    useState
} from 'react';
import './Statistics.scss';
import Container from "../UI/Container";
import AuthContext from "../../Store/auth-context";


import "../../assets/css/default-datepicker.css";
import CarList from "../Cars/CarList";
import DatePicker from "react-datepicker";

const firstOfJan = new Date();
firstOfJan.setMonth(0);
firstOfJan.setDate(1);

const Statistics = () => {
    const ctx = useContext(AuthContext);
    const ajx = ctx.ajaxConfig;

    const currentUser = ctx.userDetails.user;

    const [selectedCar, setSelectedCar] = useState(null);
    const [dateFrom, setDateFrom] = useState(firstOfJan);
    const [dateTo, setDateTo] = useState(new Date());
    const [expenseTypes, setExpenseTypes] = useState([]);

    //---//

    const setCar = (car) => {
        if (!car.isActive && "all" !== car) {
            return;
        }

        setSelectedCar(car);
    }


    return (
        <div className="statistics">
            <Container customClass="full-width stat-form">
                <h1>Statistics</h1>
                <CarList
                    customClass="stat-form__cars"
                    isDetailed={false}
                    clickAction={setCar}
                    allCars={true}
                    selectedCar={selectedCar}
                />
                <div className="stat-form__dates">
                    <div className="stat-form__date">
                        <h4>From</h4>
                        <DatePicker
                            dateFormat="dd-MMM-YYYY"
                            className="new-expense__input new-expense__inputs-date"
                            selected={dateFrom}
                            onChange={(date) => {setDateFrom(date)}}
                        />
                    </div>
                    <div className="stat-form__date">
                        <h4>To</h4>
                        <DatePicker
                            dateFormat="dd-MMM-YYYY"
                            className="new-expense__input new-expense__inputs-date"
                            selected={dateTo}
                            onChange={(date) => {setDateTo(date)}}
                        />
                    </div>

                </div>
            </Container>
            <Container customClass="full-width">
                <h3>Statistics</h3>
            {/*    Overall*/}
            {/*    Statistics */}
            </Container>
        </div>
    )
}

export default Statistics;