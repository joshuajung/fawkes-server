"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const advancedDataType_1 = require("./advancedDataType");
class Text {
    constructor(value = null, rawValue = "", options = {}) {
        this.isAdvancedData = true;
        this.type = advancedDataType_1.AdvancedDataType.Text;
        this.value = value;
        this.rawValue = rawValue;
        this.options = options;
    }
    isNil() {
        return lodash_1.isNil(this.value);
    }
    static fromDb(app, string, options) {
        if (!lodash_1.isNil(string))
            return new Text(string, undefined, options);
        else
            return new Text(null, undefined, options);
    }
    toDb() {
        return this.value;
    }
    static fromJsonValue(string, options) {
        if (!lodash_1.isNil(string))
            return new Text(string, undefined, options);
        else
            return new Text(null, undefined, options);
    }
    toJsonValue() {
        return this.value;
    }
    toString() {
        return this.isNil() ? "" : this.value.split("\n").join(", ");
    }
    static textareaIsWellFormed(input, options) {
        return input.length > 0;
    }
    static processTextarea(input, options) {
        return input;
    }
    static fromTextarea(input, options) {
        const processedInput = Text.textareaIsWellFormed(input, options)
            ? Text.processTextarea(input, options)
            : null;
        return new Text(processedInput, input, options);
    }
    toTextarea() {
        return this.value || this.rawValue;
    }
}
exports.default = Text;
//# sourceMappingURL=text.js.map