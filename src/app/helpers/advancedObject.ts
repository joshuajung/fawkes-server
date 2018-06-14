// External imports
import { flattenDeep, isArray, isNil } from "lodash"

// Internal imports
import {
  App,
  Request,
  Response,
  AdvancedQuery,
  AdvancedQueryVariable
} from "../types"
import queries from "../database/queries"
import {
  AdvancedDataType,
  AdvancedData,
  AdvancedDataTypeOptions,
  advancedDataConstructor,
  sendAdvancedData,
  Varchar
} from "../types/advancedDataTypes/advancedDataType"
import * as validateHelper from "./validate"
import * as cryptoHelper from "./crypto"

// Interfaces and types
export interface AdvancedObjectPropertyPrivate {
  name: string
  titleLocalizations: Array<AdvancedObjectPropertyTitleLocalization>
  dataType: AdvancedDataType
  dataTypeOptions?: AdvancedDataTypeOptions
  databaseColumnName: string
  validate?: (value: AdvancedData) => boolean
  default?: () => AdvancedData
  orderByAllowed: boolean
  filterByAllowed: boolean
  manualEditAllowed: boolean
  showInDefaultList: boolean
}
export interface AdvancedObjectPropertyPublic {
  name: string
  titleLocalizations: Array<AdvancedObjectPropertyTitleLocalization>
  dataType: AdvancedDataType
  dataTypeOptions?: AdvancedDataTypeOptions
  orderByAllowed: boolean
  filterByAllowed: boolean
  manualEditAllowed: boolean
  showInDefaultList: boolean
}
export interface AdvancedObjectOptions {
  objectName: string
  databaseTableName: string
  apiPath: string
  properties: Array<AdvancedObjectPropertyPrivate>
  titleLocalizations: Array<AdvancedObjectTitleLocalization>
  readableIdentifier: (record) => string
  defaultListOptions?: AdvancedObjectGetRecordListOptions
  lookedUpBy?: Array<AdvancedObjectLookedUpBy>
}
export interface AdvancedObjectGetRecordListOptions {
  filterBy?: Array<AdvancedObjectGetRecordListFilterByOption>
  orderBy?: Array<AdvancedObjectGetRecordListOrderByOption>
  pageIndex?: number
  pageSize?: number
}
export interface AdvancedObjectGetRecordListOrderByOption {
  propertyName: string
  descending?: boolean
}
export interface AdvancedObjectGetRecordListFilterByOption {
  propertyName: string
  operator: AdvancedObjectGetRecordListFilterByOperatorKey
  constants: Array<AdvancedData>
}
export enum AdvancedObjectGetRecordListFilterByOperatorKey {
  Like = "Like",
  Equals = "Equals",
  Between = "Between",
  IsSet = "IsSet",
  IsNotSet = "IsNotSet"
}
export interface AdvancedObjectGetRecordListFilterByOperator {
  key: AdvancedObjectGetRecordListFilterByOperatorKey
  query: string
  constantCount: number
  availableFor: Array<AdvancedDataType>
}
export const AdvancedObjectGetRecordListFilterByOperators: Array<
  AdvancedObjectGetRecordListFilterByOperator
