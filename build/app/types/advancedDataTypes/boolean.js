"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const advancedDataType_1 = require("./advancedDataType");
class Boolean {
    constructor(value = null, rawValue = "", options = {}) {
        this.isAdvancedData = true;
        this.type = advancedDataType_1.AdvancedDataType.Boolean;
        this.value = value;
        this.rawValue = rawValue;
        this.options = options;
    }
    isNil() {
        return lodash_1.isNil(this.value);
    }
    static fromDb(app, boolean, options) {
        if (!lodash_1.isNil(boolean))
            return new Boolean(boolean ? true : false, undefined, options);
        else
            return new Boolean(null, undefined, options);
    }
    toDb() {
        switch (this.value) {
            case true:
                return 1;
            case false:
                return 0;
            default:
                return null;
        }
    }
    static fromJsonValue(boolean, options) {
        if (!lodash_1.isNil(boolean))
            return new Boolean(boolean, undefined, options);
        else
            return new Boolean(null, undefined, options);
    }
    toJsonValue() {
        return this.value;
    }
    toString() {
        return this.isNil ? "No data" : this.value ? "true" : "false";
    }
    static selectIsWellFormed(input, options) {
        return input == "true" || input == "false";
    }
    static processSelect(input, options) {
        return input == "true" ? true : false;
    }
    static fromSelect(input, options) {
        const processedInput = Boolean.selectIsWellFormed(input, options)
            ? Boolean.processSelect(input, options)
            : null;
        return new Boolean(processedInput, input, options);
    }
    toSelect() {
        return this.isNil() ? "" : this.value ? "true" : "false";
    }
    static checkboxIsWellFormed(input, options) {
        return input === true || input === false;
    }
    static processCheckbox(input, options) {
        return input === true ? true : false;
    }
    static fromCheckbox(input, options) {
        const processedInput = Boolean.checkboxIsWellFormed(input, options)
            ? Boolean.processCheckbox(input, options)
            : false;
        return new Boolean(processedInput, input, options);
    }
    toCheckbox() {
        return this.isNil() ? false : this.value;
    }
}
exports.default = Boolean;
//# sourceMappingURL=boolean.js.map