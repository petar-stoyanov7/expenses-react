import React from 'react';

import './FuelList.scss';
import Card from "../UI/Card";

const FuelList = (props) => {
    if (!props.fuelList || !props.fuelList.length) {
        return "";
    }
    const setIsSelected = (fuelId) => {
        let customClass = `fuel-list__item item-selector ${props.elementClass}`;

        if (props.multiple) {
            customClass += props.selectedFuels.includes(fuelId) ? " is-selected" : ""
        } else {
            customClass += fuelId === props.selectedFuels ? " is-selected" : "";
        }

        return customClass;
    }

    let cardAll = "";
    if (props.showAll) {
        let customClass = setIsSelected("all");

        cardAll = (
            <Card
                customClass={customClass}
                key={0}
                clickAction={() => {
                    props.clickAction("all")
                }}
            >
                Всички
            </Card>
        );
    }


    return (
        <div className={`fuel-list item-list ${props.customClass}`}>
            {cardAll}
            {props.fuelList.map((fuel) => {
                const customClass = setIsSelected(fuel.id);
                return (
                    <Card
                        customClass={customClass}
                        key={fuel.id}
                        clickAction={() => {
                            props.clickAction(fuel.id)
                        }}
                    >
                        {fuel.displayName ? fuel.displayName : fuel.name}
                    </Card>
                );

            })}
        </div>
    );
}

export default FuelList;