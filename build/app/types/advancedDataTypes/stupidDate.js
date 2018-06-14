"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const lodash_1 = require("lodash");
const luxon_1 = require("luxon");
const lodash_2 = require("lodash");
const advancedDataType_1 = require("./advancedDataType");
class StupidDate {
    constructor(value = {
        year: null,
        month: null,
        day: null
    }, rawValue = "", options = {}) {
        this.isAdvancedData = true;
        this.type = advancedDataType_1.AdvancedDataType.StupidDate;
        this.value = value;
        this.rawValue = rawValue;
        this.options = options;
    }
    isNil() {
        return (lodash_2.isNil(this.value) ||
            lodash_2.isNil(this.value.year) ||
            lodash_2.isNil(this.value.month) ||
            lodash_2.isNil(this.value.day));
    }
    static fromDb(app, dbDate, options) {
        if (!lodash_2.isNil(dbDate))
            return StupidDate.fromIso8601(dbDate, options);
        else
            return new StupidDate(null, undefined, options);
    }
    toDb() {
        return this.isNil() ? null : this.toIso8601();
    }
    static fromJsonValue(jsonObject, options) {
        if (!lodash_2.isNil(jsonObject) &&
            !lodash_2.isNil(jsonObject.year) &&
            !lodash_2.isNil(jsonObject.month) &&
            !lodash_2.isNil(jsonObject.day))
            return new StupidDate(jsonObject, undefined, options);
        else
            return new StupidDate(null, undefined, options);
    }
    toJsonValue() {
        if (!this.isNil())
            return {
                year: this.value.year,
                month: this.value.month,
                day: this.value.day
            };
        else
            return null;
    }
    toString() {
        return this.toLocale();
    }
    static fromIso8601(iso8601Date, options) {
        if (!validator.isISO8601(iso8601Date)) {
            const error = Error("StupidDate could not be initialized with incorrect input " +
                iso8601Date);
            throw error;
        }
        const dateComponents = iso8601Date.split("-").map(c => parseInt(c));
        return new StupidDate({
            year: dateComponents[0],
            month: dateComponents[1],
            day: dateComponents[2]
        }, undefined, options);
    }
    toIso8601() {
        return [
            lodash_1.padStart(this.value.year.toString(), 4, "0"),
            lodash_1.padStart(this.value.month.toString(), 2, "0"),
            lodash_1.padStart(this.value.day.toString(), 2, "0")
        ].join("-");
    }
    toLocale() {
        if (!this.isNil())
            return luxon_1.DateTime
                .local(this.value.year, this.value.month, this.value.day, 0, 0, 0)
                .toLocaleString(luxon_1.DateTime.DATE_MED);
        else
            return "";
    }
    static inputIsWellFormed(input, options) {
        try {
            let year = parseInt(input.substr(0, 4));
            let month = parseInt(input.substr(5, 2));
            let day = parseInt(input.substr(8, 2));
            return (input.length == 10 &&
                input.substr(4, 1) == "-" &&
                input.substr(7, 1) == "-" &&
                year > 0 &&
                month >= 1 &&
                month <= 12 &&
                day > 0 &&
                day <= 31);
        }
        catch (e) {
            return false;
        }
    }
    static processInput(input, options) {
        const dateComponents = input.split("-").map(c => parseInt(c));
        return {
            year: dateComponents[0],
            month: dateComponents[1],
            day: dateComponents[2]
        };
    }
    static fromInput(input, options) {
        const processedInput = StupidDate.inputIsWellFormed(input, options)
            ? StupidDate.processInput(input, options)
            : null;
        return new StupidDate(processedInput, input, options);
    }
    toInput() {
        return this.isNil() ? this.rawValue : this.toIso8601();
    }
    static selectIsWellFormed(input, options) {
        try {
            let year = parseInt(input.substr(0, 4));
            let month = parseInt(input.substr(5, 2));
            let day = parseInt(input.substr(8, 2));
            return (input.length == 10 &&
                input.substr(4, 1) == "-" &&
                input.substr(7, 1) == "-" &&
                year > 0 &&
                month >= 1 &&
                month <= 12 &&
                day > 0 &&
                day <= 31);
        }
        catch (e) {
            return false;
        }
    }
    static processSelect(input, options) {
        const dateComponents = input.split("-").map(c => parseInt(c));
        return {
            year: dateComponents[0],
            month: dateComponents[1],
            day: dateComponents[2]
        };
    }
    static fromSelect(input, options) {
        const processedInput = StupidDate.selectIsWellFormed(input, options)
            ? StupidDate.processSelect(input, options)
            : null;
        return new StupidDate(processedInput, input, options);
    }
    toSelect() {
        return this.isNil() ? this.rawValue : this.toIso8601();
    }
}
exports.default = StupidDate;
//# sourceMappingURL=stupidDate.js.map