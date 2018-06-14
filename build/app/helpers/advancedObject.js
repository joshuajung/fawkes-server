"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const queries_1 = require("../database/queries");
const advancedDataType_1 = require("../types/advancedDataTypes/advancedDataType");
const validateHelper = require("./validate");
const cryptoHelper = require("./crypto");
var AdvancedObjectGetRecordListFilterByOperatorKey;
(function (AdvancedObjectGetRecordListFilterByOperatorKey) {
    AdvancedObjectGetRecordListFilterByOperatorKey["Like"] = "Like";
    AdvancedObjectGetRecordListFilterByOperatorKey["Equals"] = "Equals";
    AdvancedObjectGetRecordListFilterByOperatorKey["Between"] = "Between";
    AdvancedObjectGetRecordListFilterByOperatorKey["IsSet"] = "IsSet";
    AdvancedObjectGetRecordListFilterByOperatorKey["IsNotSet"] = "IsNotSet";
})(AdvancedObjectGetRecordListFilterByOperatorKey = exports.AdvancedObjectGetRecordListFilterByOperatorKey || (exports.AdvancedObjectGetRecordListFilterByOperatorKey = {}));
exports.AdvancedObjectGetRecordListFilterByOperators = [
    {
        key: AdvancedObjectGetRecordListFilterByOperatorKey.Like,
        query: "LIKE CONCAT('%',?,'%')",
        constantCount: 1,
        availableFor: [advancedDataType_1.AdvancedDataType.Varchar]
    },
    {
        key: AdvancedObjectGetRecordListFilterByOperatorKey.Equals,
        query: "= ?",
        constantCount: 1,
        availableFor: [
            advancedDataType_1.AdvancedDataType.Varchar,
            advancedDataType_1.AdvancedDataType.Integer,
            advancedDataType_1.AdvancedDataType.Float,
            advancedDataType_1.AdvancedDataType.Boolean,
            advancedDataType_1.AdvancedDataType.DateTime,
            advancedDataType_1.AdvancedDataType.StupidDate,
            advancedDataType_1.AdvancedDataType.Lookup
        ]
    },
    {
        key: AdvancedObjectGetRecordListFilterByOperatorKey.Between,
        query: "BETWEEN ? AND ?",
        constantCount: 2,
        availableFor: [
            advancedDataType_1.AdvancedDataType.Varchar,
            advancedDataType_1.AdvancedDataType.Integer,
            advancedDataType_1.AdvancedDataType.Float,
            advancedDataType_1.AdvancedDataType.DateTime,
            advancedDataType_1.AdvancedDataType.StupidDate
        ]
    },
    {
        key: AdvancedObjectGetRecordListFilterByOperatorKey.IsSet,
        query: "IS NOT NULL",
        constantCount: 0,
        availableFor: [
            advancedDataType_1.AdvancedDataType.Varchar,
            advancedDataType_1.AdvancedDataType.Text,
            advancedDataType_1.AdvancedDataType.Integer,
            advancedDataType_1.AdvancedDataType.Float,
            advancedDataType_1.AdvancedDataType.Boolean,
            advancedDataType_1.AdvancedDataType.DateTime,
            advancedDataType_1.AdvancedDataType.StupidDate,
            advancedDataType_1.AdvancedDataType.Lookup
        ]
    },
    {
        key: AdvancedObjectGetRecordListFilterByOperatorKey.IsNotSet,
        query: "IS NULL",
        constantCount: 0,
        availableFor: [
            advancedDataType_1.AdvancedDataType.Varchar,
            advancedDataType_1.AdvancedDataType.Text,
            advancedDataType_1.AdvancedDataType.Integer,
            advancedDataType_1.AdvancedDataType.Float,
            advancedDataType_1.AdvancedDataType.Boolean,
            advancedDataType_1.AdvancedDataType.DateTime,
            advancedDataType_1.AdvancedDataType.StupidDate,
            advancedDataType_1.AdvancedDataType.Lookup
        ]
    }
];
class AdvancedObject {
    constructor(options) {
        this.objectName = options.objectName;
        this.titleLocalizations = options.titleLocalizations;
        this.databaseTableName = options.databaseTableName;
        this.apiPath = options.apiPath;
        this.getReadableIdentifier = options.readableIdentifier;
        this.lookedUpBy = options.lookedUpBy || [];
        const idProperty = {
            name: "id",
            titleLocalizations: [{ languageCode: "en-us", title: "ID" }],
            dataType: advancedDataType_1.AdvancedDataType.Varchar,
            databaseColumnName: "id",
            orderByAllowed: false,
            filterByAllowed: false,
            manualEditAllowed: false,
            showInDefaultList: false,
            validate: value => validateHelper.isGuid(value.toDb())
        };
        this.properties = [idProperty, ...options.properties];
        this.defaultListOptions = Object.assign({ filterBy: [], orderBy: [], pageIndex: 0, pageSize: 10 }, options.defaultListOptions);
    }
    getTitleSingular(languageCode, capitalizeFirstLetter = false) {
        let title = this.titleLocalizations.find(t => t.languageCode === languageCode).titleSingular;
        if (capitalizeFirstLetter)
            title = title.substr(0, 1).toUpperCase() + title.substr(1);
        return title;
    }
    getTitlePlural(languageCode, capitalizeFirstLetter = false) {
        let title = this.titleLocalizations.find(t => t.languageCode === languageCode).titlePlural;
        if (capitalizeFirstLetter)
            title = title.substr(0, 1).toUpperCase() + title.substr(1);
        return title;
    }
    getPropertyTitle(propertyName, languageCode) {
        return this.getProperty(propertyName).titleLocalizations.find(t => t.languageCode === languageCode).title;
    }
    getProperty(propertyName) {
        return this.properties.find(f => f.name === propertyName) || null;
    }
    getIdProperty() {
        return this.getProperty("id");
    }
    getPropertiesPublic() {
        return this.properties.map(propertyPrivate => ({
            name: propertyPrivate.name,
            titleLocalizations: propertyPrivate.titleLocalizations,
            dataType: propertyPrivate.dataType,
            dataTypeOptions: propertyPrivate.dataTypeOptions,
            orderByAllowed: propertyPrivate.orderByAllowed,
            filterByAllowed: propertyPrivate.filterByAllowed,
            manualEditAllowed: propertyPrivate.manualEditAllowed,
            showInDefaultList: propertyPrivate.showInDefaultList
        }));
    }
    getPropertiesManualEditAllowed() {
        return this.properties.filter(property => property.manualEditAllowed);
    }
    getRecordList(app, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            options = Object.assign({}, this.defaultListOptions, options);
            const selectQuery = {
                components: [],
                variables: []
            };
            const countQuery = {
                components: [],
                variables: []
            };
            selectQuery.components.push("SELECT " +
                this.getIdProperty().databaseColumnName +
                " FROM " +
                this.databaseTableName);
            countQuery.components.push("SELECT COUNT(" +
                this.getIdProperty().databaseColumnName +
                ") AS 'count' FROM " +
                this.databaseTableName);
            const queryComponentFilterBy = this.createGetRecordListQueryComponentFilterBy(options.filterBy);
            selectQuery.components.push(queryComponentFilterBy.queryComponent);
            selectQuery.variables = [
                ...selectQuery.variables,
                ...queryComponentFilterBy.queryVariables
            ];
            countQuery.components.push(queryComponentFilterBy.queryComponent);
            countQuery.variables = [
                ...countQuery.variables,
                ...queryComponentFilterBy.queryVariables
            ];
            const queryComponentOrderBy = this.createGetRecordListQueryComponentOrderBy(options.orderBy);
            selectQuery.components.push(queryComponentOrderBy.queryComponent);
            selectQuery.variables = [
                ...selectQuery.variables,
                ...queryComponentOrderBy.queryVariables
            ];
            if (options.pageSize) {
                selectQuery.components.push("LIMIT");
                selectQuery.components.push(options.pageSize.toString());
            }
            if (options.pageSize && options.pageIndex) {
                selectQuery.components.push("OFFSET");
                selectQuery.components.push((options.pageIndex * options.pageSize).toString());
            }
            const selectResult = yield app.db.execute(queries_1.default.global.fromComponents(selectQuery.components), selectQuery.variables);
            const countResult = yield app.db.execute(queries_1.default.global.fromComponents(countQuery.components), countQuery.variables);
            const parsedResult = selectResult[0].map(rawRecord => rawRecord[this.getIdProperty().databaseColumnName]);
            return {
                records: parsedResult,
                properties: this.getPropertiesPublic(),
                count: parseInt(countResult[0][0]["count"]),
                options: options
            };
        });
    }
    createGetRecordListQueryComponentFilterBy(conditions) {
        const filterByPropertiesSanitized = conditions.map(f => {
            const property = this.getProperty(f.propertyName);
            if (!property)
                throw Error("INVALID_INPUT");
            if (!property.filterByAllowed)
                throw Error("INVALID_INPUT");
            const operator = exports.AdvancedObjectGetRecordListFilterByOperators.find(a => a.key == f.operator);
            if (!operator)
                throw Error("INVALID_INPUT");
            if (!(operator.constantCount === 0 && !f.constants) &&
                f.constants.length !== operator.constantCount)
                throw Error("INVALID_INPUT");
            return { property, operator, values: f.constants };
        });
        if (filterByPropertiesSanitized.length == 0)
            return { queryComponent: "", queryVariables: [] };
        return {
            queryComponent: "WHERE " +
                filterByPropertiesSanitized
                    .map(f => f.property.databaseColumnName + " " + f.operator.query)
                    .join(" AND "),
            queryVariables: lodash_1.flattenDeep(filterByPropertiesSanitized
                .map(f => f.values.map(v => {
                return v.toDb();
            }))
                .filter(v => v))
        };
    }
    createGetRecordListQueryComponentOrderBy(properties) {
        const orderByPropertiesSanitized = properties.map(f => {
            const property = this.getProperty(f.propertyName);
            if (!property)
                throw Error("INVALID_INPUT");
            if (!property.orderByAllowed)
                throw Error("INVALID_INPUT");
            return { property, descending: f.descending };
        });
        if (orderByPropertiesSanitized.length == 0)
            return { queryComponent: "", queryVariables: [] };
        return {
            queryComponent: "ORDER BY " +
                orderByPropertiesSanitized
                    .map(f => f.property.databaseColumnName + (f.descending ? " DESC" : ""))
                    .join(", "),
            queryVariables: []
        };
    }
    getRecordDetails(app, recordIds = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectQuery = {
                components: [],
                variables: []
            };
            const baseQuery = "SELECT " +
                this.properties.map(property => property.databaseColumnName).join(", ") +
                " FROM " +
                this.databaseTableName;
            selectQuery.components.push(baseQuery);
            selectQuery.components.push("WHERE");
            selectQuery.components.push(recordIds
                .map(id => this.getIdProperty().databaseColumnName + "=?")
                .join(" OR "));
            selectQuery.variables.push(...recordIds);
            const selectResult = yield app.db.execute(queries_1.default.global.fromComponents(selectQuery.components), selectQuery.variables);
            const parsedResult = selectResult[0].map(rawItem => {
                const parsedItem = {};
                this.properties.forEach(propertyDefinition => {
                    const constructor = advancedDataType_1.advancedDataConstructor(propertyDefinition.dataType);
                    parsedItem[propertyDefinition.name] = constructor.fromDb(app, rawItem[propertyDefinition.databaseColumnName], propertyDefinition.dataTypeOptions);
                });
                return parsedItem;
            });
            return {
                records: parsedResult,
                properties: this.getPropertiesPublic()
            };
        });
    }
    setRecords(app, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(body.map((recordBody) => __awaiter(this, void 0, void 0, function* () {
                if (lodash_1.isNil(recordBody.id))
                    return this.createRecord(app, recordBody);
                else
                    return this.updateRecord(app, recordBody);
            })));
            return results;
        });
    }
    createRecord(app, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = cryptoHelper.createGuid();
            const query = {
                components: [],
                variables: []
            };
            query.components.push("INSERT INTO");
            query.components.push(this.databaseTableName);
            query.components.push("SET");
            const toBeSetPropertyNames = [];
            const toBeSetPropertyValues = [];
            this.properties.forEach(propertyDefinition => {
                const rawValue = body[propertyDefinition.name];
                let processedValue = undefined;
                if (typeof rawValue !== "undefined" &&
                    propertyDefinition.manualEditAllowed) {
                    processedValue = rawValue;
                }
                else if (propertyDefinition.name === this.getIdProperty().name) {
                    processedValue = new advancedDataType_1.Varchar(id);
                }
                else if (propertyDefinition.default) {
                    processedValue = propertyDefinition.default();
                }
                if (propertyDefinition.validate) {
                    if (!propertyDefinition.validate(processedValue))
                        throw Error("INVALID_INPUT");
                }
                if (processedValue) {
                    toBeSetPropertyNames.push(propertyDefinition.databaseColumnName + "=?");
                    toBeSetPropertyValues.push(processedValue.toDb());
                }
            });
            query.components.push(toBeSetPropertyNames.join(","));
            query.variables.push(...toBeSetPropertyValues);
            yield app.db.execute(queries_1.default.global.fromComponents(query.components), query.variables);
            return id;
        });
    }
    updateRecord(app, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const existsUniquely = yield app.db.execute(queries_1.default.global.existsUniquely(this.databaseTableName, this.getIdProperty().databaseColumnName), [body.id]);
            if (!existsUniquely[0][0]["result"])
                throw Error("INVALID_INPUT");
            const query = {
                components: [],
                variables: []
            };
            query.components.push("UPDATE");
            query.components.push(this.databaseTableName);
            query.components.push("SET");
            const toBeSetPropertyNames = [];
            const toBeSetPropertyValues = [];
            let updatedPropertiesCount = 0;
            this.getPropertiesManualEditAllowed().forEach(propertyDefinition => {
                const rawValue = body[propertyDefinition.name];
                let processedValue = undefined;
                if (typeof rawValue !== "undefined") {
                    processedValue = rawValue;
                }
                if (processedValue) {
                    if (propertyDefinition.validate) {
                        if (!propertyDefinition.validate(processedValue))
                            throw Error("INVALID_INPUT");
                    }
                    toBeSetPropertyNames.push(propertyDefinition.databaseColumnName + "=?");
                    toBeSetPropertyValues.push(processedValue.toDb());
                    updatedPropertiesCount++;
                }
            });
            query.components.push(toBeSetPropertyNames.join(","));
            query.variables.push(...toBeSetPropertyValues);
            query.components.push("WHERE " + this.getIdProperty().databaseColumnName + "=?");
            query.variables.push(body.id);
            if (updatedPropertiesCount > 0) {
                yield app.db.execute(queries_1.default.global.fromComponents(query.components), query.variables);
            }
            const result = body.id.value;
            return result;
        });
    }
    registerAuthRoutes(app) {
        app.post(this.apiPath + "/getRecordList", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            req.accessGranted = !!req.userIsLoggedIn;
            next();
        }));
        app.post(this.apiPath + "/getRecordDetails", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            req.accessGranted = !!req.userIsLoggedIn;
            next();
        }));
        app.post(this.apiPath + "/setRecords", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            req.accessGranted = !!req.userIsLoggedIn;
            next();
        }));
    }
    registerExeRoutes(app) {
        app.post(this.apiPath + "/getRecordList", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const options = req.body["options"];
                if (options && typeof options !== "object")
                    throw Error("INVALID_INPUT");
                const result = yield this.getRecordList(app, options);
                advancedDataType_1.sendAdvancedData(res.status(200), {
                    code: "ADVANCED_OBJECT_GET_RECORD_LIST_RESULT",
                    result: result
                });
            }
            catch (error) {
                next(error);
            }
        }));
        app.post(this.apiPath + "/getRecordDetails", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const ids = req.body["recordIds"];
                if (!ids || !lodash_1.isArray(ids) || ids.length == 0)
                    throw Error("INVALID_INPUT");
                const result = yield this.getRecordDetails(app, ids);
                advancedDataType_1.sendAdvancedData(res.status(200), {
                    code: "ADVANCED_OBJECT_GET_RECORD_DETAILS_RESULT",
                    result: result
                });
            }
            catch (error) {
                next(error);
            }
        }));
        app.post(this.apiPath + "/setRecords", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const records = req.body["records"];
                if (!records || !lodash_1.isArray(records))
                    throw Error("INVALID_INPUT");
                const result = yield this.setRecords(app, records);
                advancedDataType_1.sendAdvancedData(res.status(200), {
                    code: "ADVANCED_OBJECT_SET_RECORDS_RESULT",
                    result: result
                });
            }
            catch (error) {
                next(error);
            }
        }));
    }
}
exports.AdvancedObject = AdvancedObject;
//# sourceMappingURL=advancedObject.js.map