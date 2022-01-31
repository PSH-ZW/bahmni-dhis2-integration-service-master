import {ensureActiveSession, hideSpinner, showMessage} from "../../common/Actions";
import {auditLogEventDetails} from '../../common/constants';
import Ajax from "../../common/Ajax";
import auditLog from '../../common/AuditLog';

const isEmptyString = (aString) => aString === "";

const hasInvalidString = (aString) => !aString.match(/^[0-9a-zA-Z ]+$/);

export function allTables(tables = []) {
    return {
        type: 'allTables',
        allTables: tables
    };
}

export function selectedInstanceTable(table = '') {
    return {
        type: 'selectedInstanceTable',
        selectedInstanceTable: table
    };
}

export function selectedEnrollmentsTable(table = '') {
    return {
        type: 'selectedEnrollmentsTable',
        selectedEnrollmentsTable: table
    };
}

export function selectedEventTable(table = '') {
    return {
        type: 'selectedEventTable',
        selectedEventTable: table
    };
}

export function instanceTableColumns(columns = []) {
    return {
        type: 'selectedInstanceTableColumns',
        selectedInstanceTableColumns: columns
    };
}

export function eventTableColumns(columns = []) {
    return {
        type: 'selectedEventTableColumns',
        selectedEventTableColumns: columns
    };
}

export function allMappingNames(mappingNames = []) {
    return {
        type: 'allMappings',
        allMappings: mappingNames
    }
}

export function currentMapping(mappingName = "") {
    return {
        type: 'currentMapping',
        mappingName
    }
}

export function mappingJson(mappingJson = {instance: {}, enrollments: {}, event: {}}) {
    return {
        type: 'mappingJson',
        mappingJson
    }
}

export function mappingConfig(mappingConfig = {searchable: [], comparable: [], openLatestCompletedEnrollment: ""}) {
    return {
        type: 'mappingConfig',
        mappingConfig
    }
}

export function importedMappings(mappingNames = []) {
    return {
        type: 'importedMappings',
        mappingNames

    }
}

export function hasNoMappings(mappings) {
    let elementIds = Object.values(mappings);
    return elementIds.filter(element => element !== "").length === 0;
}

export function createJson(allMappings) {
    let mapping = {};
    let config = {
        searchable: [],
        comparable: []
    };
    let columnName;
    let mappingValue;

    Object.keys(allMappings).forEach((mappingType) => {
        let columnMapping = allMappings[mappingType];
        let searchableCell;
        let comparableCell;

        mapping[mappingType] = {};

        Array.from(columnMapping).forEach(mappingRow => {
            columnName = mappingRow.firstElementChild.innerHTML;
            mappingValue = mappingRow.children[1].firstElementChild.value;
            searchableCell = mappingRow.children[2];
            comparableCell = mappingRow.children[3];
            if (mappingValue) {
                mapping[mappingType][columnName] = mappingValue;
                searchableCell &&
                searchableCell.firstElementChild.checked &&
                config.searchable.push(columnName);

                comparableCell &&
                comparableCell.firstElementChild.checked &&
                config.comparable.push(columnName);
            }
        });
    });
    return {mapping, config};
}

function mappingNameIsNotUnique(state, mappingName) {
    let trimmedMappingName = mappingName.trim();
    if(trimmedMappingName === state.currentMapping) {
        return false;
    }
    return state.allMappingNames.includes(trimmedMappingName);
}

function afterOnSaveMappingSuccessResponse(dispatch, response, history) {
    dispatch(showMessage(response.data, "success"));
    dispatch(currentMapping());
    dispatch(mappingJson());
    dispatch(mappingConfig());
    dispatch(hideSpinner());
    dispatch(selectedInstanceTable());
    dispatch(selectedEnrollmentsTable());
    dispatch(selectedEventTable());

    history.push("/dhis-integration/mapping");
}

