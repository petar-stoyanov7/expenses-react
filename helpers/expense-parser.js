export const parseRawData = (data) => {
    return data.map((expense) => {
        const exp = {
            id: expense.ID,
            carName: `${expense.car_brand} ${expense.car_model}`,
            date: expense.Date,
            type: expense.expense_name,
            cid: expense.CID,
            fuelId: expense.Fuel_ID,
            liters: expense.Liters,
            insuranceId: expense.Insurance_ID,
            mileage: expense.Mileage,
            price: expense.Price,
            notes: expense.Notes
        }
        switch (expense.Expense_ID) {
            case '1':
                exp['expenseDetail'] = expense.fuel_name;
                break;
            case '2':
                exp['expenseDetail'] = expense.insurance_name;
                break;
            case '3':
            case '4':
            case '999':
            default:
                exp['expenseDetail'] = '';
                break;
        }
        return exp;
    });
}