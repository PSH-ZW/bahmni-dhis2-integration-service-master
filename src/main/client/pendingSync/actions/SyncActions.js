import { hideSpinner, showMessage } from '../../common/Actions';
import { auditLogEventDetails, sync } from '../../common/constants';
import Ajax from '../../common/Ajax';
import auditLog from '../../common/AuditLog';

export function syncData(mappingName = '', user = '', comment = '') {
  return async dispatch => {
    comment = comment.trim();
    if (comment === '') {
      dispatch(showMessage(`Enter comment before syncing ${mappingName}`, 'error'));
      return;
    }
    const ajax = Ajax.instance();
    const body = {
      service: mappingName,
      user,
      comment,
      startDate: '',
      endDate: ''
    };
    dispatch(showMessage(`Sync started for ${mappingName}`, 'success'));
    auditLog(auditLogEventDetails.SEND_DATA_TO_DHIS);
    try {
      await ajax.put(sync.URI, body);
    } catch (e) {
      const response = await e.json();
      if ('500 NO DATA TO SYNC'.includes(response.message)) {
        dispatch(showMessage(`No delta data to sync for ${mappingName}`, 'error'));
      } else {
        dispatch(showMessage('Sync failed. Please check the logs for more information', 'error'));
      }
    }
  };
}

export function syncDataWithDateRange(startDate, endDate, mappingName = '', user = '', comment = '') {
  return async dispatch => {
    comment = comment.trim();
    if (comment === '') {
      dispatch(showMessage(`Enter comment before syncing ${mappingName}`, 'error'));
      return;
    }
    if (endDate === null) {
      dispatch(showMessage(`Please Enter End Date for  ${mappingName}`, 'error'));
      return;
    }
    if (endDate < startDate) {
      dispatch(showMessage(`End Date Must be Greater Than StartDate for${mappingName}`, 'error'));
      return;
    }
    const ajax = Ajax.instance();
    const body = {
      service: mappingName,
      user,
      comment,
      startDate,
      endDate
    };
    dispatch(showMessage(`Sync started with Date Range for ${mappingName}`, 'success'));
    auditLog(auditLogEventDetails.SEND_DATA_TO_DHIS);
    try {
      await ajax.put(sync.URI, body);
    } catch (e) {
      const response = await e.json();
      if ('500 NO DATA TO SYNC'.includes(response.message)) {
        dispatch(showMessage(`No delta data to sync for ${mappingName}`, 'error'));
      } else {
        dispatch(showMessage('Sync failed. Please check the logs for more information', 'error'));
      }
    }
  };
}

export function handlePreview(startDate, endDate, mappingName) {
  return async dispatch => {
    if (startDate != null && endDate == null) dispatch(showMessage(`Please Enter End Date for ${mappingName}`, 'error'));
    else if (endDate < startDate) dispatch(showMessage(`End Date Must be Greater Than StartDate for${mappingName}`, 'error'));
    else if (startDate == null && endDate == null) window.open(`/dhis-integration/preview/${mappingName}`);
    else window.open(`/dhis-integration/preview/${mappingName.replaceAll(' ', '')}/${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}/${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}/${mappingName}`);
  };
}
export function getAllMappingsSyncInfo() {
  return async dispatch => {
    try {
      dispatch(hideSpinner(false));
      const ajax = Ajax.instance();
      const response = await ajax.get('/dhis-integration/api/getMappingsSyncInfo');
      dispatch(mappingNames(Object.keys(response)));
      dispatch(syncDetails(response));
    } catch (e) {
      dispatch(showMessage(e.message, 'error'));
    } finally {
      dispatch(hideSpinner());
    }
  };
}

export function mappingNames(mappingNames = []) {
  return {
    type: 'mappingNames',
    mappingNames
  };
}

export function syncDetails(syncDetails = {}) {
  return {
    type: 'syncDetails',
    syncDetails
  };
}
