import React, {useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom'
import Card from "../UI/Card";
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import iconClose from '../../assets/icons/icon-close.svg';
import { checkStringValidity, removeArrayElement } from '../../helpers/general'

import './CarForm.scss';
const overlayContainer = document.getElementById('black-overlay-1');

const GASOLINE = 1;
const DIESEL = 2;
const LPG = 3;
const CNG = 4;
const ELECTRIC = 5;

const CarForm = (props) => {

  const ctx = useContext(AuthContext);

  const [active, setActive] = useState(props.car ? props.car.active : true);
  const [availableFuels, setAvailableFuels] = useState([]);
  const [brand, setBrand] = useState({
    value: props.car ? props.car.brand : '',
    isValid: !!props.car,
    message: ''
  });
  const [model, setModel] = useState({
    value: props.car ? props.car.model : '',
    isValid: !!props.car,
    message: ''
  });
  const [color, setColor] = useState({
    value: props.car ? props.car.color : '',
    isValid: !!props.car,
    message: ''
  });
  const [mileage, setMileage] = useState({
    value: props.car ? props.car.mileage : '',
    isValid: !!props.car,
    message: ''
  });
  const [selectedFuels, setSelectedFuels] = useState({
    value: props.car ? props.car.fuels : [],
    isValid: props.car ? props.car.fuel.length : false,
    message: ''
  });
  const [year, setYear] = useState({
    value: props.car ? props.car.year : '',
    isValid: !!props.car,
    message: ''
  });
  const [notes, setNotes] = useState({
    value: props.car ? props.car.notes : '',
    isValid: true,
    message: ''
  });

  const [form, setForm] = useState({
    isValid: !!props.car,
    message: '',
  });

  /* --- get fuel list --- */
  useEffect(() => {
    axios.get(ctx.ajaxConfig.server + ctx.ajaxConfig.getFuels)
      .then((response) => {
        if (response.data.success && response.data.data.length) {
          const fuelData = response.data.data.map((fuel) => {
            return {
              id: fuel.id,
              name: fuel.displayName ? fuel.displayName : fuel.name
            }
          });

          setAvailableFuels(fuelData);
        } else {
          setForm({
            isValid: false,
            message: "Fuel list could not be retrieved. Please try again later"
          })
        }
      })
      .catch((e) => {
        console.log("Server error: ", e);

        setForm({
          isValid: false,
          message: "Fuel list could not be retrieved. Please try again later"
        })
      })
  }, []);

  /* -- check brand -- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (brand.value.length) {
        _checkStringValidity(brand, setBrand);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [brand.value]);

  /* -- check model -- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (model.value.length) {
        _checkStringValidity(model, setModel);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [model.value]);

  /* -- check color -- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (color.value.length) {
        _checkStringValidity(color, setColor);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [color.value]);

  /* -- check year -- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (year.value.length) {
        _checkYearValidity();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [year.value]);

  /* -- check mileage -- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mileage.value.length) {
        _checkMileageValidity();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [mileage.value]);

  /* -- check fuels -- */
  useEffect(() => {
    const timer = setTimeout(() => {
        _checkFuelValidity();
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [selectedFuels.value]);

  /* -- check notes -- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes.value.length) {
        _checkStringValidity(notes, setNotes,false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [notes.value]);

  /* -- check form -- */
  useEffect(() => {
    const isValid = brand.isValid
      && model.isValid
      && color.isValid
      && mileage.isValid
      && year.isValid
      && notes.isValid
      && selectedFuels.isValid;

    setForm({
      ...form,
      isValid: isValid
    })
  }, [
    brand.value,
    model.value,
    color.value,
    mileage.value,
    year.value,
    selectedFuels.value,
    notes.value
  ]);


  /* ------ */
  const BlackOverlay = (props) => {
    return <div className="site-overlay black-overlay-1" onClick={props.onClose}></div>;
  }

  const _checkStringValidity = (obj, setter, required = true) => {
    if (!required && obj.value.length === 0) {
      setter({
        ...obj,
        isValid: true,
        message: ''
      });
    }
    const response = checkStringValidity(obj.value);
    setter({
      ...obj,
      isValid: response.isValid,
      message: response.message
    });
  }

  const _checkYearValidity = () => {
    let isValid = true;
    let message = '';
    const check = year.value;
    if (null === check.match(/^\d{2}$/g) && null === check.match(/^\d{4}$/g) ) {
      isValid = false;
      message = "Invalid year format.";
    }

    if (null !== check.match(/^\d{4}$/g)) {
      if (check < 1886) {
        isValid = false;
        message = "The car can't be THAT old!"
      }

      if (check > new Date  ().getFullYear() + 5) {
        isValid = false;
        message = "The car can't be THAT new";
      }
    }

    setYear({
      ...year,
      message: message,
      isValid: isValid
    });
  }

  const _checkMileageValidity = () => {
    let check = mileage.value.replace(/^0+/, '');
    let isValid = true;
    let message = "";
    if (null === check.match(/^\d+$/)) {
      isValid = false;
      message = "Invalid characters";
    }
    if (check < 0 || check > 9999999) {
      isValid = false;
      message = "Invalid mileage value";
    }

    setMileage({
      value: check,
      isValid: isValid,
      message: message
    });
  }

  const _checkFuelValidity = () => {
    let fuelList = selectedFuels.value;
    let isValid = true;
    let message = '';
    if (fuelList.includes(GASOLINE) && fuelList.includes(DIESEL)) {
      isValid = false;
      message = "Invalid fuel combination"
    }
    if (fuelList.includes(DIESEL) && (fuelList.includes(LPG) || fuelList.includes(CNG))) {
      isValid = false;
      message = "Invalid fuel combination"
    }
    if (fuelList.length < 1) {
      isValid = false;
      message = "You need at least one fuel";
    }

    setSelectedFuels({
      value: fuelList,
      message: message,
      isValid: isValid
    });
  }

  const handleInput = (e) => {
    const val = e.target.value;
    const inputName = e.target.name;
    switch(inputName) {
      case 'brand':
        setBrand({
          ...brand,
          value: val
        });
        break;
      case 'model':
        setModel({
          ...model,
          value: val
        });
        break;
      case 'color':
        setColor({
          ...color,
          value: val
        });
        break;
      case 'year':
        setYear({
          ...year,
          value: val
        });
        break;
      case 'mileage':
        setMileage({
          ...mileage,
          value: val
        });
        break;
      case 'notes':
        setNotes({
          ...notes,
          value: val
        });
        break;
      case 'active':
        setActive(e.target.checked);
        break;
    }
  }

  const handleFuel = (e) => {
    const fuelId = parseInt(e.target.id);
    let tmpFuels = [...selectedFuels.value];
    if (tmpFuels.includes(fuelId)) {
      tmpFuels = removeArrayElement(tmpFuels, fuelId);
    } else {
      tmpFuels.push(fuelId);
    }

    setSelectedFuels({
      ...tmpFuels,
      isValid: tmpFuels.length > 0,
      value: tmpFuels });
  }

  const resetForm = () => {
    const emptyObj = {
      isValid: false,
      message: '',
      value: ''
    };
    setBrand(emptyObj);
    setModel(emptyObj);
    setColor(emptyObj);
    setMileage(emptyObj);
    setSelectedFuels({
      value: [],
      message: '',
      isValid: false
    });
    setYear(emptyObj);
    setNotes(emptyObj);
    setForm()
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.isValid) {
      setForm({
        ...form,
        message: "Form is invalid"
      });
    }
    const postData = {
      userId: ctx.userDetails.user.id,
      brand: brand.value,
      model: model.value,
      fuel: selectedFuels.value,
      color: color.value,
      mileage: mileage.value,
      year: year.value,
      notes: notes.value
    }

    let path = ctx.ajaxConfig.server + ctx.ajaxConfig.createCar;

    if (props.car && props.car.id) {
      path = ctx.ajaxConfig.server + ctx.ajaxConfig.editCar.replace('%u', props.car.id);
    }

    axios.post(path, postData)
      .then((response) => {
        if (response.data.success) {
          console.log('r', response.data.data);
        } else {
          setForm({
            isValid: false,
            message: response.data.message ? response.data.message : "Error with DB"
          })
        }
        console.log('rere', response);
      })
      .catch((e) => {
        console.log('Error with execution', e);
        setForm({
          isValid: false,
          message: "Error with DB"
        })
      })

    console.log('pp', postData);
  }

  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <BlackOverlay onClose={props.onClose}/>,
        overlayContainer
      )}
      <Card customClass="create-form">
        <button className="icon-modal-close" onClick={props.onClose}>
          <img src={iconClose} className="icon-modal-close__icon" alt="close button"/>
        </button>
        <form className="create-form__form" onSubmit={onSubmit}>
          <h1 className="create-form__title">{props.user ? 'Edit Car' : 'Create Car'}</h1>
          <div className="create-form__container form-error">
            {!form.isValid && (
              <div className="create-form__error">
                {form.message}
              </div>
            )}
          </div>
          {/*---------- active ----------*/}
          <div className="create-form__container input-full input-checkbox">
            <input
              checked={active}
              type='checkbox'
              name='active'
              onChange={handleInput}
              id='active'
            />
            <label htmlFor='active'>Is Active</label>
          </div>
          {/*---------- brand ----------*/}
          <div className="create-form__container input-half">
            {!brand.isValid && (
              <div className="create-form__error">
                {brand.message}
              </div>
            )}
            <input
              type='text'
              className={`${brand.isValid ? '' : ' input-error'}`}
              name='brand'
              value={brand.value}
              onChange={handleInput}
              placeholder='Brand'
            />
          </div>
          {/*---------- model ----------*/}
          <div className="create-form__container input-half">
            {!model.isValid && (
              <div className="create-form__error">
                {model.message}
              </div>
            )}
            <input
              type='text'
              className={`${model.isValid ? '' : ' input-error'}`}
              name='model'
              value={model.value}
              onChange={handleInput}
              placeholder='Model'
            />
          </div>
          {/*---------- color ----------*/}
          <div className="create-form__container input-half">
            {!color.isValid && (
              <div className="create-form__error">
                {color.message}
              </div>
            )}
            <input
              type='text'
              className={`${color.isValid ? '' : ' input-error'}`}
              name='color'
              value={color.value}
              onChange={handleInput}
              placeholder='Color'
            />
          </div>
          {/*---------- year ----------*/}
          <div className="create-form__container input-half">
            {!year.isValid && (
              <div className="create-form__error">
                {year.message}
              </div>
            )}
            <input
              type='number'
              className={`${year.isValid ? '' : ' input-error'}`}
              name='year'
              value={year.value}
              onChange={handleInput}
              placeholder='Year'
            />
          </div>
          {/*---------- mileage ----------*/}
          <div className="create-form__container input-full">
            {!mileage.isValid && (
              <div className="create-form__error">
                {mileage.message}
              </div>
            )}
            <input
              type='number'
              className={`${mileage.isValid ? '' : ' input-error'}`}
              name='mileage'
              value={mileage.value}
              onChange={handleInput}
              placeholder='Mileage'
            />
          </div>
          {/*---------- fuel ----------*/}
          <div className="create-form__container input-full">
            {!selectedFuels.isValid && (
              <div className="create-form__error">
                {selectedFuels.message}
              </div>
            )}
            {availableFuels.length && (
              availableFuels.map((fuel) => {
                const fuelList = selectedFuels.value;
                let disabled = false;
                if (fuelList.includes(DIESEL) && [GASOLINE, LPG, CNG].includes(fuel.id)) {
                  disabled = true;
                }
                if (fuelList.includes(GASOLINE) && fuel.id === DIESEL) {
                  disabled = true;
                }
                if (fuelList.length > 1) {
                  disabled = true;
                }
                if (fuelList.includes(fuel.id)) {
                  disabled = false;
                }
                return (
                  <div className="fuel-checkbox" key={fuel.id}>
                    <input
                      disabled={disabled}
                      checked={fuelList.includes(fuel.id)}
                      type="checkbox"
                      id={fuel.id}
                      onChange={handleFuel}
                    />
                    <label htmlFor={fuel.id}>{fuel.name}</label>
                  </div>
                )
              })
          )}
          </div>
          {/*---------- notes ----------*/}
          <div className="create-form__container input-full input-textarea">
            {!notes.isValid && (
              <div className="create-form__error">
                {notes.message}
              </div>
            )}
            <textarea
              name='notes'
              value={notes.value}
              onChange={handleInput}
              placeholder='Additional Notes'
            />
          </div>
          {/*---------- actions ----------*/}
          <div className="create-form__actions">
            <button
              className={`exp-button exp-button__new ${form.isValid
                ? '' : ' disabled'}`}
              type="submit"
            >
              {props.car ? 'Edit' : 'Create'}
            </button>
            <button
              type='button'
              className="exp-button exp-button__danger"
              value="Cancel"
              onClick={props.onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </React.Fragment>
  );
}

export default CarForm;