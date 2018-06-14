"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const advancedDataType_1 = require("./advancedDataType");
class Integer {
    constructor(value = null, rawValue = "", options = {}) {
        this.isAdvancedData = true;
        this.type = advancedDataType_1.AdvancedDataType.Integer;
        this.value = value;
        this.rawValue = rawValue;
        this.options = options;
    }
    isNil() {
        return lodash_1.isNil(this.value);
    }
    static fromDb(app, number, options) {
        if (!lodash_1.isNil(number))
            return new Integer(number, undefined, options);
        else
            return new Integer(null, undefined, options);
    }
    toDb() {
        return this.value;
    }
    static fromJsonValue(number, options) {
        if (!lodash_1.isNil(number))
            return new Integer(number, undefined, options);
        else
            return new Integer(null, undefined, options);
    }
    toJsonValue() {
        return this.value;
    }
    toString() {
        return this.toLocale();
    }
    toLocale() {
        if (!this.isNil())
            return this.value.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        else
            return "";
    }
    static inputIsWellFormed(input, options) {
        return !isNaN(parseInt(input));
    }
    static processInput(input, options) {
        return parseInt(input);
    }
    static fromInput(input, options) {
        const processedInput = Integer.inputIsWellFormed(input, options)
            ? Integer.processInput(input, options)
            : null;
        return new Integer(processedInput, input, options);
    }
    toInput() {
        return this.value || this.rawValue;
    }
    static selectIsWellFormed(input, options) {
        return !isNaN(parseInt(input));
    }
    static processSelect(input, options) {
        return parseInt(input);
    }
    static fromSelect(input, options) {
        const processedInput = Integer.selectIsWellFormed(input, options)
            ? Integer.processSelect(input, options)
            : null;
        return new Integer(processedInput, input, options);
    }
    toSelect() {
        return this.value || this.rawValue;
    }
}
exports.default = Integer;
//# sourceMappingURL=integer.js.map