export function logs(state = [], action = {}) {
  switch (action.type) {
    case 'logs':
      return action.logs;
    default:
      return state;
  }
}

export function filters(state = {}, action = {}) {
  switch (action.type) {
    case 'filterOn':
      return action.filter;
    default:
      return state;
  }
}

export function noEventsToDisplay(state = false, action = {}) {
  switch (action.type) {
    case 'noEventsToDisplay':
      return action.noEvents;
    default:
      return state;
  }
}

export function noFilterEventsToDisplay(state = false, action = {}) {
  switch (action.type) {
    case 'noFilterEventsToDisplay':
      return action.noFilterEvents;
    default:
      return state;
  }
}
