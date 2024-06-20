import React, {useContext, useEffect, useState, Fragment} from 'react';

import Container from '../UI/Container'
import AuthContext from '../../Store/auth-context'
import UserForm from './UserForm'
import CarList from '../Cars/CarList'
import CarForm from '../Cars/CarForm'

import './UserPanel.scss';
import Confirmation from '../UI/Confirmation'
import axios from 'axios'

const UserPanel = () => {
  const ctx = useContext(AuthContext);
  const user = ctx.userDetails.user;

  const [showRegister, setShowRegister] = useState(false);
  const [showEditCar, setShowEditCar] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [car, setCar] = useState(false);

  const editUser = () => {
    setShowRegister(true);
  }

  const hideRegister = () => {
    setShowRegister(false);
  }

  const showCarForm = (car = false) => {
    if (car) {
      setCar(car);
    }
    setShowEditCar(true);
  }
  const hideCarForm = () => {
    setCar(false);
    setShowEditCar(false)
  }

  const showDeleteModal = (car) => {
    setCar(car);
    setShowConfirmation(true);
  }

  const handleDelete = () => {
    if (!car.id) {
      console.log('No car selected');
      setShowConfirmation(false);
      return;
    }
    const path = ctx.ajaxConfig.server + ctx.ajaxConfig.deleteCar.replace('%u', car.id);

    axios.post(path).then((response) => {
      if (response.data.success) {
        window.location.reload(); //TODO: add more graceful method of refreshing context
      } else {
        setShowConfirmation(false);
        console.log('Error deleting car');
      }
    }).catch((e) => {
      setShowConfirmation(false);
      console.log('Error deleting car', e);
    });
  }
  const cancelDelete = () => {
    setShowConfirmation(false);
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
            <UserForm
              user={user}
              showLogin={false}
              onLogin={null}
              onClose={hideRegister}
            />
          )}
          {showEditCar && (
            <CarForm
              onClose={hideCarForm}
              car={car}
            />
          )}
          {showConfirmation && (
            <Confirmation
              confirmColor="red"
              cancelColor="green"
              onConfirm={handleDelete}
              onCancel={cancelDelete}
              text={`Are you sure you want to delete ${car.brand} ${car.model}?! This action can not be undone and will delete all associated expenses!`}
            />
          )}
        </Container>

        <Container customClass="half-width">
          <div className="user-panel__car-list">
            <CarList
              isDetailed={true}
              hasModal={false}
              clickAction={showCarForm}
              showDeleteButton={true}
              deleteAction={showDeleteModal}
            />
          </div>

          <button
            className='exp-button button-small exp-button__success'
            type='button'
            onClick={showCarForm}
          >
            New
          </button>
        </Container>
      </div>
    </div>
  );
}

export default UserPanel;