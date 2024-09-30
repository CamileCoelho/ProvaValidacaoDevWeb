const hbs = require("hbs");

class HbsConfigureCustomHelpers {
    static run() {
        hbs.registerHelper("igual", function (value1, value2) {
            if (value1 == value2)
                return true;
            return false;
        });
        
        hbs.registerHelper("not", function (value) {
            return !value;
        });
        
        hbs.registerHelper("value", function (value) {
            return value;
        });
    }
};

module.exports = HbsConfigureCustomHelpers;
