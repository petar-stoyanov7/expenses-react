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
        fuel: [
            {
                id: 1,
                name: "gasoline",
                displayName: "Gasoline"
            }
        ],
        year: '2014',
        mileage: '100110',
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
    const selectedCar = props.selectedCar;

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
        const userData = ctx.userDetails;

        if (!userData.isLogged) {
            setCarList(dummyData);
            if (hasModal) {
                setCarModal(dummyCarData);
            }
        } else if (userData.user && userData.user.cars.length) {
            const formattedCarList = userData.user.cars.map((car) => {
                return {
                    id: car.id,
                    brand: car.brand ? car.brand : '',
                    model: car.model ? car.model : '',
                    year: car.year ? car.year : '0000',
                    fuel: car.fuel ? car.fuel : [],
                    color: car.color ? car.color : '',
                    mileage: car.mileage ? car.mileage : '',
                    notes: car.notes ? car.notes : '',
                };
            });
            setCarList(formattedCarList);

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
                        <BlackOverlay/>,
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
                                customClass={car.id === selectedCar ? 'is-selected' : ''}
                                key={car.id}
                                currentCar={car}
                                clickAction={() => {
                                    clickAction(car)
                                }}
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