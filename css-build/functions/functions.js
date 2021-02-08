const config = require('../config');
module.exports = {
    pxtorem: (inputValue, baseFontSize = 16) => {
        let calcConversion = (parseFloat(inputValue, 10) / baseFontSize),
            finalresult = calcConversion + "rem";
        return finalresult
    },
    calcwidth: (target, context) => {
        let calcConversion = target / context,
            finalresult = `${calcConversion * 100}%`;
        return finalresult
    },
}