export function saveMappings(mappingName = "", allMappings, lookupTable, history = {}, currentMappingName, openLatestCompletedEnr = "") {
    return async (dispatch, getState) => {
        const mappingObj = createJson(allMappings);
        await dispatch(getAllMappings());
        let state = getState();

        if (isEmptyString(mappingName)) {
            dispatch(showMessage("Please provide a mapping name", "error"));
        } else if (hasInvalidString(mappingName)) {
            dispatch(showMessage("Please provide only letters, numbers and spaces in Mapping Name", "error"));
        } else if (mappingNameIsNotUnique(state, mappingName)) {
            dispatch(showMessage("Please provide unique mapping name", "error"));
        } else if (hasNoMappings(mappingObj.mapping.instance)) {
            dispatch(showMessage("Please provide at least one mapping for patient instance", "error"));
        } else if (!lookupTable.enrollments.length) {
            dispatch(showMessage("Please select a table for program enrollment", "error"));
        } else if (!openLatestCompletedEnr) {
            dispatch(showMessage("Please provide value for 'Open Latest Completed Enrollment' config", "error"));
        } else if (hasNoMappings(mappingObj.mapping.event)) {
            dispatch(showMessage("Please provide at least one mapping for program event", "error"));
        } else {
            await dispatch(ensureActiveSession());
            state = getState();
            mappingObj.config.openLatestCompletedEnrollment = openLatestCompletedEnr;
            let body = {
                mappingName: mappingName.trim(),
                lookupTable: JSON.stringify(lookupTable),
                mappingJson: JSON.stringify(mappingObj.mapping),
                config: JSON.stringify(mappingObj.config),
                currentMapping: currentMappingName,
                user: state.session.user
            };

            dispatch(hideSpinner(false));

            try {
                let ajax = Ajax.instance();
                let response = await ajax.put("/dhis-integration/api/saveMapping", body);
                afterOnSaveMappingSuccessResponse(dispatch, response, history);
                auditLog(auditLogEventDetails.SAVE_DHIS_MAPPING);
            } catch (e) {
                dispatch(hideSpinner());
                dispatch(showMessage(e.message, "error"));
            }
        }
    };
}

function isJSON(type) {
    return type !== undefined && type.toLowerCase() === 'json';
}

let parseResponse = (res) => {
    let keys = Object.keys(res);
    keys.forEach((key) => {
        if (res[key] !== null && isJSON(res[key].type)) {
            res[key].value = JSON.parse(res[key].value)
        }
    });

    return res;
};

export function getMapping(mappingNameToEdit, history) {
    return async (dispatch) => {
        try {
            dispatch(hideSpinner(false));
            let ajax = Ajax.instance();
            let response = parseResponse(await ajax.get('/dhis-integration/api/getMapping', {"mappingName": mappingNameToEdit}));
            dispatch(mappingJson(response.mapping_json.value));
            dispatch(mappingConfig(response.config.value));
            await dispatchInstanceTableDetails(response.lookup_table.value.instance, dispatch, ajax);
            await dispatchEnrollmentTableDetails(response.lookup_table.value.enrollments, dispatch);
            await dispatchEventTableDetails(response.lookup_table.value.event, dispatch, ajax);
            dispatch(currentMapping(response.mapping_name));
            history.push('/dhis-integration/mapping/edit/' + mappingNameToEdit);
        } catch (e) {
            dispatch(showMessage(e.message, "error"))
        } finally {
            dispatch(hideSpinner());
        }
    }
}

export function getAllMappings() {
    return async dispatch => {
        try {
            dispatch(hideSpinner(false));
            let ajax = Ajax.instance();
            let response = await ajax.get('/dhis-integration/api/getMappingNames');
            dispatch(allMappingNames(response));
        } catch (e) {
            dispatch(showMessage(e.message, "error"))
        } finally {
            dispatch(hideSpinner());
        }
    }
}

export function getTableColumns(tableName, category) {
    return async dispatch => {
        try {
            dispatch(hideSpinner(false));
            let ajax = Ajax.instance();
            await dispatchTableDetails(tableName, category, dispatch, ajax);
        } catch (e) {
            dispatch(showMessage(e.message, "error"))
        } finally {
            dispatch(hideSpinner());
        }
    }
}

async function getColumnNames(ajax, tableName) {
    let response = await ajax.get('/dhis-integration/api/getColumns', {tableName});
    return response;
}

async function dispatchInstanceTableDetails(tableName, dispatch, ajax) {
    let response = await getColumnNames(ajax, tableName);
    dispatch(selectedInstanceTable(tableName));
    dispatch(instanceTableColumns(response));
}

async function dispatchEnrollmentTableDetails(tableName, dispatch) {
    dispatch(selectedEnrollmentsTable(tableName));
}

async function dispatchEventTableDetails(tableName, dispatch, ajax) {
    let response = await getColumnNames(ajax, tableName);
    dispatch(selectedEventTable(tableName));
    dispatch(eventTableColumns(response));
}

