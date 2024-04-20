export const generateFuelString = (fuelArray) => {
    if (!fuelArray || !fuelArray.length) {
        return;
    }

    let fuelString = "";

    fuelArray.forEach((fuel,i) => {
        fuelString += fuel.displayName ? fuel.displayName : fuel.name;
        if (i < (fuelArray.length - 1)) {
            fuelString += ' / ';
        }
    });

    return fuelString;
}