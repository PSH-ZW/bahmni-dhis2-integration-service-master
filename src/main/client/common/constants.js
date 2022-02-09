export const privileges = {
  MAPPING: 'app:dhis2sync:mapping',
  LOG: 'app:dhis2sync:log',
  UPLOAD: 'app:dhis2sync:upload',
  APP: 'app:dhis2sync'
};

export const audit = {
  LABEL: 'MODULE_LABEL_DHIS_SYNC_KEY',
  URI: '/openmrs/ws/rest/v1/auditlog'
};

export const auditLogEventDetails = {
  OPEN_DHIS_SYNC_APP: {
    patientUuid: null, eventType: 'OPEN_DHIS_SYNC_APP', message: 'OPEN_DHIS_SYNC_APP_MESSAGE', module: audit.LABEL
  },
  SAVE_DHIS_MAPPING: {
    patientUuid: null, eventType: 'SAVE_DHIS_MAPPING', message: 'SAVE_DHIS_MAPPING_MESSAGE', module: audit.LABEL
  },
  OPEN_DHIS_MANAGE_MAPPING: {
    patientUuid: null, eventType: 'OPEN_DHIS_MANAGE_MAPPING', message: 'OPEN_DHIS_MANAGE_MAPPING_MESSAGE', module: audit.LABEL
  },
  OPEN_SYNC_TO_DHIS: {
    patientUuid: null, eventType: 'OPEN_SYNC_TO_DHIS', message: 'OPEN_SYNC_TO_DHIS_MESSAGE', module: audit.LABEL
  },
  OPEN_DHIS_LOG: {
    patientUuid: null, eventType: 'OPEN_DHIS_LOG', message: 'OPEN_DHIS_LOG_MESSAGE', module: audit.LABEL
  },
  SEND_DATA_TO_DHIS: {
    patientUuid: null, eventType: 'SEND_DATA_TO_DHIS', message: 'SEND_DATA_TO_DHIS_MESSAGE', module: audit.LABEL
  },
  EXPORT_MAPPING_SERVICE: {
    patientUuid: null, eventType: 'EXPORT_MAPPING_SERVICE', message: '', module: audit.LABEL
  },
  EXPORT_ALL_MAPPINGS: {
    patientUuid: null, eventType: 'EXPORT_ALL_MAPPINGS', message: 'EXPORT_ALL_MAPPINGS_MESSAGE', module: audit.LABEL
  },
  IMPORT_MAPPING_SERVICE: {
    patientUuid: null, eventType: 'IMPORT_MAPPING_SERVICE', message: 'IMPORT_MAPPING_SERVICE_MESSAGE', module: audit.LABEL
  }
};

export const sync = {
  URI: '/dhis-integration/api/syncData'
};

export const headingMessage = {
  instance: 'person attribute ID for patient instance',
  events: 'data element mapping for program events'
};

export const displayHeaderNames = {
  log_id: 'LogId',
  program: 'Service',
  synced_by: 'Username',
  comments: 'Comments',
  status: 'Status',
  start_date: 'Start Date',
  end_date: 'End Date',
  status_info: 'Status Info',
  date_created: 'Sync Date',
};
