import React, {useContext, useEffect, useState} from 'react';
import ReactDOM from 'react-dom'
import Card from "../UI/Card";
import AuthContext from "../../Store/auth-context";
import axios from "axios";
import iconClose from '../../assets/icons/icon-close.svg';
import { checkStringValidity, removeArrayElement } from '../../helpers/general'

import './CarForm.scss';
import FuelList from "./FuelList";
const overlayContainer = document.getElementById('black-overlay-1');

const GASOLINE = 1;
const DIESEL = 2;
const LPG = 3;
const CNG = 4;
const ELECTRIC = 5;

const CarForm = (props) => {

  const ctx = useContext(AuthContext);

  const [isActive, setIsActive] = useState(props.car ? props.car.isActive : true);
  const [allFuels, setAllFuels] = useState([]);
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
    value: [],
    isValid: false,
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
    if (props.car && props.car.fuel) {
      const fuelList = props.car.fuel.map((fuel) => {
        return fuel.id;
      });

      setSelectedFuels({
        ...selectedFuels,
        value: fuelList
      });
    }
    axios.get(ctx.ajaxConfig.server + ctx.ajaxConfig.getFuels)
        .then((response) => {
          if (response.data.success && response.data.data.length) {
            const fuelData = response.data.data.map((fuel) => {
              return {
                id: fuel.id,
                name: fuel.displayName ? fuel.displayName : fuel.name
              }
            });

            setAllFuels(fuelData);
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
      if (brand.value) {
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
      if (model.value) {
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
      if (color.value) {
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
      if (year.value) {
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
      if (mileage.value) {
        _checkMileageValidity();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [mileage.value]);

  /* -- filter fuels on init -- */
  useEffect(() => {
    _handleAvailableFuels();
  }, [allFuels]);

  /* -- check fuels -- */
  useEffect(() => {
    _handleAvailableFuels();

    const timer = setTimeout(() => {
      if (selectedFuels.value) {
        _checkFuelValidity();
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    }
  }, [selectedFuels.value]);

  /* -- check notes -- */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (notes.value) {
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
    }
  }

  const _handleAvailableFuels = () => {
    let fuelList = [...allFuels];

    if (selectedFuels.value.length) {
      selectedFuels.value.forEach((fuelId) => {
        fuelList = _fuelCompatibility(fuelId, fuelList);
      });
    }
    setAvailableFuels(fuelList);
  }

  const handleFuel = (fuelId) => {
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
    console.log('pp', postData, path);

    axios.post(path, postData)
      .then((response) => {
        if (response.data.success) {
          window.location.reload(); //todo: try to make the context refresh
        } else {
          setForm({
            isValid: false,
            message: response.data.message ? response.data.message : "Error with DB"
          })
        }
      })
      .catch((e) => {
        console.log('Error with execution', e);
        setForm({
          isValid: false,
          message: "Error with DB"
        })
      });
  }

  const _fuelCompatibility = (fuelId, fuelList) => {
    switch (fuelId) {
      case GASOLINE:
        fuelList = _removeById(fuelList, [DIESEL]);
        break;
      case LPG:
        fuelList = _removeById(fuelList, [DIESEL, CNG, ELECTRIC]);
        break;
      case CNG:
        fuelList = _removeById(fuelList, [DIESEL, LPG, ELECTRIC]);
        break;
      case DIESEL:
        fuelList = _removeById(fuelList, [GASOLINE, LPG, CNG]);
        break;
      case ELECTRIC:
        fuelList = _removeById(fuelList, [LPG, CNG]);
        break;
    }

    return fuelList;
  }

  const _removeById = (array, indexes) => {
    let tempArray = [];
    array.forEach((obj) => {
      if (!indexes.includes(obj.id)) {
        tempArray.push(obj);
      }
    });

    return tempArray;
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
          <form className="create-form__form xp-form" onSubmit={onSubmit}>
            <h1 className="create-form__title">{props.car ? 'Edit Car' : 'Create Car'}</h1>
            <div className="xp-form__container form-error">
              {!form.isValid && (
                  <div className="create-form__error">
                    {form.message}
                  </div>
              )}
            </div>
            {/*---------- active ----------*/}
            <div className="xp-form__container input-full input-checkbox">
              <button
                  className={'exp-button button-small' + (isActive ? ' exp-button__success' : ' exp-button__success disabled')}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsActive(!isActive);
                  }}
              >{isActive ? 'Active' : 'Disabled'}</button>
            </div>
            {/*---------- brand ----------*/}
            <div className="xp-form__container input-half">
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
            <div className="xp-form__container input-half">
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
            <div className="xp-form__container input-half">
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
            <div className="xp-form__container input-half">
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
            <div className="xp-form__container input-full">
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
            <div className="xp-form__container input-full">
              {!selectedFuels.isValid && (
                  <div className="create-form__error">
                    {selectedFuels.message}
                  </div>
              )}
              <FuelList
                  multiple={true}
                  fuelList={availableFuels}
                  selectedFuels={selectedFuels.value}
                  customClass=''
                  elementClass='item-selector'
                  clickAction={handleFuel}
              />
            </div>
            {/*---------- notes ----------*/}
            <div className="xp-form__container input-full input-textarea">
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
            <div className="xp-form__actions">
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