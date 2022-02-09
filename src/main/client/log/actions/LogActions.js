import moment from 'moment';
import Ajax from '../../common/Ajax';
import { hideSpinner, showMessage } from '../../common/Actions';

export function logs(logs = []) {
  return {
    type: 'logs',
    logs
  };
}

export function filterValues(date, service = '', user = '') {
  return {
    type: 'filterOn',
    filter: {
      date,
      service,
      user
    }
  };
}

export function noEventsToDisplay(noEvents = false) {
  return {
    type: 'noEventsToDisplay',
    noEvents
  };
}

export function noFilterEventsToDisplay(noFilterEvents = false) {
  return {
    type: 'noFilterEventsToDisplay',
    noFilterEvents
  };
}

async function get(date, service, user, getAbove, logId, dispatch, onLoad = false) {
  const ajax = Ajax.instance();
  try {
    const response = await ajax.get('/dhis-integration/api/logs', {
      date, service, user, getAbove, logId, onLoad
    });
    if (response.length > 0) {
      dispatch(logs(response));
      dispatch(noEventsToDisplay());
    } else {
      dispatch(noEventsToDisplay(true));
    }
  } catch (e) {
    dispatch(showMessage('Could not get Events', 'error'));
  } finally {
    dispatch(hideSpinner());
  }
}


export function getLogs(date, service = '', user = '') {
  return async dispatch => {
    dispatch(hideSpinner(false));
    const logId = 0;
    await get(date, service, user, false, logId, dispatch, true);
  };
}

export function getLogsOnFilter(date, service = '', user = '') {
  return async dispatch => {
    dispatch(hideSpinner(false));
    const ajax = Ajax.instance();
    const logId = 0;
    try {
      const response = await ajax.get('/dhis-integration/api/logs', {
        date, service, user, getAbove: true, logId, onLoad: true
      });
      if (response.length > 0) {
        dispatch(logs(response));
        dispatch(noEventsToDisplay());
        dispatch(noFilterEventsToDisplay());
      } else {
        dispatch(logs([]));
        dispatch(noEventsToDisplay());
        dispatch(noFilterEventsToDisplay(true));
      }
    } catch (e) {
      dispatch(showMessage('Could not get Events', 'error'));
    } finally {
      dispatch(hideSpinner());
    }
  };
}

export function getNextPageLogs(date, service = '', user = '') {
  return async (dispatch, getState) => {
    dispatch(hideSpinner(false));
    const stateLogs = getState().logs;
    const logId = stateLogs.length > 0
      ? stateLogs[stateLogs.length - 1]['log_id']
      : 0;

    await get(date, service, user, false, logId, dispatch);
  };
}

export function getPrevPageLogs(date, service = '', user = '') {
  return async (dispatch, getState) => {
    dispatch(hideSpinner(false));
    const stateLogs = getState().logs;
    const logId = stateLogs.length > 0
      ? stateLogs[0]['log_id']
      : 0;

    const ajax = Ajax.instance();
    try {
      const response = await ajax.get('/dhis-integration/api/logs', {
        date, service, user, getAbove: true, logId, onLoad: false
      });
      if (response.length > 0) {
        dispatch(logs(response.reverse()));
        dispatch(noEventsToDisplay());
      } else {
        dispatch(noEventsToDisplay(true));
      }
    } catch (e) {
      dispatch(showMessage('Could not get Events', 'error'));
    } finally {
      dispatch(hideSpinner());
    }
  };
}

export function getUtcFromLocal(date) {
  const isoString = moment(date, 'YYYY-MM-DD HH:mm:ss', true).toISOString();
  return moment(isoString).utc().format('YYYY-MM-DD HH:mm:ss');
}

export function getLocalFromUtc(date) {
  return moment(moment.utc(date)).local().format('YYYY-MM-DD hh:mm:ss A');
}
