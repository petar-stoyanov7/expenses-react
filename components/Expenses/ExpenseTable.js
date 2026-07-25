import React, {useContext} from 'react';
import './ExpenseTable.scss';
import AuthContext from "../../Store/auth-context";

const ExpenseTable = (props) => {
    let expenses;
    let tableClass = "expenses-list";
    const ctx = useContext(AuthContext);
    const currency = ctx.userDetails.user.currency
        ? ctx.userDetails.user.currency
        : 'EUR';

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
            let unit = '';
            if (null !== expense.fuel) {
                unit = expense.fuel.toLowerCase() === "електричество" ? "kW": "l";
            }
            const date = new Date(expense.updatedAt.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
            return (
                <tr
                    key={`expense-t-${expense.id}`}
                    onClick={null == props.clickAction ? undefined : () => {
                        props.clickAction(expense.id);
                    }}
                >
                    <td className="expenses-list__mileage">
                        {expense.mileage}
                    </td>
                    <td className="expenses-list__date">
                        {date}
                    </td>
                    <td className="expenses-list__car">
                        {expense.car}
                    </td>
                    <td className="expenses-list__type">
                        {expense.expense}
                    </td>
                    <td className="expenses-list__fuel-type">
                        {expense.fuel}
                    </td>
                    <td className="expenses-list__quantity">
                        {/*TODO: change quantity to l/kW based on car type*/}
                        {null !== expense.quantity && `${expense.quantity} ${unit}`}
                        {/*}*/}
                    </td>
                    <td className="expenses-list__price">
                        {`${expense.value} ${currency}`}
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
                    <th className="expenses-list__fuel-type">
                        Fuel Type
                    </th>
                    <th className="expenses-list__quantity">
                        Quantity
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