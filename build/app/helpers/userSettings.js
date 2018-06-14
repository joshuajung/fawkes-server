"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const advancedDataType_1 = require("../types/advancedDataTypes/advancedDataType");
exports.coreUserSettings = [
    { key: "LANGUAGE", dataType: advancedDataType_1.AdvancedDataType.Varchar, defaultValue: "en-us" }
];
exports.parseFromDb = (app, rawValueRow, userSettingDefinition) => {
    const constructor = advancedDataType_1.advancedDataConstructor(userSettingDefinition.dataType);
    let valueToLoad;
    if (!rawValueRow)
        valueToLoad = userSettingDefinition.defaultValue;
    else {
        switch (userSettingDefinition.dataType) {
            case advancedDataType_1.AdvancedDataType.Varchar:
                valueToLoad = rawValueRow["settingValueVarchar"];
                break;
            case advancedDataType_1.AdvancedDataType.Text:
                valueToLoad = rawValueRow["settingValueText"];
                break;
            case advancedDataType_1.AdvancedDataType.Boolean:
                valueToLoad = rawValueRow["settingValueBoolean"];
                break;
            case advancedDataType_1.AdvancedDataType.Integer:
                valueToLoad = rawValueRow["settingValueInteger"];
                break;
            case advancedDataType_1.AdvancedDataType.Float:
                valueToLoad = rawValueRow["settingValueFloat"];
                break;
        }
    }
    return constructor.fromDb(app, valueToLoad, userSettingDefinition.dataTypeOptions);
};
//# sourceMappingURL=userSettings.js.map