> = [
  {
    key: AdvancedObjectGetRecordListFilterByOperatorKey.Like,
    query: "LIKE CONCAT('%',?,'%')",
    constantCount: 1,
    availableFor: [AdvancedDataType.Varchar]
  },
  {
    key: AdvancedObjectGetRecordListFilterByOperatorKey.Equals,
    query: "= ?",
    constantCount: 1,
    availableFor: [
      AdvancedDataType.Varchar,
      AdvancedDataType.Integer,
      AdvancedDataType.Float,
      AdvancedDataType.Boolean,
      AdvancedDataType.DateTime,
      AdvancedDataType.StupidDate,
      AdvancedDataType.Lookup
    ]
  },
  {
    key: AdvancedObjectGetRecordListFilterByOperatorKey.Between,
    query: "BETWEEN ? AND ?",
    constantCount: 2,
    availableFor: [
      AdvancedDataType.Varchar,
      AdvancedDataType.Integer,
      AdvancedDataType.Float,
      AdvancedDataType.DateTime,
      AdvancedDataType.StupidDate
    ]
  },
  {
    key: AdvancedObjectGetRecordListFilterByOperatorKey.IsSet,
    query: "IS NOT NULL",
    constantCount: 0,
    availableFor: [
      AdvancedDataType.Varchar,
      AdvancedDataType.Text,
      AdvancedDataType.Integer,
      AdvancedDataType.Float,
      AdvancedDataType.Boolean,
      AdvancedDataType.DateTime,
      AdvancedDataType.StupidDate,
      AdvancedDataType.Lookup
    ]
  },
  {
    key: AdvancedObjectGetRecordListFilterByOperatorKey.IsNotSet,
    query: "IS NULL",
    constantCount: 0,
    availableFor: [
      AdvancedDataType.Varchar,
      AdvancedDataType.Text,
      AdvancedDataType.Integer,
      AdvancedDataType.Float,
      AdvancedDataType.Boolean,
      AdvancedDataType.DateTime,
      AdvancedDataType.StupidDate,
      AdvancedDataType.Lookup
    ]
  }
]
export interface AdvancedObjectGetRecordListResult {
  records: Array<string>
  properties: Array<AdvancedObjectPropertyPublic>
  count: number
  options: AdvancedObjectGetRecordListOptions
}
export interface AdvancedObjectTitleLocalization {
  languageCode: string
  titleSingular: string
  titlePlural: string
}
export interface AdvancedObjectPropertyTitleLocalization {
  languageCode: string
  title: string
}
export interface AdvancedObjectLookedUpBy {
  foreignObjectName: string
  foreignPropertyName: string
}

// Core
export class AdvancedObject {
  objectName: string
  databaseTableName: string
  apiPath: string
  properties: Array<AdvancedObjectPropertyPrivate>
  titleLocalizations: Array<AdvancedObjectTitleLocalization>
  getReadableIdentifier: (record) => string
  defaultListOptions: AdvancedObjectGetRecordListOptions
  lookedUpBy: Array<AdvancedObjectLookedUpBy>

  constructor(options: AdvancedObjectOptions) {
    this.objectName = options.objectName
    this.titleLocalizations = options.titleLocalizations
    this.databaseTableName = options.databaseTableName
    this.apiPath = options.apiPath
    this.getReadableIdentifier = options.readableIdentifier
    this.lookedUpBy = options.lookedUpBy || []
    const idProperty: AdvancedObjectPropertyPrivate = {
      name: "id",
      titleLocalizations: [{ languageCode: "en-us", title: "ID" }],
      dataType: AdvancedDataType.Varchar,
      databaseColumnName: "id",
      orderByAllowed: false,
      filterByAllowed: false,
      manualEditAllowed: false,
      showInDefaultList: false,
      validate: value => validateHelper.isGuid(value.toDb())
    }
    this.properties = [idProperty, ...options.properties]
    this.defaultListOptions = {
      filterBy: [],
      orderBy: [],
      pageIndex: 0,
      pageSize: 10,
      ...options.defaultListOptions
    }
  }

  // Helpers
  getTitleSingular(
    languageCode: string,
    capitalizeFirstLetter: boolean = false
  ): string {
    let title = this.titleLocalizations.find(
      t => t.languageCode === languageCode
    ).titleSingular
    if (capitalizeFirstLetter)
      title = title.substr(0, 1).toUpperCase() + title.substr(1)
    return title
  }
  getTitlePlural(
    languageCode: string,
    capitalizeFirstLetter: boolean = false
  ): string {
    let title = this.titleLocalizations.find(
      t => t.languageCode === languageCode
    ).titlePlural
    if (capitalizeFirstLetter)
      title = title.substr(0, 1).toUpperCase() + title.substr(1)
    return title
  }
  getPropertyTitle(propertyName: string, languageCode: string): string {
    return this.getProperty(propertyName).titleLocalizations.find(
      t => t.languageCode === languageCode
    ).title
  }
  getProperty(propertyName: string): AdvancedObjectPropertyPrivate {
    return this.properties.find(f => f.name === propertyName) || null
  }
  getIdProperty() {
    return this.getProperty("id")
  }
  getPropertiesPublic(): Array<AdvancedObjectPropertyPublic> {
    return this.properties.map(propertyPrivate => ({
      name: propertyPrivate.name,
      titleLocalizations: propertyPrivate.titleLocalizations,
      dataType: propertyPrivate.dataType,
      dataTypeOptions: propertyPrivate.dataTypeOptions,
      orderByAllowed: propertyPrivate.orderByAllowed,
      filterByAllowed: propertyPrivate.filterByAllowed,
      manualEditAllowed: propertyPrivate.manualEditAllowed,
      showInDefaultList: propertyPrivate.showInDefaultList
    }))
  }
  getPropertiesManualEditAllowed(): Array<AdvancedObjectPropertyPrivate> {
    return this.properties.filter(property => property.manualEditAllowed)
  }

