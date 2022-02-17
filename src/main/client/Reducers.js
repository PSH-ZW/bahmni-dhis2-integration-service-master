import { combineReducers } from 'redux';
import {
  allMappingNames,
  allTables,
  currentMapping,
  mappingDetails,
  mappingJson,
  mappingConfig,
  selectedEnrollmentsTable,
  selectedEventTable,
  selectedEventTableColumns,
  selectedInstanceTable,
  selectedInstanceTableColumns,
  setDhisStageId,
  initialSelectedEventTable,
  mappingJsnData,
} from "./mapping/reducers/MappingReducer";

import { mappingNames, syncDetails } from './sync/reducers/SyncReducer';

import {
  hideSpinner, session, showHeader, showHomeButton, showMessage
} from './common/Reducers';

import {
  filters, logs, noEventsToDisplay, noFilterEventsToDisplay
} from './log/reducers/LogReducer';

const reducers = combineReducers({
  selectedInstanceTable,
  selectedEnrollmentsTable,
  selectedEventTable,
  allTables,
  selectedInstanceTableColumns,
  selectedEventTableColumns,
  allMappingNames,
  mappingNames,
  syncDetails,
  mappingDetails,
  hideSpinner,
  showMessage,
  currentMapping,
  showHomeButton,
  mappingJson,
  mappingConfig,
  showHeader,
  session,
  logs,
  filters,
  noEventsToDisplay,
  noFilterEventsToDisplay,
  dhisStageId: setDhisStageId,
  initialSelectedEventTable,
  mappingJsnData,
});

export default reducers;
