export function mappingNames(state = [], action = {}){
    if (action.type === 'mappingNames') {
        return action.mappingNames;
    } else {
        return state;
    }
}

export function syncDetails(state = {}, action = {}){
    if (action.type === 'syncDetails') {
        return action.syncDetails;
    } else {
        return state;
    }
}
