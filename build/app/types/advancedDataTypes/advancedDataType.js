"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const varchar_1 = require("./varchar");
exports.Varchar = varchar_1.default;
const text_1 = require("./text");
exports.Text = text_1.default;
const integer_1 = require("./integer");
exports.Integer = integer_1.default;
const float_1 = require("./float");
exports.Float = float_1.default;
const boolean_1 = require("./boolean");
exports.Boolean = boolean_1.default;
const dateTime_1 = require("./dateTime");
exports.DateTime = dateTime_1.default;
const stupidDate_1 = require("./stupidDate");
exports.StupidDate = stupidDate_1.default;
const lookup_1 = require("./lookup");
exports.Lookup = lookup_1.default;
var AdvancedDataType;
(function (AdvancedDataType) {
    AdvancedDataType["Varchar"] = "Varchar";
    AdvancedDataType["Text"] = "Text";
    AdvancedDataType["Integer"] = "Integer";
    AdvancedDataType["Float"] = "Float";
    AdvancedDataType["Boolean"] = "Boolean";
    AdvancedDataType["DateTime"] = "DateTime";
    AdvancedDataType["StupidDate"] = "StupidDate";
    AdvancedDataType["Lookup"] = "Lookup";
})(AdvancedDataType = exports.AdvancedDataType || (exports.AdvancedDataType = {}));
exports.advancedDataConstructor = (dataType) => {
    switch (dataType) {
        case AdvancedDataType.Float:
            return float_1.default;
        case AdvancedDataType.Boolean:
            return boolean_1.default;
        case AdvancedDataType.Varchar:
            return varchar_1.default;
        case AdvancedDataType.Text:
            return text_1.default;
        case AdvancedDataType.Integer:
            return integer_1.default;
        case AdvancedDataType.DateTime:
            return dateTime_1.default;
        case AdvancedDataType.StupidDate:
            return stupidDate_1.default;
        case AdvancedDataType.Lookup:
            return lookup_1.default;
    }
};
exports.toJsonDeep = (value) => {
    if (lodash_1.isArray(value)) {
        return value.map(e => exports.toJsonDeep(e));
    }
    else if (lodash_1.isObject(value) && value["isAdvancedData"] === true) {
        const advancedDataInJson = {
            isAdvancedDataInJson: true,
            type: value.type,
            options: value.options,
            value: value.toJsonValue()
        };
        return advancedDataInJson;
    }
    else if (lodash_1.isObject(value)) {
        let newObject = {};
        for (let key in value) {
            newObject[key] = exports.toJsonDeep(value[key]);
        }
        return newObject;
    }
    else {
        return value;
    }
};
exports.fromJsonDeep = (value) => {
    if (lodash_1.isArray(value)) {
        return value.map(e => exports.fromJsonDeep(e));
    }
    else if (lodash_1.isObject(value) && value["isAdvancedDataInJson"] === true) {
        const constructor = exports.advancedDataConstructor(value.type);
        return constructor.fromJsonValue(value.value, value.options);
    }
    else if (lodash_1.isObject(value)) {
        let newObject = {};
        for (let key in value) {
            newObject[key] = exports.fromJsonDeep(value[key]);
        }
        return newObject;
    }
    else {
        return value;
    }
};
exports.sendAdvancedData = (res, data) => {
    const convertedBody = exports.toJsonDeep(data);
    return res.send(convertedBody);
};
//# sourceMappingURL=advancedDataType.js.map