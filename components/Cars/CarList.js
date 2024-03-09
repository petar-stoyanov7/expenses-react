import React, {useContext, useEffect, useState, Fragment} from 'react';

import './CarList.scss';
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import Car from "./Car";
import ReactDOM from "react-dom";
import CarModal from "./CarModal";


const overlayContainer = document.getElementById('black-overlay-1');

const dummyData = [
    {
        id: 0,
        brand: 'BMW',
        model: '330i',
        color: 'Black',
        mainFuel: 'Gas',
        secondaryFuel: 'LPG',
        year: '2014',
        mileage: '115010',
        lastYearSpent: 4315
    }
];
const dummyCarData = {
    showModal: false,
    car: {}
}

const CarList = (props) => {
    const ctx = useContext(AuthContext);
    const showControls = undefined !== props.showControls ? props.showControls : false;

    const [carList, setCarList] = useState(dummyData);
    const [carModal, setCarModal] = useState(dummyCarData);
    // const [activeCar, setActiveCar] = useState(null);
    const activeCar = props.activeCar;

    const isDetailed = null != props.isDetailed ? props.isDetailed : false;
    const hasModal = null != props.hasModal ? props.hasModal : false;

    const hideCarDetails = () => {
        setCarModal({
            showModal: false,
            car: {}
        })
    }
    const showCarDetails = (car) => {
        setCarModal({
            showModal: true,
            car: car
        });
    }

    const BlackOverlay = () => {
        return <div className="site-overlay black-overlay-1" onClick={hideCarDetails}></div>;
    }

    useEffect(() => {
        if (ctx.userDetails.isLogged) {
            const ajaxCfg = ctx.ajaxConfig;

            axios.post(ajaxCfg.server + ajaxCfg.getCars, {
                id: ctx.userDetails.user.id,
                hash: ajaxCfg.hash
            }).then((response) => {
                const data = response.data;
                if (data.success) {
                    const formattedCarList = data.cars.map((car) => {
                        return {
                            id: car.ID,
                            brand: car.Brand,
                            model: car.Model,
                            year: car.Year,
                            color: car.Color,
                            mileage: car.Mileage,
                            mainFuel: car.fuel_name1,
                            secondaryFuel: car.fuel_name2,
                            notes: car.Notes,
                            fuelId: car.Fuel_ID,
                            fuelId2: car.Fuel_ID2
                        }
                    });
                    setCarList(formattedCarList);
                } else {
                    setCarList([]);
                }
            });
        } else {
            setCarList(dummyData);
            if (hasModal) {
                setCarModal(dummyCarData);
            }
        }
    }, [ctx.userDetails, ctx.ajaxConfig]);

    const clickAction = (car) => {
        if (null != props.clickAction) {
            props.clickAction(car);
        } else {
            showCarDetails(car);
        }
    }


    return (
        <Fragment>
            {(carModal.showModal && hasModal) && (
                <Fragment>
                    <CarModal
                        onClose={hideCarDetails}
                        ajaxCfg={ctx.ajaxConfig}
                        car={carModal.car}
                        showControls={showControls}
                    />
                    {ReactDOM.createPortal(
                        <BlackOverlay />,
                        overlayContainer
                    )}
                </Fragment>
            )}
            <div className="car-list">
                {isDetailed && (
                    <h3 className='container-title'>Cars:</h3>
                )}

                <div className="car-list__cars">
                    {carList.map((car) => {
                        return (
                            <Car
                                customClass={car.id === activeCar ? 'is-active' : ''}
                                key={car.id}
                                currentCar={car}
                                clickAction={() => {clickAction(car)}}
                                isDetailed={isDetailed}
                            />
                        );
                    })}
                </div>
            </div>
        </Fragment>
    );
}

export default CarList;