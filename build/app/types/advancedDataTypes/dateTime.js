"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const luxon_1 = require("luxon");
const lodash_1 = require("lodash");
const advancedDataType_1 = require("./advancedDataType");
class DateTime {
    constructor(value = null, rawValue = "", options = {}) {
        this.isAdvancedData = true;
        this.type = advancedDataType_1.AdvancedDataType.DateTime;
        this.value = value;
        this.rawValue = rawValue;
        this.options = options;
    }
    isNil() {
        return lodash_1.isNil(this.value);
    }
    static fromDb(app, dbDate, options) {
        if (!lodash_1.isNil(dbDate)) {
            if (dbDate.length == 19) {
                return new DateTime(new Date(dbDate.substr(0, 10) + "T" + dbDate.substr(11, 8) + "Z"), undefined, options);
            }
            else if (dbDate.length == 10) {
                return new DateTime(new Date(dbDate.substr(0, 10) + "T00:00:00Z"), undefined, options);
            }
            else
                return new DateTime(null, undefined, options);
        }
        else
            return new DateTime(null, undefined, options);
    }
    toDb() {
        if (this.isNil())
            return null;
        else {
            const isoString = this.toIso();
            return isoString.substr(0, 10) + " " + isoString.substr(11, 8);
        }
    }
    static fromJsonValue(jsonDate, options) {
        if (!lodash_1.isNil(jsonDate))
            return new DateTime(new Date(jsonDate), undefined, options);
        else
            return new DateTime(null, undefined, options);
    }
    toJsonValue() {
        return !lodash_1.isNil(this.value) ? this.value.toISOString() : null;
    }
    toString() {
        return this.toLocale();
    }
    static fromIso8601(iso8601Date, options) {
        if (!validator.isISO8601(iso8601Date)) {
            const error = Error("DateTime could not be initialized with incorrect input " + iso8601Date);
            throw error;
        }
        return new DateTime(new Date(luxon_1.DateTime.fromISO(iso8601Date)), undefined, options);
    }
    toIso() {
        return this.value.toISOString();
    }
    toLocale() {
        if (!this.isNil())
            return luxon_1.DateTime
                .fromISO(this.value.toISOString())
                .toLocaleString(luxon_1.DateTime.DATETIME_MED);
        else
            return "";
    }
    static inputIsWellFormed(input, options) {
        try {
            let year = parseInt(input.substr(0, 4));
            let month = parseInt(input.substr(5, 2));
            let day = parseInt(input.substr(8, 2));
            let hours = parseInt(input.substr(11, 2));
            let minutes = parseInt(input.substr(14, 2));
            return (input.length == 16 &&
                input.substr(4, 1) == "-" &&
                input.substr(7, 1) == "-" &&
                input.substr(10, 1) == "T" &&
                input.substr(13, 1) == ":" &&
                year > 0 &&
                month >= 1 &&
                month <= 12 &&
                day > 0 &&
                day <= 31 &&
                hours >= 0 &&
                hours <= 24 &&
                minutes >= 0 &&
                minutes <= 59);
        }
        catch (e) {
            return false;
        }
    }
    static processInput(input, options) {
        return new Date(luxon_1.DateTime.fromISO(input));
    }
    static fromInput(input, options) {
        const processedInput = DateTime.inputIsWellFormed(input, options)
            ? DateTime.processInput(input, options)
            : null;
        return new DateTime(processedInput, input, options);
    }
    toInput() {
        if (this.isNil())
            return this.rawValue;
        const luxonDate = luxon_1.DateTime.fromISO(this.value.toISOString());
        return luxonDate.toFormat("yyyy-MM-dd") + "T" + luxonDate.toFormat("T");
    }
    static selectIsWellFormed(input, options) {
        try {
            let year = parseInt(input.substr(0, 4));
            let month = parseInt(input.substr(5, 2));
            let day = parseInt(input.substr(8, 2));
            let hours = parseInt(input.substr(11, 2));
            let minutes = parseInt(input.substr(14, 2));
            return (input.length == 16 &&
                input.substr(4, 1) == "-" &&
                input.substr(7, 1) == "-" &&
                input.substr(10, 1) == "T" &&
                input.substr(13, 1) == ":" &&
                year > 0 &&
                month >= 1 &&
                month <= 12 &&
                day > 0 &&
                day <= 31 &&
                hours >= 0 &&
                hours <= 24 &&
                minutes >= 0 &&
                minutes <= 59);
        }
        catch (e) {
            return false;
        }
    }
    static processSelect(input, options) {
        return new Date(luxon_1.DateTime.fromISO(input));
    }
    static fromSelect(input, options) {
        const processedInput = DateTime.selectIsWellFormed(input, options)
            ? DateTime.processSelect(input, options)
            : null;
        return new DateTime(processedInput, input, options);
    }
    toSelect() {
        if (this.isNil())
            return this.rawValue;
        const luxonDate = luxon_1.DateTime.fromISO(this.value.toISOString());
        return luxonDate.toFormat("yyyy-MM-dd") + "T" + luxonDate.toFormat("T");
    }
}
exports.default = DateTime;
//# sourceMappingURL=dateTime.js.map