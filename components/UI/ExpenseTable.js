import React from 'react';
import './ExpenseTable.scss';

const ExpenseTable = (props) => {
    let expenses;
    let tableClass = "expenses-list";

    if (null != props.isDetailed) {
        tableClass += " exp-detailed";
    }
    if (null != props.isSmall) {
        tableClass += " exp-small";
    }




    if (null == props.expenses) {
        expenses = (
            <tr>
                <td>No expenses recorded</td>
            </tr>
        )
    } else {
        expenses = props.expenses.map((expense) => {
            return (
                <tr
                    key={expense.id+expense.date}
                    onClick={null == props.clickAction ? undefined : () => {
                        props.clickAction(expense.id);
                    }}
                >
                    <td className="expenses-list__mileage">
                        {expense.mileage}
                    </td>
                    <td className="expenses-list__date">
                        {expense.date}
                    </td>
                    <td className="expenses-list__car">
                        {expense.carName}
                    </td>
                    <td className="expenses-list__type">
                        {expense.type}
                    </td>
                    <td className="expenses-list__detail">
                        {expense.expenseDetail}
                    </td>
                    <td className="expenses-list__liters">
                        {expense.liters}
                    </td>
                    <td className="expenses-list__price">
                        {expense.price}
                    </td>
                    <td className="expenses-list__notes">
                        {expense.notes}
                    </td>
                </tr>
            )
        });
    }

    return (
        <table
            className={tableClass}
            cellSpacing='0'
        >
            <thead className='expenses-list__header'>
                <tr>
                    <th className="expenses-list__mileage">
                        Mileage
                    </th>
                    <th className="expenses-list__date">
                        Date
                    </th>
                    <th className="expenses-list__car">
                        Car
                    </th>
                    <th className="expenses-list__type">
                        Type
                    </th>
                    <th className="expenses-list__detail">
                        Detail
                    </th>
                    <th className="expenses-list__liters">
                        Liters
                    </th>
                    <th className="expenses-list__price">
                        Value
                    </th>
                    <th className="expenses-list__notes">
                        Notes
                    </th>
                </tr>
            </thead>
            <tbody>
                {expenses}
            </tbody>
        </table>
    )
};

export default ExpenseTable;