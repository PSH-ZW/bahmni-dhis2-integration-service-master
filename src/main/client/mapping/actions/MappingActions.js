import _ from 'underscore';
import { ensureActiveSession, hideSpinner, showMessage } from '../../common/Actions';
import { auditLogEventDetails } from '../../common/constants';
import Ajax from '../../common/Ajax';
import auditLog from '../../common/AuditLog';

const isEmptyString = (aString) => aString === '';

const hasEmptyProgramEventsTableName = (allMappings) => {
  return (
    Object.keys(allMappings.formTableMappings).filter((el) => {
      console.log(el);
      return isEmptyString(el);
    }).length > 0
  );
};

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

export function selectedEventTable(table = "") {
  return {
    type: "selectedEventTable",
    selectedEventTable: table,
  };
}

export function initialSelectedEventTable(table = '') {
  return {
    type: "initialSelectedEventTable",
    initialSelectedEventTable: table,
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
  };
}

export function currentMapping(mappingName = '') {
  return {
    type: 'currentMapping',
    mappingName
  };
}
export function mappingJsnData(mappingJsonData = {}) {
  return {
    type: "mappingJsonData",
    mappingJsonData,
  };
}
export function mappingJson(mappingJson = {}) {
  return {
    type: 'mappingJson',
    mappingJson
  };
}
export function mappingConfig(mappingConfig = { searchable: [], comparable: [], openLatestCompletedEnrollment: '' }) {
  return {
    type: 'mappingConfig',
    mappingConfig
  };
}
export function dhisStageIdAction(dhisStageId = '') {
  return {
    type: "setDhisStageId",
    dhisStageId,
  };
}

export function importedMappings(mappingNames = []) {
  return {
    type: 'importedMappings',
    mappingNames

  };
}

export const isObjectValidAndNotEmpty = (anObject) => (
    anObject && typeof anObject === 'object' && Object.keys(anObject).length > 0
);

export function hasNoMappings(mappings) {
  const formTableMappings = mappings["formTableMappings"];
  const formTableMappingsKeys = Object.keys(mappings["formTableMappings"]);

  const nonEmptyMappings = formTableMappingsKeys.filter((el) => {
    const elementIds = Object.values(formTableMappings[el]);
    const t = elementIds.filter((element) => {
        console.log(element);
        return isObjectValidAndNotEmpty(element);
      }).length > 0;
    return t;
  });

  return nonEmptyMappings.length !== formTableMappingsKeys.length;
}

export function createJson(allMappings) {
  const mapping = {};
  const config = {
    searchable: [],
    comparable: []
  };
  let columnName;
  let mappingValue;

  Object.keys(allMappings).forEach((mappingType) => {
    const columnMapping = allMappings[mappingType];
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
        searchableCell
                && searchableCell.firstElementChild.checked
                && config.searchable.push(columnName);

        comparableCell
                && comparableCell.firstElementChild.checked
                && config.comparable.push(columnName);
      }
    });
  });
  return { mapping, config };
}

export function createConfig() {
  const config = {
    searchable: [],
    comparable: [],
  };
  let columnName;
  let mappingValue;
  let searchableCell;
  let comparableCell;
  const elements = document.getElementsByClassName("mapping-row table-row instance");

    Array.from(elements).forEach((mappingRow) => {
      columnName = mappingRow.firstElementChild.innerHTML;
      mappingValue = mappingRow.children[0].firstChild.data;
      searchableCell = mappingRow.children[3].firstElementChild.checked;
      comparableCell = mappingRow.children[4].firstElementChild.checked;
      if (mappingValue) {
        searchableCell && config.searchable.push(columnName);
        comparableCell && config.comparable.push(columnName);
      }
    });
  return config;
}

function mappingNameIsNotUnique(state, mappingName) {
  const trimmedMappingName = mappingName.trim();
  if (trimmedMappingName === state.currentMapping) {
    return false;
  }
  return state.allMappingNames.includes(trimmedMappingName);
}

function afterOnSaveMappingSuccessResponse(dispatch, response, history) {
  dispatch(showMessage(response.data, 'success'));
  dispatch(currentMapping());
  dispatch(mappingJson());
  dispatch(mappingConfig());
  dispatch(hideSpinner());
  dispatch(selectedInstanceTable());
  dispatch(selectedEnrollmentsTable());
  dispatch(selectedEventTable());

  history.push('/dhis-integration/mapping');
}