  // Methods
  async getRecordList(
    app: App,
    options: AdvancedObjectGetRecordListOptions = {}
  ): Promise<AdvancedObjectGetRecordListResult> {
    // Merge Options with default options and unwrap
    options = { ...this.defaultListOptions, ...options }
    // Prepare query arrays
    const selectQuery: AdvancedQuery = {
      components: [],
      variables: []
    }
    const countQuery: AdvancedQuery = {
      components: [],
      variables: []
    }
    // Add base query
    selectQuery.components.push(
      "SELECT " +
        this.getIdProperty().databaseColumnName +
        " FROM " +
        this.databaseTableName
    )
    countQuery.components.push(
      "SELECT COUNT(" +
        this.getIdProperty().databaseColumnName +
        ") AS 'count' FROM " +
        this.databaseTableName
    )
    // Add filter
    const queryComponentFilterBy = this.createGetRecordListQueryComponentFilterBy(
      options.filterBy
    )
    selectQuery.components.push(queryComponentFilterBy.queryComponent)
    selectQuery.variables = [
      ...selectQuery.variables,
      ...queryComponentFilterBy.queryVariables
    ]
    countQuery.components.push(queryComponentFilterBy.queryComponent)
    countQuery.variables = [
      ...countQuery.variables,
      ...queryComponentFilterBy.queryVariables
    ]
    // Add order
    const queryComponentOrderBy = this.createGetRecordListQueryComponentOrderBy(
      options.orderBy
    )
    selectQuery.components.push(queryComponentOrderBy.queryComponent)
    selectQuery.variables = [
      ...selectQuery.variables,
      ...queryComponentOrderBy.queryVariables
    ]
    // Add limit
    if (options.pageSize) {
      selectQuery.components.push("LIMIT")
      selectQuery.components.push(options.pageSize.toString())
    }
    // Add offset
    if (options.pageSize && options.pageIndex) {
      selectQuery.components.push("OFFSET")
      selectQuery.components.push(
        (options.pageIndex * options.pageSize).toString()
      )
    }
    // GET DATA
    const selectResult = await app.db.execute(
      queries.global.fromComponents(selectQuery.components),
      selectQuery.variables
    )
    const countResult = await app.db.execute(
      queries.global.fromComponents(countQuery.components),
      countQuery.variables
    )
    // Parse
    const parsedResult: Array<string> = selectResult[0].map(
      rawRecord => rawRecord[this.getIdProperty().databaseColumnName]
    )
    return {
      records: parsedResult,
      properties: this.getPropertiesPublic(),
      count: parseInt(countResult[0][0]["count"]),
      options: options
    }
  }
  createGetRecordListQueryComponentFilterBy(
    conditions: Array<AdvancedObjectGetRecordListFilterByOption>
  ): { queryComponent: string; queryVariables: Array<AdvancedQueryVariable> } {
    const filterByPropertiesSanitized = conditions.map(f => {
      const property = this.getProperty(f.propertyName)
      if (!property) throw Error("INVALID_INPUT")
      if (!property.filterByAllowed) throw Error("INVALID_INPUT")
      const operator = AdvancedObjectGetRecordListFilterByOperators.find(
        a => a.key == f.operator
      )
      if (!operator) throw Error("INVALID_INPUT")
      if (
        !(operator.constantCount === 0 && !f.constants) &&
        f.constants.length !== operator.constantCount
      )
        throw Error("INVALID_INPUT")
      return { property, operator, values: f.constants }
    })
    if (filterByPropertiesSanitized.length == 0)
      return { queryComponent: "", queryVariables: [] }
    return {
      queryComponent:
        "WHERE " +
        filterByPropertiesSanitized
          .map(f => f.property.databaseColumnName + " " + f.operator.query)
          .join(" AND "),
      queryVariables: flattenDeep(
        filterByPropertiesSanitized
          .map(f =>
            f.values.map(v => {
              return v.toDb()
            })
          )
          .filter(v => v)
      ) as Array<AdvancedQueryVariable>
    }
  }
  createGetRecordListQueryComponentOrderBy(
    properties: Array<AdvancedObjectGetRecordListOrderByOption>
  ): { queryComponent: string; queryVariables: Array<AdvancedQueryVariable> } {
    const orderByPropertiesSanitized = properties.map(f => {
      const property = this.getProperty(f.propertyName)
      if (!property) throw Error("INVALID_INPUT")
      if (!property.orderByAllowed) throw Error("INVALID_INPUT")
      return { property, descending: f.descending }
    })
    if (orderByPropertiesSanitized.length == 0)
      return { queryComponent: "", queryVariables: [] }
    return {
      queryComponent:
        "ORDER BY " +
        orderByPropertiesSanitized
          .map(
            f => f.property.databaseColumnName + (f.descending ? " DESC" : "")
          )
          .join(", "),
      queryVariables: []
    }
  }

