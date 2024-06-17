import React, { useContext } from 'react'
import Card from "../UI/Card";

import './Overall.scss';
import AuthContext from '../../Store/auth-context'

const Overall = (props) => {
  const data = props.data;
  const overall = data.overall ? data.overall : 0;
  const ctx = useContext(AuthContext);
  console.log('c', ctx);

  const currency = ctx.userDetails.user.currency
    ? ctx.userDetails.user.currency
    : 'EUR';


  return (
    <Card customClass="expense-overall">
      <h3>Overall</h3>
      <div className="expense-overall__data">
        {data.mileage && (
          <div className="expense-overall__row">
            <div className="expense-overall__index">Mileage</div>
            <div className="expense-overall__value">{data.mileage}</div>
          </div>
        )}
        {data.liters && (
          <div className="expense-overall__row">
            <div className="expense-overall__index">Liters</div>
            <div className="expense-overall__value">{data.liters}</div>
          </div>
        )}
        <div className="expense-overall__row">
          <div className="expense-overall__index">Overall</div>
          <div className="expense-overall__value">{overall}</div>
        </div>
        {data.rate && (
          <div className="expense-overall__row">
            <div className="expense-overall__index">Spent rate</div>
            <div className="expense-overall__value">{`${data.rate} ${currency} per kilometer`} </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default Overall;