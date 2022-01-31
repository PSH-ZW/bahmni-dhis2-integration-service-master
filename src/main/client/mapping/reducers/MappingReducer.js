export function allTables(state = [], action = {}) {
  switch (action.type) {
    case 'allTables':
      return action.allTables;
    default:
      return state;
  }
}


export function selectedInstanceTable(state = '', action = {}) {
  switch (action.type) {
    case 'selectedInstanceTable':
      return action.selectedInstanceTable;
    default:
      return state;
  }
}

export function selectedEnrollmentsTable(state = '', action = {}) {
  switch (action.type) {
    case 'selectedEnrollmentsTable':
      return action.selectedEnrollmentsTable;
    default:
      return state;
  }
}

export function selectedEventTable(state = '', action = {}) {
  switch (action.type) {
    case 'selectedEventTable':
      return action.selectedEventTable;
    default:
      return state;
  }
}

export function selectedInstanceTableColumns(state = [], action = {}) {
  switch (action.type) {
    case 'selectedInstanceTableColumns':
      return action.selectedInstanceTableColumns;
    default:
      return state;
  }
}

export function selectedEventTableColumns(state = [], action = {}) {
  switch (action.type) {
    case 'selectedEventTableColumns':
      return action.selectedEventTableColumns;
    default:
      return state;
  }
}

export function allMappingNames(state = [], action = {}){
    switch (action.type) {
        case 'allMappings':
            return action.allMappings;
        case 'addNewMapping':
            return state.concat(action.mappingName);
        case 'importedMappings':
            return state.concat(action.mappingNames);
        default:
            return state;
    }
}

export function mappingDetails(state = {}, action = {}){
    if (action.type === 'mappingDetails') {
        return action.mappingDetails;
    } else {
        return state;
    }
}

export function currentMapping(state = '', action = {}) {
    switch (action.type) {
        case 'currentMapping':
            return action.mappingName;
        default:
            return state;
    }
}

export function mappingJson(state = {instance:{}, enrollments:{}, event:{}}, action = {}) {
    switch (action.type) {
        case 'mappingJson':
            return action.mappingJson;
        default:
            return state;
    }
}

export function mappingConfig(state = {searchable:[], comparable: [], openLatestCompletedEnrollment: ""}, action = {}) {
    switch (action.type) {
        case 'mappingConfig':
            return action.mappingConfig;
        default:
            return state;
    }
}