  async getRecordDetails(app: App, recordIds: Array<string> = []) {
    // Prepare query arrays
    const selectQuery: AdvancedQuery = {
      components: [],
      variables: []
    }
    // Add base query
    const baseQuery =
      "SELECT " +
      this.properties.map(property => property.databaseColumnName).join(", ") +
      " FROM " +
      this.databaseTableName
    selectQuery.components.push(baseQuery)
    // Add filter
    selectQuery.components.push("WHERE")
    selectQuery.components.push(
      recordIds
        .map(id => this.getIdProperty().databaseColumnName + "=?")
        .join(" OR ")
    )
    selectQuery.variables.push(...recordIds)
    // GET DATA
    const selectResult = await app.db.execute(
      queries.global.fromComponents(selectQuery.components),
      selectQuery.variables
    )
    // Parse
    const parsedResult = selectResult[0].map(rawItem => {
      const parsedItem = {}

      this.properties.forEach(propertyDefinition => {
        const constructor = advancedDataConstructor(propertyDefinition.dataType)
        parsedItem[propertyDefinition.name] = constructor.fromDb(
          app,
          rawItem[propertyDefinition.databaseColumnName],
          propertyDefinition.dataTypeOptions
        )
      })
      return parsedItem
    })
    return {
      records: parsedResult,
      properties: this.getPropertiesPublic()
    }
  }

  async setRecords(app: App, body: any) {
    const results = await Promise.all(
      body.map(async recordBody => {
        if (isNil(recordBody.id)) return this.createRecord(app, recordBody)
        else return this.updateRecord(app, recordBody)
      })
    )
    return results
  }

  async createRecord(app: App, body: any) {
    const id = cryptoHelper.createGuid()
    // Prepare query arrays
    const query: AdvancedQuery = {
      components: [],
      variables: []
    }
    // Insert verb
    query.components.push("INSERT INTO")
    query.components.push(this.databaseTableName)
    query.components.push("SET")
    // Insert Properties to be updated
    const toBeSetPropertyNames = []
    const toBeSetPropertyValues = []
    this.properties.forEach(propertyDefinition => {
      // Load raw value from body
      const rawValue = body[propertyDefinition.name]
      // Prepare processed value variable
      let processedValue: AdvancedData = undefined
      // If data is provided, use it - otherwise use default
      if (
        typeof rawValue !== "undefined" &&
        propertyDefinition.manualEditAllowed
      ) {
        // Create AddvancedData from raw input
        processedValue = rawValue
      } else if (propertyDefinition.name === this.getIdProperty().name) {
        processedValue = new Varchar(id)
      } else if (propertyDefinition.default) {
        processedValue = propertyDefinition.default()
      }
      // Validate input/default
      if (propertyDefinition.validate) {
        if (!propertyDefinition.validate(processedValue))
          throw Error("INVALID_INPUT")
      }
      // Push to arrays if data available
      if (processedValue) {
        toBeSetPropertyNames.push(propertyDefinition.databaseColumnName + "=?")
        toBeSetPropertyValues.push(processedValue.toDb())
      }
    })
    query.components.push(toBeSetPropertyNames.join(","))
    query.variables.push(...toBeSetPropertyValues)

    await app.db.execute(
      queries.global.fromComponents(query.components),
      query.variables
    )
    // Return
    return id
  }