async function dispatchTableDetails(tableName, category, dispatch, ajax) {
    dispatch(mappingJson());

    if (category === "instance") {
        await dispatchInstanceTableDetails(tableName, dispatch, ajax);
    } else if (category === "enrollments") {
        await dispatchEnrollmentTableDetails(tableName, dispatch);
    } else if (category === "events") {
        await dispatchEventTableDetails(tableName, dispatch, ajax);
    }
}

export function getTables() {
    return async dispatch => {
        dispatch(hideSpinner(false));
        let ajax = Ajax.instance();
        try {
            let response = await ajax.get("/dhis-integration/api/getTables");
            dispatch(allTables(response));
        } catch (e) {
            dispatch(showMessage("Could not get tables to select", "error"));
            dispatch(allTables());
        } finally {
            dispatch(hideSpinner());
        }
    }
}

export async function exportMapping(mappingName, dispatch) {
    try {
        let ajax = Ajax.instance();
        let response = parseResponse(await ajax.get('/dhis-integration/api/getMapping', {"mappingName": mappingName}));
        let mappingArray = [];
        mappingArray.push({
            mapping_name: response.mapping_name,
            lookup_table: response.lookup_table.value,
            mapping_json: response.mapping_json.value,
            config: response.config.value
        });
        return mappingArray;
    } catch (e) {
        dispatch(showMessage(e.message, "error"))
    }
}

export async function exportAllMappings(dispatch) {
    try {
        let ajax = Ajax.instance();
        let response = await ajax.get('/dhis-integration/api/getAllMappings');
        let parsedResponse = [];
        response.forEach((item) => {
            parsedResponse.push(parseResponse(item));
        });
        let mappingArray = [];
        parsedResponse.forEach((mapping) => {
            mappingArray.push({
                mapping_name: mapping.mapping_name,
                lookup_table: mapping.lookup_table.value,
                mapping_json: mapping.mapping_json.value,
                config: mapping.config.value
            });
        });
        return mappingArray;
    } catch (e) {
        dispatch(showMessage(e.message, "error"))
    }
}

function isEmpty(str) {
    return str === undefined || str === null || str === "";
}

function isJsonObj(obj) {
    return obj !== undefined && obj !== null && obj.constructor === Object;
}

function getAllMappingNames(mappingsToImport) {
    return mappingsToImport.map(mapping => {
        let mappingName = mapping.mapping_name;
        return isEmpty(mappingName) ? "" : mappingName.trim();
    });
}

function isNameDuplicate(mappingName, mappingNames) {
    let multiples = mappingNames.filter(name => name === mappingName);
    return multiples.length > 1;
}

