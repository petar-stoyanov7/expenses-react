import React, { useContext } from 'react'
import Card from "../UI/Card";

import './Overall.scss';
import AuthContext from '../../Store/auth-context'

const Overall = (props) => {
  const data = props.data;
  const car = props.car;
  const overall = data.overall ? data.overall : 0;
  const ctx = useContext(AuthContext);

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
            <div className="expense-overall__value">{data.mileage} km</div>
          </div>
        )}
        {data.quantity && (
          <div className="expense-overall__row">
            <div className="expense-overall__index">Fuel:</div>
            <div className="expense-overall__value">{data.quantity}</div>
          </div>
        )}
        <div className="expense-overall__row">
          <div className="expense-overall__index">Overall</div>
          <div className="expense-overall__value">{`${overall} ${currency}`}</div>
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