  async updateRecord(app: App, body: any) {
    const existsUniquely = await app.db.execute(
      queries.global.existsUniquely(
        this.databaseTableName,
        this.getIdProperty().databaseColumnName
      ),
      [body.id]
    )
    if (!existsUniquely[0][0]["result"]) throw Error("INVALID_INPUT")
    // Prepare query arrays
    const query: AdvancedQuery = {
      components: [],
      variables: []
    }
    // Insert verb
    query.components.push("UPDATE")
    query.components.push(this.databaseTableName)
    query.components.push("SET")
    // Insert Properties to be updated
    const toBeSetPropertyNames = []
    const toBeSetPropertyValues = []
    let updatedPropertiesCount = 0
    this.getPropertiesManualEditAllowed().forEach(propertyDefinition => {
      // Load raw value from body
      const rawValue = body[propertyDefinition.name]
      // Prepare processed value variable
      let processedValue: AdvancedData = undefined
      // If data is provided, use it - otherwise do nothing
      if (typeof rawValue !== "undefined") {
        // Create AddvancedData from raw input
        processedValue = rawValue
      }
      if (processedValue) {
        // Validate input, but only if data was given
        if (propertyDefinition.validate) {
          if (!propertyDefinition.validate(processedValue))
            throw Error("INVALID_INPUT")
        }
        // Push to arrays if data available
        toBeSetPropertyNames.push(propertyDefinition.databaseColumnName + "=?")
        toBeSetPropertyValues.push(processedValue.toDb())
        updatedPropertiesCount++
      }
    })
    query.components.push(toBeSetPropertyNames.join(","))
    query.variables.push(...toBeSetPropertyValues)

    // Insert filter
    query.components.push(
      "WHERE " + this.getIdProperty().databaseColumnName + "=?"
    )
    query.variables.push(body.id)
    // Run (but only if there is data to be filed)
    if (updatedPropertiesCount > 0) {
      await app.db.execute(
        queries.global.fromComponents(query.components),
        query.variables
      )
    }
    // Return
    const result = body.id.value
    return result
  }

  // Routes
  registerAuthRoutes(app: App) {
    // getRecordList
    app.post(
      this.apiPath + "/getRecordList",
      async (req: Request, res: Response, next: Function) => {
        req.accessGranted = !!req.userIsLoggedIn
        next()
      }
    )
    // getRecordDetails
    app.post(
      this.apiPath + "/getRecordDetails",
      async (req: Request, res: Response, next: Function) => {
        req.accessGranted = !!req.userIsLoggedIn
        next()
      }
    )
    // setRecords
    app.post(
      this.apiPath + "/setRecords",
      async (req: Request, res: Response, next: Function) => {
        req.accessGranted = !!req.userIsLoggedIn
        next()
      }
    )
  }
  registerExeRoutes(app: App) {
    // getRecordList
    app.post(
      this.apiPath + "/getRecordList",
      async (req: Request, res: Response, next: Function) => {
        try {
          // Sanitize and validate input
          const options = req.body[
            "options"
          ] as AdvancedObjectGetRecordListOptions
          if (options && typeof options !== "object")
            throw Error("INVALID_INPUT")
          // Query and return
          const result = await this.getRecordList(app, options)
          sendAdvancedData(res.status(200), {
            code: "ADVANCED_OBJECT_GET_RECORD_LIST_RESULT",
            result: result
          })
        } catch (error) {
          next(error)
        }
      }
    )
    // getRecordDetails
    app.post(
      this.apiPath + "/getRecordDetails",
      async (req: Request, res: Response, next: Function) => {
        try {
          // Sanitize and validate input
          const ids = req.body["recordIds"]
          if (!ids || !isArray(ids) || ids.length == 0)
            throw Error("INVALID_INPUT")
          // Query and return
          const result = await this.getRecordDetails(app, ids)
          sendAdvancedData(res.status(200), {
            code: "ADVANCED_OBJECT_GET_RECORD_DETAILS_RESULT",
            result: result
          })
        } catch (error) {
          next(error)
        }
      }
    )
    // setRecords
    app.post(
      this.apiPath + "/setRecords",
      async (req: Request, res: Response, next: Function) => {
        try {
          // Sanitize and validate input
          const records = req.body["records"]
          if (!records || !isArray(records)) throw Error("INVALID_INPUT")
          // Query and return
          const result = await this.setRecords(app, records)
          sendAdvancedData(res.status(200), {
            code: "ADVANCED_OBJECT_SET_RECORDS_RESULT",
            result: result
          })
        } catch (error) {
          next(error)
        }
      }
    )
  }
}