function validateMapping(mapping, mappingNames, dispatch) {
    let isValid = true;
    let mappingName = mapping.mapping_name;
    let lookupTable = mapping.lookup_table;
    let mappingJson = mapping.mapping_json;
    let config = mapping.config;

    if (isEmpty(mappingName)) {
        dispatch(showMessage("Mapping name should have value. Please correct the file and import again", "error"));
        isValid = false;
    } else if (hasInvalidString(mappingName.trim())) {
        dispatch(showMessage(`${mappingName.trim()} is invalid mapping name. Mapping name should be alpha numeric. Please correct the file and import again`, "error"));
        isValid = false;
    } else if (isNameDuplicate(mappingName.trim(), mappingNames)) {
        dispatch(showMessage("Mapping Name should be unique. Please correct the file and import again", "error"));
        isValid = false;
    } else if (!isJsonObj(lookupTable)) {
        dispatch(showMessage("Incorrect values provided for lookup_table property. Please correct the file and import again", "error"));
        isValid = false;
    } else if (!isJsonObj(mappingJson)) {
        dispatch(showMessage("Incorrect values provided for mapping_json property. Please correct the file and import again", "error"));
        isValid = false;
    } else if (isEmpty(lookupTable.instance)) {
        dispatch(showMessage("Instance table name is missing. Please correct the file and import again", "error"));
        isValid = false;
    } else if (isEmpty(lookupTable.enrollments)) {
        dispatch(showMessage("Enrollments table name is missing. Please correct the file and import again", "error"));
        isValid = false;
    } else if (isEmpty(lookupTable.event)) {
        dispatch(showMessage("Event table name is missing. Please correct the file and import again", "error"));
        isValid = false;
    } else if (isEmpty(mappingJson.instance)) {
        dispatch(showMessage("Instance mapping is missing. Please correct the file and import again", "error"));
        isValid = false;
    } else if (isEmpty(mappingJson.event)) {
        dispatch(showMessage("Event mapping is missing. Please correct the file and import again", "error"));
        isValid = false;
    } else if (!isJsonObj(mappingJson.instance)) {
        dispatch(showMessage("Incorrect values provided for mapping_json instance property. Please correct the file and import again", "error"));
        isValid = false;
    } else if (!isJsonObj(mappingJson.event)) {
        dispatch(showMessage("Incorrect values provided for mapping_json event property. Please correct the file and import again", "error"));
        isValid = false;
    } else if (hasNoMappings(mappingJson.instance)) {
        dispatch(showMessage("Instance mappings is missing. Please correct the file and import again", "error"));
        isValid = false;
    } else if (hasNoMappings(mappingJson.event)) {
        dispatch(showMessage("Events mappings is missing. Please correct the file and import again", "error"));
        isValid = false;
    } else if(!Array.isArray(config.searchable)){
        dispatch(showMessage("config.searchable value should be an array. Please correct the file and import again", "error"));
        isValid = false;
    } else if(!Array.isArray(config.comparable)){
        dispatch(showMessage("config.comparable value should be an array. Please correct the file and import again", "error"));
        isValid = false;
    } else if(!config.searchable.every(searchableAttribute => mappingJson.instance[searchableAttribute])){
        dispatch(showMessage("All searchable values should contain mapping. Please correct the file and import again", "error"));
        isValid = false;
    } else if(!config.comparable.every(searchableAttribute => mappingJson.instance[searchableAttribute])){
        dispatch(showMessage("All comparable values should contain mapping. Please correct the file and import again", "error"));
        isValid = false;
    } else if(typeof config.openLatestCompletedEnrollment !== "string") {
        dispatch(showMessage("OpenLatestCompletedEnrollment config value is missing or it is not of type string. Accepted values are 'yes' and 'no'. Please correct the file and import again", "error"));
        isValid = false;
    } else if(!(config.openLatestCompletedEnrollment.toLowerCase() === "yes" || config.openLatestCompletedEnrollment.toLowerCase() === "no")) {
        dispatch(showMessage("OpenLatestCompletedEnrollment config value is incorrect. Accepted values are 'yes' and 'no'. Please correct the file and import again", "error"));
        isValid = false;
    }

    return isValid;
}

export function importMappings(mappingsToImport) {
    return async (dispatch, getState) => {
        if (!Array.isArray(mappingsToImport)) {
            return dispatch(showMessage("File should contain array of Object. Please correct the file and import again", "error"));
        }

        if (!mappingsToImport.length) {
            return dispatch(showMessage("Imported file should not be empty. Please correct the file and import again", "error"))
        }

        await dispatch(ensureActiveSession());
        const state = getState();
        let user = state.session.user;
        let newMappings = [];
        if(validateAllMappings(mappingsToImport, dispatch)) {
            let body = getImportMappingApiBody(mappingsToImport, newMappings, user, state);
            let isSuccess = await saveValidatedMappings(body, dispatch, user);
            isSuccess && newMappings.length && dispatch(importedMappings(newMappings));
        }
    }
}

function validateAllMappings(MappingsToImport, dispatch) {
    let mappingNames = getAllMappingNames(MappingsToImport);
    return MappingsToImport.every((mapping) => validateMapping(mapping, mappingNames, dispatch));
}

async function saveValidatedMappings(body, dispatch) {
    dispatch(hideSpinner(false));
    let ajax = Ajax.instance();
    try {
        let response = await ajax.put("/dhis-integration/api/mappings", body);
        auditLog(auditLogEventDetails.IMPORT_MAPPING_SERVICE);
        dispatch(showMessage(response.data, "success"));
        dispatch(hideSpinner());
        return true;
    } catch (e) {
        dispatch(hideSpinner());
        dispatch(showMessage(e.message, "error"));
    }
    return false;
}

function getImportMappingApiBody(mappingsToImport, newMappings, user, state) {
    let body = [];
    mappingsToImport.forEach((mapping) => {
        let mappingName = mapping.mapping_name.trim();
        if (mappingNameIsNotUnique(state, mappingName)) {
            mapping.current_mapping = mappingName;
        } else {
            newMappings.push(mappingName);
        }
        mapping.mapping_name = mappingName;
        mapping.user = user;
        mapping.lookup_table = JSON.stringify(mapping.lookup_table);
        mapping.mapping_json = JSON.stringify(mapping.mapping_json);
        mapping.config = JSON.stringify(mapping.config);
        body = body.concat(JSON.stringify(mapping));
    });

    return body;
}