export function saveMappings(mappingName = '', allMappings, lookupTable, history = {}, currentMappingName, openLatestCompletedEnr = '') {
  return async (dispatch, getState) => {
    // const mappingObj = createJson(allMappings);
    const mappingObj = JSON.parse(JSON.stringify(allMappings));
    mappingObj.config = createConfig();;
    await dispatch(getAllMappings());
    const state = getState();

    // else if (!lookupTable.enrollments.length) {
    //     dispatch(showMessage("Please select a table for program enrollment", "error"));
    // } else if (!openLatestCompletedEnr) {
    //     dispatch(showMessage("Please provide value for 'Open Latest Completed Enrollment' config", "error"));
    // }
  if (isEmptyString(mappingName)) {
    dispatch(showMessage("Please provide a mapping name", "error"));
  } else if (hasInvalidString(mappingName)) {
    dispatch(showMessage("Please provide only letters, numbers and spaces in Mapping Name", "error"));
  } else if (hasEmptyProgramEventsTableName(allMappings)) {
    dispatch(showMessage("Please provide a program events table name", "error"));
  } else if (mappingNameIsNotUnique(state, mappingName)) {
    dispatch(showMessage("Please provide unique mapping name", "error"));
  } else if (!mappingObj.dhisProgramStageId && allMappings.isPatientMapping) {
    dispatch(showMessage("Please provide Dhis Program Stage Id", "error"));
  } else if (hasNoMappings(allMappings)) {
    dispatch(
      showMessage(
        "Please provide at least one mapping for program event",
        "error"
      )
    );
  } else {
    // await dispatch(ensureActiveSession());
    state = getState();
    let state = {};
    mappingObj.config.openLatestCompletedEnrollment = openLatestCompletedEnr;
    const body = {
      mappingName: mappingName.trim(),
      // lookupTable: JSON.stringify(lookupTable),
      mappingJson: JSON.stringify(allMappings),
      config: JSON.stringify(mappingObj.config),
      currentMapping: currentMappingName,
      user: _.get(state, "session.user", null),
    };

    dispatch(hideSpinner(false));

    try {
      const ajax = Ajax.instance();
      const response = await ajax.put(
        "/dhis-integration/api/saveMapping",
        body
      );
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

const parseResponse = (res) => {
  const keys = Object.keys(res);
  keys.forEach((key) => {
    if (res[key] !== null && isJSON(res[key].type)) {
      res[key].value = JSON.parse(res[key].value);
    }
  });

  return res;
};

export function getMapping(mappingNameToEdit, history) {
  return async (dispatch) => {
    try {
      dispatch(hideSpinner(false));
      const ajax = Ajax.instance();
      const response = parseResponse(await ajax.get('/dhis-integration/api/getMapping', { mappingName: mappingNameToEdit }));
      const mappingJsonData = JSON.parse(response.mapping_json.value);
      const dhisStageId = _.get(mappingJsonData, "dhisProgramStageId", "");
      const tableNames = Object.keys(mappingJsonData.formTableMappings);
      dispatch(mappingJsnData(mappingJsonData));
      dispatch(
        mappingJson(mappingJsonData.formTableMappings)
      );
      dispatch(dhisStageIdAction(dhisStageId));
      dispatch(mappingConfig(JSON.parse(response.config.value)));
      // await dispatchInstanceTableDetails(response.lookup_table.value.instance, dispatch, ajax);
      // await dispatchEnrollmentTableDetails(response.lookup_table.value.enrollments, dispatch);
      await dispatchEventTableDetails(tableNames, dispatch, ajax);
      dispatch(initialSelectedEventTable(tableNames));
      dispatch(currentMapping(response.program_name));
      history.push(`/dhis-integration/mapping/edit/${mappingNameToEdit}`);
    } catch (e) {
      dispatch(showMessage(e.message, 'error'));
    } finally {
      dispatch(hideSpinner());
    }
  };
}

export function getAllMappings() {
  return async dispatch => {
    try {
      dispatch(hideSpinner(false));
      const ajax = Ajax.instance();
      const response = await ajax.get('/dhis-integration/api/getMappingNames');
      dispatch(allMappingNames(response));
    } catch (e) {
      dispatch(showMessage(e.message, 'error'));
    } finally {
      dispatch(hideSpinner());
    }
  };
}

export function getTableColumns(tableName, category, index) {
  return async dispatch => {
    try {
      dispatch(hideSpinner(false));
      const ajax = Ajax.instance();
      await dispatchTableDetails(tableName, category, dispatch, ajax, index);
    } catch (e) {
      dispatch(showMessage(e.message, 'error'));
    } finally {
      dispatch(hideSpinner());
    }
  };
}

async function getColumnNames(ajax, tableName) {
  const response = await ajax.get('/dhis-integration/api/getColumns', { tableName });
  return response;
}

async function dispatchInstanceTableDetails(tableName, dispatch, ajax) {
  const response = await getColumnNames(ajax, tableName);
  dispatch(selectedInstanceTable(tableName));
  dispatch(instanceTableColumns(response));
}

async function dispatchEnrollmentTableDetails(tableName, dispatch) {
  dispatch(selectedEnrollmentsTable(tableName));
}

async function dispatchEventTableDetails(tableNames, dispatch, ajax) {
  const tablesColumnsResponse = {};
  for (let i = 0; i < tableNames.length; i++) {
    const response = await getColumnNames(ajax, tableNames[i]);
    tablesColumnsResponse[tableNames[i]] = response;
  }
  dispatch(eventTableColumns(tablesColumnsResponse));
  dispatch(selectedEventTable(tableNames));
}

async function dispatchTableDetails(tableName, category, dispatch, ajax) {
  dispatch(mappingJson());

  if (category === 'instance') {
    await dispatchInstanceTableDetails(tableName, dispatch, ajax);
  } else if (category === 'enrollments') {
    await dispatchEnrollmentTableDetails(tableName, dispatch);
  } else if (category === 'events') {
    await dispatchEventTableDetails(tableName, dispatch, ajax);
  }
}

export function getTables() {
  return async dispatch => {
    dispatch(hideSpinner(false));
    const ajax = Ajax.instance();
    try {
      const response = await ajax.get('/dhis-integration/api/getTables');
      dispatch(allTables(response));
    } catch (e) {
      dispatch(showMessage('Could not get tables to select', 'error'));
      dispatch(allTables());
    } finally {
      dispatch(hideSpinner());
    }
  };
}

export async function exportMapping(mappingName, dispatch) {
  try {
    const ajax = Ajax.instance();
    const response = parseResponse(await ajax.get('/dhis-integration/api/getMapping', { mappingName }));
    const mappingArray = [];
    mappingArray.push({
      mapping_name: response.mapping_name,
      lookup_table: response.lookup_table.value,
      mapping_json: response.mapping_json.value,
      config: response.config.value
    });
    return mappingArray;
  } catch (e) {
    dispatch(showMessage(e.message, 'error'));
  }
}

export async function exportAllMappings(dispatch) {
  try {
    const ajax = Ajax.instance();
    const response = await ajax.get('/dhis-integration/api/getAllMappings');
    const parsedResponse = [];
    response.forEach((item) => {
      parsedResponse.push(parseResponse(item));
    });
    const mappingArray = [];
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
    dispatch(showMessage(e.message, 'error'));
  }
}

function isEmpty(str) {
  return str === undefined || str === null || str === '';
}

function isJsonObj(obj) {
  return obj !== undefined && obj !== null && obj.constructor === Object;
}

function getAllMappingNames(mappingsToImport) {
  return mappingsToImport.map(mapping => {
    const mappingName = mapping.mapping_name;
    return isEmpty(mappingName) ? '' : mappingName.trim();
  });
}

function isNameDuplicate(mappingName, mappingNames) {
  const multiples = mappingNames.filter(name => name === mappingName);
  return multiples.length > 1;
}

function validateMapping(mapping, mappingNames, dispatch) {
  let isValid = true;
  const mappingName = mapping.mapping_name;
  const lookupTable = mapping.lookup_table;
  const mappingJson = mapping.mapping_json;
  const { config } = mapping;

  if (isEmpty(mappingName)) {
    dispatch(showMessage('Mapping name should have value. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (hasInvalidString(mappingName.trim())) {
    dispatch(showMessage(`${mappingName.trim()} is invalid mapping name. Mapping name should be alpha numeric. Please correct the file and import again`, 'error'));
    isValid = false;
  } else if (isNameDuplicate(mappingName.trim(), mappingNames)) {
    dispatch(showMessage('Mapping Name should be unique. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (!isJsonObj(lookupTable)) {
    dispatch(showMessage('Incorrect values provided for lookup_table property. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (!isJsonObj(mappingJson)) {
    dispatch(showMessage('Incorrect values provided for mapping_json property. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (isEmpty(lookupTable.instance)) {
    dispatch(showMessage('Instance table name is missing. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (isEmpty(lookupTable.enrollments)) {
    dispatch(showMessage('Enrollments table name is missing. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (isEmpty(lookupTable.event)) {
    dispatch(showMessage('Event table name is missing. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (isEmpty(mappingJson.instance)) {
    dispatch(showMessage('Instance mapping is missing. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (isEmpty(mappingJson.event)) {
    dispatch(showMessage('Event mapping is missing. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (!isJsonObj(mappingJson.instance)) {
    dispatch(showMessage('Incorrect values provided for mapping_json instance property. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (!isJsonObj(mappingJson.event)) {
    dispatch(showMessage('Incorrect values provided for mapping_json event property. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (hasNoMappings(mappingJson.instance)) {
    dispatch(showMessage('Instance mappings is missing. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (hasNoMappings(mappingJson.event)) {
    dispatch(showMessage('Events mappings is missing. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (!Array.isArray(config.searchable)) {
    dispatch(showMessage('config.searchable value should be an array. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (!Array.isArray(config.comparable)) {
    dispatch(showMessage('config.comparable value should be an array. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (!config.searchable.every(searchableAttribute => mappingJson.instance[searchableAttribute])) {
    dispatch(showMessage('All searchable values should contain mapping. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (!config.comparable.every(searchableAttribute => mappingJson.instance[searchableAttribute])) {
    dispatch(showMessage('All comparable values should contain mapping. Please correct the file and import again', 'error'));
    isValid = false;
  } else if (typeof config.openLatestCompletedEnrollment !== 'string') {
    dispatch(showMessage("OpenLatestCompletedEnrollment config value is missing or it is not of type string. Accepted values are 'yes' and 'no'. Please correct the file and import again", 'error'));
    isValid = false;
  } else if (!(config.openLatestCompletedEnrollment.toLowerCase() === 'yes' || config.openLatestCompletedEnrollment.toLowerCase() === 'no')) {
    dispatch(showMessage("OpenLatestCompletedEnrollment config value is incorrect. Accepted values are 'yes' and 'no'. Please correct the file and import again", 'error'));
    isValid = false;
  }

  return isValid;
}

export function importMappings(mappingsToImport) {
  return async (dispatch, getState) => {
    if (!Array.isArray(mappingsToImport)) {
      return dispatch(showMessage('File should contain array of Object. Please correct the file and import again', 'error'));
    }

    if (!mappingsToImport.length) {
      return dispatch(showMessage('Imported file should not be empty. Please correct the file and import again', 'error'));
    }

    await dispatch(ensureActiveSession());
    const state = getState();
    const { user } = state.session;
    const newMappings = [];
    if (validateAllMappings(mappingsToImport, dispatch)) {
      const body = getImportMappingApiBody(mappingsToImport, newMappings, user, state);
      const isSuccess = await saveValidatedMappings(body, dispatch, user);
      isSuccess && newMappings.length && dispatch(importedMappings(newMappings));
    }
  };
}

function validateAllMappings(MappingsToImport, dispatch) {
  const mappingNames = getAllMappingNames(MappingsToImport);
  return MappingsToImport.every((mapping) => validateMapping(mapping, mappingNames, dispatch));
}

async function saveValidatedMappings(body, dispatch) {
  dispatch(hideSpinner(false));
  const ajax = Ajax.instance();
  try {
    const response = await ajax.put('/dhis-integration/api/mappings', body);
    auditLog(auditLogEventDetails.IMPORT_MAPPING_SERVICE);
    dispatch(showMessage(response.data, 'success'));
    dispatch(hideSpinner());
    return true;
  } catch (e) {
    dispatch(hideSpinner());
    dispatch(showMessage(e.message, 'error'));
  }
  return false;
}

function getImportMappingApiBody(mappingsToImport, newMappings, user, state) {
  let body = [];
  mappingsToImport.forEach((mapping) => {
    const mappingName = mapping.mapping_name.trim();
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
