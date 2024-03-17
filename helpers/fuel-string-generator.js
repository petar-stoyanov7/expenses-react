export const generateFuelString = (fuelArray) => {
    let fuelString = "";

    fuelArray.forEach((fuel,i) => {
        fuelString += fuel.displayName ? fuel.displayName : fuel.name;
        if (i < (fuelArray.length - 1)) {
            fuelString += ' / ';
        }
    });

    return fuelString;
}