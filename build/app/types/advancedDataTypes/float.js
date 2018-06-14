"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const advancedDataType_1 = require("./advancedDataType");
class Float {
    constructor(value = null, rawValue = "", options = { decimalDigits: 2 }) {
        this.isAdvancedData = true;
        this.type = advancedDataType_1.AdvancedDataType.Float;
        this.options = options;
        this.rawValue = rawValue;
        this.value = value ? lodash_1.round(value, this.options.decimalDigits) : null;
    }
    isNil() {
        return lodash_1.isNil(this.value);
    }
    static fromDb(app, number, options) {
        if (!lodash_1.isNil(number))
            return new Float(number, undefined, options);
        else
            return new Float(null, undefined, options);
    }
    toDb() {
        return this.value;
    }
    static fromJsonValue(number, options) {
        if (!lodash_1.isNil(number))
            return new Float(number, undefined, options);
        else
            return new Float(null, undefined, options);
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
                minimumFractionDigits: this.options.decimalDigits,
                maximumFractionDigits: this.options.decimalDigits
            });
        else
            return "";
    }
    static inputIsWellFormed(input, options) {
        return !isNaN(parseFloat(input));
    }
    static processInput(input, options) {
        return parseFloat(input);
    }
    static fromInput(input, options) {
        const processedInput = Float.inputIsWellFormed(input, options)
            ? Float.processInput(input, options)
            : null;
        return new Float(processedInput, input, options);
    }
    toInput() {
        return this.value || this.rawValue;
    }
    static selectIsWellFormed(input, options) {
        return !isNaN(parseFloat(input));
    }
    static processSelect(input, options) {
        return parseFloat(input);
    }
    static fromSelect(input, options) {
        const processedInput = Float.selectIsWellFormed(input, options)
            ? Float.processSelect(input, options)
            : null;
        return new Float(processedInput, input, options);
    }
    toSelect() {
        return this.value || this.rawValue;
    }
}
exports.default = Float;
//# sourceMappingURL=float.js.map