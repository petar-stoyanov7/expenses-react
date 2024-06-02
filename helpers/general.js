export const removeArrayElement = (array, value) => {
    const i = array.indexOf(value);
    array.splice(i, 1);

    return array;
}