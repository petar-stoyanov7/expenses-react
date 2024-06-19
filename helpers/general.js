export const removeArrayElement = (array, value) => {
    const i = array.indexOf(value);
    array.splice(i, 1);

    return array;
}

export const checkStringValidity = (string, type = 'default') => {
    let isValid = true;
    let message = '';
    if (type === 'user' && string.length < 5) {
        isValid = false;
        message = 'Username is too short'
    } else if (type === 'email' && null === string.match(/^[a-z0-9-_.]{3,}@[a-z0-9-_.]{3,}.[a-z-_.]{2,}$/g)) {
        isValid = false;
        message = 'Invalid e-mail address';
    } else {
        if (null === string.match(/^[A-Za-z0-9.-_]+$/g)) {
            isValid = false;
            message = 'Invalid characters';
        }
        if (string.length < 2) {
            isValid = false;
            message = `Value is too short`;
        }
    }

    return {
        isValid: isValid,
        message: message
    };

}