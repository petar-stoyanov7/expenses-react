import React from 'react';
import Card from "../UI/Card";

import "./ExpenseList.scss";

const ExpenseList = (props) => {
    if (!props.expenseList || !props.expenseList.length) {
        return "";
    }

    return (
        <div className={`item-list ${props.customClass}`}>
            {props.expenseList.map((expense) => {
                let customClass = `item-selector ${props.elementClass}-${expense.name.toLowerCase()}`;
                if (props.multiple) {
                    customClass += props.activeExpenses.includes(expense.id) ? " is-selected" : "";
                } else {
                    customClass += expense.id === props.activeExpenses ? " is-selected" : "";
                }
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