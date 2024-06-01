import React from 'react';
import Card from "../UI/Card";

import "./ExpenseList.scss";

const ExpenseList = (props) => {
    if (!props.expenseList || !props.expenseList.length) {
        return "";
    }

    const setIsSelected = (expense) => {
        let customClass = `item-selector ${props.elementClass}-${expense.name.toLowerCase()}`;
        if (props.multiple) {
            customClass += props.activeExpenses.includes(expense.id) ? " is-selected" : "";
        } else {
            customClass += expense.id === props.activeExpenses ? " is-selected" : "";
        }

        return customClass;
    }

    let cardAll = "";
    if (props.showAll) {
        const customClass = setIsSelected({name: "Всички", id: "all"});
        cardAll = (
            <Card
                key="0"
                isButton={true}
                customClass={customClass}
                clickAction={() => {props.clickAction("all")}}
            >
                Всички
            </Card>
        );
    }

    return (
        <div className={`item-list ${props.customClass}`}>
            {cardAll}
            {props.expenseList.map((expense) => {
                const customClass = setIsSelected(expense);
                return (
                    <Card
                        key={expense.id}
                        isButton={true}
                        customClass={customClass}
                        clickAction={() => {props.clickAction(expense.id)}}
                    >
                        {expense.displayName ? expense.displayName : expense.name}
                    </Card>
                )
            })}
        </div>
    )
}

export default ExpenseList;