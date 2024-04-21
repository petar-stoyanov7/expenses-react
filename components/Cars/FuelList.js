import React from 'react';

import './FuelList.scss';
import Card from "../UI/Card";

const FuelList = (props) => {
    if (!props.fuelList || !props.fuelList.length) {
        return "";
    }

    return (
        <div className={`fuel-list item-list ${props.customClass}`}>
            {props.fuelList.map((fuel) => {
                let customClass = `fuel-list__item item-selector ${props.elementClass}`;
                if (props.multiple) {
                    customClass += props.selectedFuels.includes(fuel.id) ? " is-selected" : ""
                    //multiple
                } else {
                    customClass += fuel.id === props.selectedFuels ? " is-selected" : "";
                }
                return (
                    <Card
                        customClass={customClass}
                        key={fuel.id}
                        clickAction={() => {
                            props.clickAction(fuel.id)
                        }}
                    >
                        {fuel.displayName}
                    </Card>
                );

            })}
        </div>
    );
}

export default FuelList;