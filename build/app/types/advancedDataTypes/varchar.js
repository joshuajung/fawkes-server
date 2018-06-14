"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const advancedDataType_1 = require("./advancedDataType");
class Varchar {
    constructor(value = null, rawValue = "", options = {}) {
        this.isAdvancedData = true;
        this.type = advancedDataType_1.AdvancedDataType.Varchar;
        this.value = value;
        this.rawValue = rawValue;
        this.options = options;
    }
    isNil() {
        return lodash_1.isNil(this.value);
    }
    static fromDb(app, string, options) {
        if (!lodash_1.isNil(string))
            return new Varchar(string, undefined, options);
        else
            return new Varchar(null, undefined, options);
    }
    toDb() {
        return this.value;
    }
    static fromJsonValue(string, options) {
        if (!lodash_1.isNil(string))
            return new Varchar(string, undefined, options);
        else
            return new Varchar(null, undefined, options);
    }
    toJsonValue() {
        return this.value;
    }
    toString() {
        return this.isNil() ? "" : this.value;
    }
    static inputIsWellFormed(input, options) {
        return input.length > 0;
    }
    static processInput(input, options) {
        return input;
    }
    static fromInput(input, options) {
        const processedInput = Varchar.inputIsWellFormed(input, options)
            ? Varchar.processInput(input, options)
            : null;
        return new Varchar(processedInput, input, options);
    }
    toInput() {
        return this.value || this.rawValue;
    }
    static selectIsWellFormed(input, options) {
        return input.length > 0;
    }
    static processSelect(input, options) {
        return input;
    }
    static fromSelect(input, options) {
        const processedInput = Varchar.selectIsWellFormed(input, options)
            ? Varchar.processSelect(input, options)
            : null;
        return new Varchar(processedInput, input, options);
    }
    toSelect() {
        return this.value || this.rawValue;
    }
}
exports.default = Varchar;
//# sourceMappingURL=varchar.js.map