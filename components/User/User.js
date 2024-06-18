import React, {useContext, useEffect, useState, Fragment} from 'react';

import './User.scss';
import Container from '../UI/Container'
import AuthContext from '../../Store/auth-context'
import Register from '../Register/Register'

const User = () => {
  const ctx = useContext(AuthContext);
  const user = ctx.userDetails.user;

  const [showRegister, setShowRegister] = useState(false);
  const [showEditCar, setShowEditCar] = useState(false);

  const editUser = () => {
    setShowRegister(true);
  }

  const hideRegister = () => {
    setShowRegister(false);
  }

  return (
    <div className="user-panel">
      <h1>User [{user.username}] Profile</h1>
      <div className="user-panel__container">
        <Container customClass="half-width">
          <h3>User profile:</h3>
          <div className="user-panel__user">
            <div className="row">
              <strong>Name: </strong> {user.firstName} {user.lastName}
            </div>
            <div className="row">
              <strong>Gender: </strong> {user.gender}
            </div>
            <div className="row">
              <strong>Email: </strong> {user.email}
            </div>
            <div className="row">
              <strong>Currency: </strong> {user.currency}
            </div>
          </div>
          <button
            className='exp-button button-small exp-button__success'
            type='button'
            onClick={editUser}
          >
            Edit
          </button>
          {showRegister && (
            <Register
              user={user}
              showLogin={false}
              onLogin={null}
              onClose={hideRegister}
            />
          )}
        </Container>
        <Container customClass="half-width">
          <h3>Cars</h3>
        </Container>
      </div>
    </div>
  );
}

export default User;