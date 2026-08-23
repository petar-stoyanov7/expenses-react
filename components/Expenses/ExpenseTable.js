import React, {useContext, useState} from 'react';
import './ExpenseTable.scss';
import AuthContext from "../../Store/auth-context";
import iconEdit from "../../assets/icons/icon-edit.svg";
import iconDelete from "../../assets/icons/icon-close.svg";
import Confirmation from "../UI/Confirmation";
import axios from "axios";
import NewExpense from "./NewExpense";

const API_URL = process.env.SERVER_URL;
const HASH = process.env.HASH;
const DELETE_EXPENSE = process.env.DELETE_EXPENSE_PATH;

const overlayContainer = document.getElementById('black-overlay-1');
/**
 * TODO: update edited component
 * TODO: remove the ugly 300ms hack in newExpense
 * */

const ExpenseTable = (props) => {
    const [showEditExpense, setShowEditExpense] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState();

    let expenseTable;
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

    const handleDelete = () => {
        if (null === selectedExpense) {
            console.log("No expense selected!");
            return;
        }
        axios.post(API_URL + DELETE_EXPENSE.replace('%u', selectedExpense.id))
            .then((response) => {
                if (response.data.statusText !== "OK") {
                    console.log("Error from remote server: ", response);
                }
            })
            .catch((e) => {
                console.log("Error with deletion of expense: ", selectedExpense);
            })
            .finally(() => {
                setShowConfirmation(false);
            });
        props.deleteAction(selectedExpense);
    }

    if (null == props.expenses) {
        expenseTable = (
            <tr>
                <td>No expenses recorded</td>
            </tr>
        )
    } else {
        expenseTable = props.expenses.map((expense) => {
            let unit = '';
            if (null !== expense.fuel) {
                unit = expense.fuel.toLowerCase() === "електричество" ? "kW" : "l";
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
                        {null !== expense.quantity && `${expense.quantity} ${unit}`}
                    </td>
                    <td className="expenses-list__price">
                        {`${expense.value} ${currency}`}
                    </td>
                    <td className="expenses-list__notes">
                        {expense.notes}
                    </td>
                    {props.showEdit && (
                        <td className="expenses-list__actions">
                            <span onClick={() => {
                                setSelectedExpense(expense);
                                setShowEditExpense(true);
                            }}>
                                <img src={iconEdit} className="icon-edit" alt="edit expense"/>
                            </span>
                            <span onClick={() => {
                                setShowConfirmation(true);
                                setSelectedExpense(expense);
                            }}>
                                <img src={iconDelete} className="icon-edit" alt="delete expense"/>
                            </span>
                        </td>
                    )}
                </tr>
            )
        });
    }

    return (
        <React.Fragment>
            {showConfirmation && (
                <Confirmation
                    confirmColor="red"
                    cancelColor="green"
                    onConfirm={handleDelete}
                    onCancel={() => {setShowConfirmation(false)}}
                    text={
                    `Are you sure you want to delete expense: id: ${selectedExpense.id} ` +
                    `from ${selectedExpense.createdAt.date} for ${selectedExpense.value} ${currency}`
                    }
                />
            )}
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
                    {props.showEdit && (
                        <th className="expenses-list__actions">
                            Actions
                        </th>
                    )}
                </tr>
                </thead>
                <tbody>
                {expenseTable}
                </tbody>
            </table>
            {showEditExpense && (
                <>
                    <div
                        className="site-overlay black-overlay-1"
                        onClick={() => {
                            setShowEditExpense(false);
                            setSelectedExpense(null);
                        }}
                    />
                    overlayContainer
                    <div className="create-form">
                        <NewExpense
                            expense={selectedExpense}
                            onSubmit={() => {
                                setShowEditExpense(false);
                                setSelectedExpense(null);
                            }}
                        />
                    </div>
                </>
            )}
        </React.Fragment>
    )
};

export default ExpenseTable;