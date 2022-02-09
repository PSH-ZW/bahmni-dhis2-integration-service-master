import 'jsdom-global/register';
import 'jsdom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import * as MappingActions from '../../../../main/client/mapping/actions/MappingActions';
import * as Actions from '../../../../main/client/common/Actions';
import Ajax from '../../../../main/client/common/Ajax';

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);
describe('#mappingActions', () => {
  describe('#allTables', () => {
    it('should return empty tables ', () => {
      expect(MappingActions.allTables()).toEqual({
        type: 'allTables',
        allTables: []
      });
    });

    it('should return table name in an array', () => {
      expect(MappingActions.allTables(['patient_identifier', 'program', 'some_table'])).toEqual({
        type: 'allTables',
        allTables: ['patient_identifier', 'program', 'some_table']
      });
    });
  });

  describe('selectedInstanceTable', () => {
    it('should return a table name', () => {
      expect(MappingActions.selectedInstanceTable()).toEqual({
        type: 'selectedInstanceTable',
        selectedInstanceTable: ''
      });
    });

    it('should return tableName as value for the selectedInstanceTable field in the return object', () => {
      expect(MappingActions.selectedInstanceTable('tb_service')).toEqual({
        type: 'selectedInstanceTable',
        selectedInstanceTable: 'tb_service'
      });
    });
  });

  describe('selectedEnrollmentsTable', () => {
    it('should return selectedEnrollmentsTable as empty on default', () => {
      expect(MappingActions.selectedEnrollmentsTable()).toEqual({
        type: 'selectedEnrollmentsTable',
        selectedEnrollmentsTable: ''
      });
    });

    it('should return tableName as value for the selectedEnrollmentsTable field in the return object', () => {
      expect(MappingActions.selectedEnrollmentsTable('tb_service')).toEqual({
        type: 'selectedEnrollmentsTable',
        selectedEnrollmentsTable: 'tb_service'
      });
    });
  });

  describe('selectedEventTable', () => {
    it('should return selectedEventTable as empty on default', () => {
      expect(MappingActions.selectedEventTable()).toEqual({
        type: 'selectedEventTable',
        selectedEventTable: ''
      });
    });

    it('should return tableName as value for the selectedEventTable field in the return object', () => {
      expect(MappingActions.selectedEventTable('tb_service')).toEqual({
        type: 'selectedEventTable',
        selectedEventTable: 'tb_service'
      });
    });
  });

  describe('instanceTableColumns', () => {
    it('should return an empty array', () => {
      expect(MappingActions.instanceTableColumns()).toEqual({
        type: 'selectedInstanceTableColumns',
        selectedInstanceTableColumns: []
      });
    });

    it('should return selected table columns in an array', () => {
      expect(MappingActions.instanceTableColumns(['pat_id', 'pat_name', 'age'])).toEqual({
        type: 'selectedInstanceTableColumns',
        selectedInstanceTableColumns: ['pat_id', 'pat_name', 'age']
      });
    });
  });

  describe('eventTableColumns', () => {
    it('should return an empty array on default', () => {
      expect(MappingActions.eventTableColumns()).toEqual({
        type: 'selectedEventTableColumns',
        selectedEventTableColumns: []
      });
    });

    it('should return selected table columns in an array', () => {
      expect(MappingActions.eventTableColumns(['pat_id', 'pat_name', 'age'])).toEqual({
        type: 'selectedEventTableColumns',
        selectedEventTableColumns: ['pat_id', 'pat_name', 'age']
      });
    });
  });

  describe('allMappingNames', () => {
    it('should return an empty array', () => {
      expect(MappingActions.allMappingNames()).toEqual({
        type: 'allMappings',
        allMappings: []
      });
    });

    it('should return selected table columns in an array', () => {
      expect(MappingActions.allMappingNames(['pat_id', 'pat_name', 'age'])).toEqual({
        type: 'allMappings',
        allMappings: ['pat_id', 'pat_name', 'age']
      });
    });
  });

  describe('saveMapping', () => {
    it('should dispatch showMessage with ShouldAddMappingName when mapping name is empty', async () => {
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['HTS', 'HTS1']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: 'Please provide a mapping name',
          responseType: 'error'
        }
      ];

      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        }
      });

      const sandbox = sinon.createSandbox();
      const ajax = new Ajax();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['HTS', 'HTS1']));

      await store.dispatch(MappingActions.saveMappings('', { instance: {}, enrollments: {} }, ''));
      expect(store.getActions()).toEqual(expectedActions);

      getMappingsMock.verify();
      sandbox.restore();
    });

    it('should dispatch showMessage with ShouldAddMappingName when mapping name has invalid characters', async () => {
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['HTS', 'HTS1']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: 'Please provide only letters, numbers and spaces in Mapping Name',
          responseType: 'error'
        }
      ];

      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        }
      });

      const sandbox = sinon.createSandbox();
      const ajax = new Ajax();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['HTS', 'HTS1']));

      await store.dispatch(MappingActions.saveMappings('$%#^', { instance: {}, enrollments: {} }, ''));
      expect(store.getActions()).toEqual(expectedActions);

      getMappingsMock.verify();
      sandbox.restore();
    });

    it('should dispatch showMessage with AtLeaseOnePatientInstanceColumnShouldHaveMapping when no instance mapping is entered', async () => {
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['HTS', 'HTS1']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: 'Please provide at least one mapping for patient instance',
          responseType: 'error'
        }
      ];

      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        allMappingNames: []
      });

      const sandbox = sinon.createSandbox();
      const ajax = new Ajax();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['HTS', 'HTS1']));

      await store.dispatch(MappingActions.saveMappings('Mapping Name', { instance: {}, enrollments: {} }, ''));
      expect(store.getActions()).toEqual(expectedActions);

      getMappingsMock.verify();
      sandbox.restore();
    });

    it('should dispatch showMessage with AtLeaseOneProgramEnrollmentColumnShouldHaveMapping when no enrollment mapping is entered', async () => {
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['HTS', 'HTS1']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: 'Please select a table for program enrollment',
          responseType: 'error'
        }
      ];

      document.body.innerHTML = '<div>'
                + '<div class="enrollments">'
                + '<div class="mapping-column-name">pat_id</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input"/>'
                + '</div>'
                + '</div>'
                + '<div class="instance">'
                + '<div class="mapping-column-name">pat_name</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="asdfasf"/>'
                + '</div>'
                + '</div>'
                + '</div>';

      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        allMappingNames: []
      });

      const instanceMappingColumns = document.getElementsByClassName('instance');

      const allMappings = {
        instance: instanceMappingColumns,
      };
      const lookupTable = {
        instance: 'instance_lookup_table',
        enrollments: ''
      };

      const sandbox = sinon.createSandbox();
      const ajax = new Ajax();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['HTS', 'HTS1']));

      await store.dispatch(MappingActions.saveMappings('Mapping Name', allMappings, lookupTable));
      expect(store.getActions()).toEqual(expectedActions);

      getMappingsMock.verify();
      sandbox.restore();
    });

    it('should dispatch showMessage with PleaseProvideValueForOpenLatestCompletedEnrollmentConfig when enrollment config is not selected', async () => {
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['HTS', 'HTS1']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: "Please provide value for 'Open Latest Completed Enrollment' config",
          responseType: 'error'
        }
      ];
      document.body.innerHTML = '<div>'
                + '<div class="instance">'
                + '<div class="mapping-column-name">pat_id</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="patIdElementId"/>'
                + '</div>'
                + '</div>'
                + '<div class="enrollments">'
                + '<div class="mapping-column-name">pat_name</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="patNameElementId"/>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<div class="events">'
                + '<div class="mapping-column-name">event_name</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input"/>'
                + '</div>'
                + '</div>'
                + '</div>';
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        allMappingNames: []
      });
      const instanceMappingColumns = document.getElementsByClassName('instance');
      const eventMappingColumns = document.getElementsByClassName('events');
      const allMappings = {
        instance: instanceMappingColumns,
        event: eventMappingColumns
      };
      const lookupTable = {
        instance: 'instance_lookup_table',
        enrollments: 'enrolment_lookup_table'
      };

      const sandbox = sinon.createSandbox();
      const ajax = new Ajax();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['HTS', 'HTS1']));

      await store.dispatch(MappingActions.saveMappings('Mapping Name', allMappings, lookupTable));
      expect(store.getActions()).toEqual(expectedActions);

      getMappingsMock.verify();
      sandbox.restore();
    });

    it('should dispatch showMessage with PleaseProvideAtLeastOneMappingForProgramEvent when no event mapping is entered', async () => {
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['HTS', 'HTS1']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: 'Please provide at least one mapping for program event',
          responseType: 'error'
        }
      ];
      document.body.innerHTML = '<div>'
                + '<div class="instance">'
                + '<div class="mapping-column-name">pat_id</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="patIdElementId"/>'
                + '</div>'
                + '</div>'
                + '<div class="enrollments">'
                + '<div class="mapping-column-name">pat_name</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="patNameElementId"/>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<div class="events">'
                + '<div class="mapping-column-name">event_name</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input"/>'
                + '</div>'
                + '</div>'
                + '</div>';
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        allMappingNames: []
      });
      const instanceMappingColumns = document.getElementsByClassName('instance');
      const eventMappingColumns = document.getElementsByClassName('events');
      const allMappings = {
        instance: instanceMappingColumns,
        event: eventMappingColumns
      };
      const lookupTable = {
        instance: 'instance_lookup_table',
        enrollments: 'enrolment_lookup_table',
        event: ''
      };

      const sandbox = sinon.createSandbox();
      const ajax = new Ajax();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['HTS', 'HTS1']));

      await store.dispatch(MappingActions.saveMappings('Mapping Name', allMappings, lookupTable, {}, '', 'yes'));
      expect(store.getActions()).toEqual(expectedActions);

      getMappingsMock.verify();
      sandbox.restore();
    });

    it('should dispatch showMessage with MappingNameShouldBeUnique when mapping name is already registered', async () => {
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['Mapping Name']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: 'Please provide unique mapping name',
          responseType: 'error'
        }
      ];

      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        allMappingNames: ['Mapping Name']
      });

      document.body.innerHTML = '<div>'
                + '<div class="instance">'
                + '<div class="mapping-column-name">pat_id</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input"/>'
                + '</div>'
                + '</div>'
                + '<div class="enrollments">'
                + '<div class="mapping-column-name">pat_name</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input"/>'
                + '</div>'
                + '</div>'
                + '</div>';

      document.getElementsByClassName('mapping-input')[0].value = 'XdJH67';
      document.getElementsByClassName('mapping-input')[1].value = 'LKtyR55';


      const mappings = {
        instance: document.getElementsByClassName('instance'),
        enrollments: document.getElementsByClassName('enrollments')
      };

      const sandbox = sinon.createSandbox();
      const ajax = new Ajax();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['Mapping Name']));

      await store.dispatch(MappingActions.saveMappings('Mapping Name', mappings, '', {}, '', 'yes'));
      expect(store.getActions()).toEqual(expectedActions);

      getMappingsMock.verify();
      sandbox.restore();
    });

    it('should dispatch necessary actions on ajax success', async () => {
      const mappingName = 'Mapping Name 2';
      const ajax = new Ajax();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['HTS', 'HTS1']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Successfully Saved Mapping',
          responseType: 'success'
        },
        {
          type: 'currentMapping',
          mappingName: ''
        },
        {
          type: 'mappingJson',
          mappingJson: {
            instance: {},
            enrollments: {},
            event: {}
          }
        },
        {
          type: 'mappingConfig',
          mappingConfig: {
            searchable: [],
            comparable: [],
            openLatestCompletedEnrollment: ''
          }
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'selectedInstanceTable',
          selectedInstanceTable: ''
        },
        {
          selectedEnrollmentsTable: '',
          type: 'selectedEnrollmentsTable'
        },
        {
          selectedEventTable: '',
          type: 'selectedEventTable'
        }
      ];

      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        allMappingNames: ['Mapping Name'],
        currentMapping: '',
        session: {
          user: 'superman'
        }
      });

      document.body.innerHTML = '<div>'
                + '<div class="instance">'
                + '<div class="mapping-column-name">pat_id</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="XdJH67"/>'
                + '</div>'
                + '</div>'
                + '<div class="enrollments">'
                + '<div class="mapping-column-name">pat_name</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="LKtyR55"/>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<div class="events">'
                + '<div class="mapping-column-name">event_id</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="DLR5U8"/>'
                + '</div>'
                + '</div>'
                + '</div>';

      const history = {
        push: () => {
        }
      };

      const sandbox = sinon.createSandbox();
      const pushMock = sandbox.mock(history).expects('push');
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const putMock = sandbox.mock(ajax).expects('put')
        .returns(Promise.resolve({ data: 'Successfully Saved Mapping' }));
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['HTS', 'HTS1']));


      history.push = pushMock;

      const allMappings = {
        instance: document.getElementsByClassName('instance'),
        event: document.getElementsByClassName('events')
      };
      const lookupTable = {
        instance: 'selectedInstanceTable',
        enrollments: 'selectedEnrollmentsTable',
        event: 'selectedEventTable'
      };
      await store.dispatch(MappingActions.saveMappings(mappingName, allMappings, lookupTable, history, '', 'yes'));

      expect(store.getActions()).toEqual(expectedActions);

      pushMock.verify();
      putMock.verify();
      getMappingsMock.verify();
      sandbox.restore();
    });

    it('should dispatch showMessage on ajax call fails', async () => {
      const mappingName = 'Mapping Name 2';
      const ajax = new Ajax();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: ['HTS', 'HTS1']
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: 'Could not able to add mapping',
          responseType: 'error'
        }
      ];

      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        allMappingNames: ['Mapping Name']
      });

      document.body.innerHTML = '<div>'
                + '<div class="instance">'
                + '<div class="mapping-column-name">pat_id</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="XdJH67"/>'
                + '</div>'
                + '</div>'
                + '<div class="enrollments">'
                + '<div class="mapping-column-name">pat_name</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="LKtyR55"/>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<div class="events">'
                + '<div class="mapping-column-name">event_id</div>'
                + '<div class="mapping-data-element">'
                + '<input type="input" class="mapping-input" value="LDW9TY"/>'
                + '</div>'
                + '</div>'
                + '</div>';


      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const putMock = sandbox.mock(ajax).expects('put')
        .returns(Promise.reject({ message: 'Could not able to add mapping' }));
      const getMappingsMock = sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(['HTS', 'HTS1']));

      try {
        const allMappings = {
          instance: document.getElementsByClassName('instance'),
          event: document.getElementsByClassName('event')
        };
        const lookupTable = {
          instance: 'selectedInstanceTable',
          enrollments: 'selectedEnrollmentsTable',
          event: 'selectedEventTable'
        };
        await store.dispatch(MappingActions.saveMappings(mappingName, allMappings, lookupTable, {}, '', 'yes'));
      } catch (e) {
        expect(store.getActions()).toEqual(expectedActions);
        putMock.verify();
        getMappingsMock.verify();
      }
      sandbox.restore();
    });
  });

  describe('currentMapping', () => {
    it('should return object with type and mappingName', () => {
      expect(MappingActions.currentMapping('new mapping'))
        .toEqual({ type: 'currentMapping', mappingName: 'new mapping' });
    });
  });

  describe('mappingJson', () => {
    it('should return object with type and mappingJson', () => {
      const mappingJson = {
        instance: { patient_id: 'FH7RTu', patient_name: 'ZS8Srt7' },
        enrollments: { pat_id: '4RT43' },
        event: { event_id: 'fdkf23' }
      };
      expect(MappingActions.mappingJson(mappingJson))
        .toEqual({ type: 'mappingJson', mappingJson });
    });

    it('should return object with empty instance, enrollments and events on default', () => {
      const mappingJson = {
        instance: {},
        enrollments: {},
        event: {}
      };

      expect(MappingActions.mappingJson())
        .toEqual({ type: 'mappingJson', mappingJson });
    });
  });

  describe('mappingConfig', () => {
    it('should return object with type and mappingConfig', () => {
      const config = {
        searchable: ['patient_id', 'patient_name'],
        comparable: ['Date_of_birth'],
        openLatestCompletedEnrollment: ''
      };
      expect(MappingActions.mappingConfig(config))
        .toEqual({ type: 'mappingConfig', mappingConfig: config });
    });

    it('should return object with empty instance and events in searchable by default', () => {
      const config = {
        searchable: [],
        comparable: [],
        openLatestCompletedEnrollment: ''
      };

      expect(MappingActions.mappingConfig())
        .toEqual({ type: 'mappingConfig', mappingConfig: config });
    });
  });

  describe('getMapping', () => {
    it('should dispatch mapping details', async () => {
      const ajax = new Ajax();
      const mappingNameToEdit = 'HTS Service';
      const tableColumns = ['pat_id', 'program_id', 'program_status'];
      const eventTableColumns = ['event_id', 'patient_name'];
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'mappingJson',
          mappingJson: {
            instance: {
              patient_identifier: 'fYj7U',
              patient_name: 'ert76HK'
            },
            enrollments: {
              enrollment_id: 'fYj7U',
              patient_name: 'ert76HK'
            },
            event: {
              event_id: 'fYj7U',
              patient_name: 'ert76HK'
            }
          }
        },
        {
          type: 'mappingConfig',
          mappingConfig: {
            searchable: ['patient_id', 'UIC'],
            comparable: ['Date_of_birth']
          }
        },
        {
          type: 'selectedInstanceTable',
          selectedInstanceTable: 'patient_details'
        },
        {
          type: 'selectedInstanceTableColumns',
          selectedInstanceTableColumns: tableColumns
        },
        {
          type: 'selectedEnrollmentsTable',
          selectedEnrollmentsTable: 'enroll'
        },
        {
          type: 'selectedEventTable',
          selectedEventTable: 'event_table'
        },
        {
          type: 'selectedEventTableColumns',
          selectedEventTableColumns: eventTableColumns
        },
        {
          type: 'currentMapping',
          mappingName: mappingNameToEdit
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const store = mockStore({
        selectedInstanceTable: '',
        selectedEnrollmentsTable: '',
        selectedEventTable: '',
        currentMapping: '',
        mappingJson: {}
      });

      const history = {
        push: () => {
        }
      };
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxMock = sandbox.mock(ajax);
      const ajaxGetMock = ajaxMock
        .expects('get')
        .withArgs('/dhis-integration/api/getMapping', { mappingName: mappingNameToEdit })
        .returns(Promise.resolve({
          mapping_name: 'HTS Service',
          lookup_table: {
            value: '{'
                            + '"instance": "patient_details",'
                            + '"enrollments": "enroll",'
                            + '"event": "event_table"'
                            + '}',
            type: 'json'
          },
          mapping_json: {
            value: JSON.stringify({
              instance: {
                patient_identifier: 'fYj7U',
                patient_name: 'ert76HK'
              },
              enrollments: {
                enrollment_id: 'fYj7U',
                patient_name: 'ert76HK'
              },
              event: {
                event_id: 'fYj7U',
                patient_name: 'ert76HK'
              }
            }),
            type: 'json'
          },
          config: {
            value: JSON.stringify({
              searchable: ['patient_id', 'UIC'],
              comparable: ['Date_of_birth']
            }),
            type: 'json'
          }
        }));
      const getInstanceColumnsMock = ajaxMock
        .expects('get')
        .withArgs('/dhis-integration/api/getColumns', { tableName: 'patient_details' })
        .returns(Promise.resolve(tableColumns));

      const eventColumnsMock = ajaxMock
        .expects('get')
        .withArgs('/dhis-integration/api/getColumns', { tableName: 'event_table' })
        .returns(Promise.resolve(eventTableColumns));

      const pushMock = sandbox.mock(history).expects('push')
        .withArgs(`/dhis-integration/mapping/edit/${mappingNameToEdit}`);
      history.push = pushMock;

      await store.dispatch(MappingActions.getMapping(mappingNameToEdit, history));

      expect(store.getActions()).toEqual(expectedActions);

      ajaxGetMock.verify();
      getInstanceColumnsMock.verify();
      eventColumnsMock.verify();
      pushMock.verify();
      sandbox.restore();
    });

    it('should dispatch show message on fail', async () => {
      const ajax = new Ajax();
      const message = 'Could not get mappings';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: message,
          responseType: 'error'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const store = mockStore({
        selectedInstanceTable: '',
        currentMapping: '',
        mappingJson: {}
      });

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxGetMock = sandbox.mock(ajax)
        .expects('get')
        .withArgs('/dhis-integration/api/getMapping', { mappingName: 'some name' })
        .returns(Promise.reject({
          message
        }));

      try {
        await store.dispatch(MappingActions.getMapping('some name', {}));
      } catch (e) {
        expect(store.getActions()).toEqual(expectedActions);

        ajaxGetMock.verify();
      } finally {
        sandbox.restore();
      }
    });
  });

  describe('getAllMappings', () => {
    it('should get all mapping names', async () => {
      const ajax = new Ajax();
      const mappings = [
        'HTS Service',
        'TB Service'
      ];
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allMappings',
          allMappings: mappings
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const store = mockStore({
        selectedInstanceTable: '',
        currentMapping: '',
        mappingJson: {}
      });

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxGetMock = sandbox.mock(ajax)
        .expects('get')
        .withArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.resolve(mappings));

      await store.dispatch(MappingActions.getAllMappings());

      expect(store.getActions()).toEqual(expectedActions);
      ajaxGetMock.verify();
      sandbox.restore();
    });

    it('should dispatch show message when getAllMappings fail', async () => {
      const ajax = new Ajax();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Could not get mappings',
          responseType: 'error'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const store = mockStore({
        selectedInstanceTable: '',
        currentMapping: '',
        mappingJson: {}
      });

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxGetMock = sandbox.mock(ajax)
        .expects('get')
        .withArgs('/dhis-integration/api/getMappingNames')
        .returns(Promise.reject({
          message: 'Could not get mappings'
        }));

      try {
        await store.dispatch(MappingActions.getAllMappings());
      } catch (e) {
        expect(store.getActions()).toEqual(expectedActions);
        ajaxGetMock.verify();
      } finally {
        sandbox.restore();
      }
    });
  });

  describe('getTableColumns', () => {
    it('should get all columns of the given table and dispatch instance actions when category is instance', async () => {
      const tableName = 'pat_details';
      const tableColumns = ['pat_id', 'pat_name'];
      const ajax = new Ajax();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'mappingJson',
          mappingJson: {
            instance: {},
            enrollments: {},
            event: {}
          }
        },
        {
          type: 'selectedInstanceTable',
          selectedInstanceTable: tableName
        },
        {
          type: 'selectedInstanceTableColumns',
          selectedInstanceTableColumns: tableColumns
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const store = mockStore({
        selectedTableColumns: []
      });

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getColumns', { tableName })
        .returns(Promise.resolve(tableColumns));

      await store.dispatch(MappingActions.getTableColumns(tableName, 'instance'));

      expect(store.getActions()).toEqual(expectedActions);
      sandbox.restore();
    });

    it('should get all columns of the given table and dispatch enrollments actions when category is enrollments', async () => {
      const tableName = 'pat_details';
      const tableColumns = ['pat_id', 'pat_name'];
      const ajax = new Ajax();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'mappingJson',
          mappingJson: {
            instance: {},
            enrollments: {},
            event: {}
          }
        },
        {
          type: 'selectedEnrollmentsTable',
          selectedEnrollmentsTable: tableName
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const store = mockStore({
        selectedTableColumns: []
      });

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getColumns', { tableName })
        .returns(Promise.resolve(tableColumns));

      await store.dispatch(MappingActions.getTableColumns(tableName, 'enrollments'));

      expect(store.getActions()).toEqual(expectedActions);
      sandbox.restore();
    });

    it('should get all columns of the given table and dispatch event actions when category is event', async () => {
      const tableName = 'pat_details';
      const tableColumns = ['pat_id', 'pat_name'];
      const ajax = new Ajax();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'mappingJson',
          mappingJson: {
            instance: {},
            enrollments: {},
            event: {}
          }
        },
        {
          type: 'selectedEventTable',
          selectedEventTable: tableName
        },
        {
          type: 'selectedEventTableColumns',
          selectedEventTableColumns: tableColumns
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const store = mockStore({
        selectedTableColumns: []
      });

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      sandbox.mock(ajax)
        .expects('get')
        .withExactArgs('/dhis-integration/api/getColumns', { tableName })
        .returns(Promise.resolve(tableColumns));

      await store.dispatch(MappingActions.getTableColumns(tableName, 'events'));

      expect(store.getActions()).toEqual(expectedActions);
      sandbox.restore();
    });

    it('should dispatch show message when getAllMappings fail', async () => {
      const ajax = new Ajax();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Could not get table columns',
          responseType: 'error'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const store = mockStore({
        selectedInstanceTable: ''
      });

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxGetMock = sandbox.mock(ajax)
        .expects('get')
        .withArgs('/dhis-integration/api/getColumns')
        .returns(Promise.reject({
          message: 'Could not get table columns'
        }));

      try {
        await store.dispatch(MappingActions.getTableColumns('pat_details'));
      } catch (e) {
        expect(store.getActions()).toEqual(expectedActions);
        ajaxGetMock.verify();
      } finally {
        sandbox.restore();
      }
    });
  });

  describe('getTables', () => {
    it('should dispatch tables on ajax success', async () => {
      const tables = ['patient_identifier', 'patient_allergy_view'];
      const ajax = Ajax.instance();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'allTables',
          allTables: tables
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxGetMock = sandbox.mock(ajax)
        .expects('get')
        .withArgs('/dhis-integration/api/getTables')
        .returns(Promise.resolve(tables));

      const store = mockStore({
        allTables: [],
        hideSpinner: false
      });

      await store.dispatch(MappingActions.getTables());
      expect(store.getActions()).toEqual(expectedActions);
      ajaxGetMock.verify();
      sandbox.restore();
    });

    it('should dispatch tables on ajax success', async () => {
      const ajax = Ajax.instance();
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Could not get tables to select',
          responseType: 'error'
        },
        {
          type: 'allTables',
          allTables: []
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxGetMock = sandbox.mock(ajax)
        .expects('get')
        .withArgs('/dhis-integration/api/getTables')
        .returns(Promise.reject({}));

      const store = mockStore({
        allTables: [],
        hideSpinner: false
      });

      try {
        await store.dispatch(MappingActions.getTables());
      } catch (e) {
        expect(store.getActions()).toEqual(expectedActions);
        ajaxGetMock.verify();
      } finally {
        sandbox.restore();
      }
    });
  });

  describe('exportMapping', () => {
    it('should return array of mapping object on ajax success', () => {
      const mappingName = 'HTS Service';
      const responseJson = {
        mapping_name: mappingName,
        lookup_table: {
          value: '{'
                        + '"instance": "patient_details",'
                        + '"enrollments": "enroll",'
                        + '"event": "event_table"'
                        + '}',
          type: 'json'
        },
        mapping_json: {
          value: '{'
                        + '"instance": {'
                        + '"patient_identifier": "fYj7U",'
                        + '"patient_name": "ert76HK"'
                        + '},'
                        + '"enrollments": {'
                        + '"enrollment_id": "fYj7U",'
                        + '"patient_name": "ert76HK"'
                        + '},'
                        + '"event": {'
                        + '"event_id": "fYj7U",'
                        + '"patient_name": "ert76HK"'
                        + '}'
                        + '}',
          type: 'json'
        }
      };
      const dispatchMock = jest.fn();
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxMock = sandbox.mock(ajax);
      const ajaxGetMock = ajaxMock
        .expects('get')
        .withArgs('/dhis-integration/api/getMapping', { mappingName })
        .returns(Promise.resolve(responseJson));

      MappingActions.exportMapping(mappingName, dispatchMock);

      ajaxGetMock.verify();
      sandbox.restore();
    });

    it('should call showMessage on ajax fail', () => {
      const mappingName = 'HTS Service';
      const dispatchMock = jest.fn();
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxMock = sandbox.mock(ajax);
      const ajaxGetMock = ajaxMock
        .expects('get')
        .withArgs('/dhis-integration/api/getMapping', { mappingName })
        .returns(Promise.reject({ message: 'Could not get mapping info' }));
      const actionsMock = sandbox.mock(Actions);
      const showMsgMock = actionsMock.expects('showMessage')
        .withArgs('Could not get mapping info', 'error');

      try {
        MappingActions.exportMapping(mappingName, dispatchMock);
      } catch (e) {
        ajaxGetMock.verify();
        showMsgMock.verify();
      }
      sandbox.restore();
    });
  });

  describe('exportAllMappings', () => {
    it('should return array of mapping object on ajax success', () => {
      const mappingName = 'HTS Service';
      const responseJson = [{
        mapping_name: mappingName,
        lookup_table: {
          value: '{'
                    + '"instance": "patient_details",'
                    + '"enrollments": "enroll",'
                    + '"event": "event_table"'
                    + '}',
          type: 'json'
        },
        mapping_json: {
          value: '{'
                    + '"instance": {'
                    + '"patient_identifier": "fYj7U",'
                    + '"patient_name": "ert76HK"'
                    + '},'
                    + '"enrollments": {'
                    + '"enrollment_id": "fYj7U",'
                    + '"patient_name": "ert76HK"'
                    + '},'
                    + '"event": {'
                    + '"event_id": "fYj7U",'
                    + '"patient_name": "ert76HK"'
                    + '}'
                    + '}',
          type: 'json'
        }
      }];
      const dispatchMock = jest.fn();
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxMock = sandbox.mock(ajax);
      const ajaxGetMock = ajaxMock
        .expects('get')
        .withArgs('/dhis-integration/api/getAllMappings')
        .returns(Promise.resolve(responseJson));

      MappingActions.exportAllMappings(dispatchMock);

      ajaxGetMock.verify();
      sandbox.restore();
    });

    it('should call showMessage on ajax fail', () => {
      const dispatchMock = jest.fn();
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxMock = sandbox.mock(ajax);
      const ajaxGetMock = ajaxMock
        .expects('get')
        .withArgs('/dhis-integration/api/getAllMappings')
        .returns(Promise.reject({ message: 'Could not get mapping info' }));
      const actionsMock = sandbox.mock(Actions);
      const showMsgMock = actionsMock.expects('showMessage')
        .withArgs('Could not get mapping info', 'error');

      try {
        MappingActions.exportAllMappings(dispatchMock);
      } catch (e) {
        ajaxGetMock.verify();
        showMsgMock.verify();
      }
      sandbox.restore();
    });
  });

  describe('importMappings', () => {
    it('should dispatch \'should be array\' message when the imported file does not contain array', async () => {
      const expectedActions = [
        {
          type: 'showMessage',
          responseMessage: 'File should contain array of Object. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        }
      });

      await store.dispatch(MappingActions.importMappings({}));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch \'mappings should not be empty\' message when the imported file contains empty array', async () => {
      const expectedActions = [
        {
          type: 'showMessage',
          responseMessage: 'Imported file should not be empty. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        }
      });

      await store.dispatch(MappingActions.importMappings([]));

      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should dispatch \'mappings name should not be empty\' message when the imported file contains empty mapping name', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Mapping name should have value. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: ''
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'mappings name is invalid\' message when mapping name has other than alphanumeric values', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: '@name is invalid mapping name. Mapping name should be alpha numeric. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: '@name'
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'mappings name should be unique\' message when imported file has duplicate mapping names', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Mapping Name should be unique. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name'
        },
        {
          mapping_name: 'name'
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'lookup_table should be object\' message when lookup_table is not object', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Incorrect values provided for lookup_table property. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: []
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'mapping_json should be object\' message when lookup_table is not object', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Incorrect values provided for mapping_json property. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {},
          mapping_json: []
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'should have value for instance of lookup table \' message when instance of the look_up table does not have value', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Instance table name is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: ''
          },
          mapping_json: {}
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'should have value for enrollments of lookup table \' message when enrollments of the look_up table does not have value', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Enrollments table name is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: ''
          },
          mapping_json: {}
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'should have value for event of lookup table \' message when event of the look_up table does not have value', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Event table name is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: ''
          },
          mapping_json: {}
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'should have value for event of lookup table \' message when event key is missing in lookup_table', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Event table name is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table'
          },
          mapping_json: {}
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'instance mapping is missing\' message when instance key is missing in mapping json', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Instance mapping is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event table'
          },
          mapping_json: {

          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'event mapping is missing\' message when event key is missing in mapping json', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Event mapping is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event table'
          },
          mapping_json: {
            instance: {}
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'mapping_json instance should be object\' message when instance of mapping json is not object', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Incorrect values provided for mapping_json instance property. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments',
            event: 'event'
          },
          mapping_json: {
            instance: [],
            event: []
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'mapping_json event should be object\' message when event of mapping json is not object', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Incorrect values provided for mapping_json event property. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments',
            event: 'event'
          },
          mapping_json: {
            instance: {},
            event: []
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'should have at least one mapping for the instance\' message when instance of the mapping_json is empty object', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Instance mappings is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {},
            event: {}
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'should have at least one mapping for the instance\' message when instance of the mapping_json does not have any mappings', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Instance mappings is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              patient_id: ''
            },
            event: {}
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'should have at least one mapping for the event\' message when events of the mapping_json does not have any mappings', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'Events mappings is missing. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              patient_id: 'mapping1'
            },
            event: {
              event_id: ''
            }
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'All searchable values should contain mapping\' message when events of the mapping_json does not have any mappings', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'All searchable values should contain mapping. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              patient_id: 'mapping1'
            },
            event: {
              event_id: 'dasf'
            }
          },
          config: {
            searchable: ['UIC'],
            comparable: ['patient_id']
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'All comparable values should contain mapping\' message when events of the mapping_json does not have any mappings', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: 'All comparable values should contain mapping. Please correct the file and import again',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        }
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              UIC: 'mapping1'
            },
            event: {
              event_id: 'dasf'
            }
          },
          config: {
            searchable: ['UIC'],
            comparable: ['patient_id']
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'openLatestCompletedEnrollment config value is missing/incorrect\' message when given value is not a string', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: "OpenLatestCompletedEnrollment config value is missing or it is not of type string. Accepted values are 'yes' and 'no'. Please correct the file and import again",
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        },
        allMappingNames: []
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              UIC: 'mapping1',
              patient_id: 'patientId'
            },
            event: {
              event_id: 'dasf'
            }
          },
          config: {
            searchable: ['UIC'],
            comparable: ['patient_id'],
            openLatestCompletedEnrollment: ['Random Value']
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch \'openLatestCompletedEnrollment config value is incorrect\' message when given value is a random value', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'showMessage',
          responseMessage: "OpenLatestCompletedEnrollment config value is incorrect. Accepted values are 'yes' and 'no'. Please correct the file and import again",
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: ''
        },
        allMappingNames: []
      });

      const mappings = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              UIC: 'mapping1',
              patient_id: 'patientId'
            },
            event: {
              event_id: 'dasf'
            }
          },
          config: {
            searchable: ['UIC'],
            comparable: ['patient_id'],
            openLatestCompletedEnrollment: 'Random Value'
          }
        }
      ];

      const sandbox = sinon.createSandbox();
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });
      await store.dispatch(MappingActions.importMappings(mappings));

      expect(store.getActions()).toEqual(expectedActions);
      sessionMock.verify();
      sandbox.restore();
    });

    it('should have current_mapping and user keys for the mapping when imported mapping is already exist and should update', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'superman'
        },
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Successfully Imported',
          responseType: 'success'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: 'superman'
        },
        allMappingNames: ['name']
      });
      const mappingsFromFile = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              patient_id: 'mIsOR6yU'
            },
            event: {
              event_id: 'erJkt4F'
            }
          },
          config: {
            searchable: [],
            comparable: [],
            openLatestCompletedEnrollment: 'yes'
          }
        }
      ];
      const updatedMapping = {
        mapping_name: 'name',
        lookup_table: '{"instance":"instance","enrollments":"enrollments table","event":"event"}',
        mapping_json: '{"instance":{"patient_id":"mIsOR6yU"},"event":{"event_id":"erJkt4F"}}',
        config: '{"searchable":[],"comparable":[],"openLatestCompletedEnrollment":"yes"}',
        current_mapping: 'name',
        user: 'superman'
      };
      const body = [
        JSON.stringify(updatedMapping)
      ];

      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const putMock = sandbox.mock(ajax).expects('put')
        .withArgs('/dhis-integration/api/mappings', body)
        .returns(Promise.resolve({ data: 'Successfully Imported' }));
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'superman' });

      await store.dispatch(MappingActions.importMappings(mappingsFromFile));

      expect(store.getActions()).toEqual(expectedActions);

      putMock.verify();
      sessionMock.verify();
      sandbox.restore();
    });

    it('should have only user keys for the mapping if imported mapping is new and dispatch imported mappings on success', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'superman'
        },
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Successfully Imported',
          responseType: 'success'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'importedMappings',
          mappingNames: ['name']
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: 'superman'
        },
        allMappingNames: []
      });
      const mappingsFromFile = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              patient_id: 'mIsOR6yU'
            },
            event: {
              event_id: 'erJkt4F'
            }
          },
          config: {
            searchable: [],
            comparable: [],
            openLatestCompletedEnrollment: 'yes'
          }
        }
      ];
      const updatedMapping = {
        mapping_name: 'name',
        lookup_table: '{"instance":"instance","enrollments":"enrollments table","event":"event"}',
        mapping_json: '{"instance":{"patient_id":"mIsOR6yU"},"event":{"event_id":"erJkt4F"}}',
        config: '{"searchable":[],"comparable":[],"openLatestCompletedEnrollment":"yes"}',
        user: 'superman'
      };
      const body = [
        JSON.stringify(updatedMapping)
      ];

      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const putMock = sandbox.mock(ajax).expects('put')
        .withArgs('/dhis-integration/api/mappings', body)
        .returns(Promise.resolve({ data: 'Successfully Imported' }));
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'superman' });

      await store.dispatch(MappingActions.importMappings(mappingsFromFile));

      expect(store.getActions()).toEqual(expectedActions);

      putMock.verify();
      sessionMock.verify();
      sandbox.restore();
    });

    it('should not dispatch imported mappings on ajax fail', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'superman'
        },
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'showMessage',
          responseMessage: 'Failed to Import',
          responseType: 'error'
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: 'superman'
        },
        allMappingNames: []
      });
      const mappingsFromFile = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              patient_id: 'mIsOR6yU'
            },
            event: {
              event_id: 'erJkt4F'
            }
          },
          config: {
            searchable: [],
            comparable: [],
            openLatestCompletedEnrollment: 'yes'
          }
        }
      ];
      const updatedMapping = {
        mapping_name: 'name',
        lookup_table: '{"instance":"instance","enrollments":"enrollments table","event":"event"}',
        mapping_json: '{"instance":{"patient_id":"mIsOR6yU"},"event":{"event_id":"erJkt4F"}}',
        config: '{"searchable":[],"comparable":[],"openLatestCompletedEnrollment":"yes"}',
        user: 'superman'
      };
      const body = [
        JSON.stringify(updatedMapping)
      ];

      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const putMock = sandbox.mock(ajax).expects('put')
        .withArgs('/dhis-integration/api/mappings', body)
        .returns(Promise.reject({ message: 'Failed to Import' }));
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'superman' });

      await store.dispatch(MappingActions.importMappings(mappingsFromFile));

      expect(store.getActions()).toEqual(expectedActions);

      putMock.verify();
      sessionMock.verify();
      sandbox.restore();
    });

    it('should dispatch session if the username is empty and imported mappings on success', async () => {
      const expectedActions = [
        {
          type: 'session',
          user: 'admin'
        },
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Successfully Imported',
          responseType: 'success'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        },
        {
          type: 'importedMappings',
          mappingNames: ['name']
        }
      ];
      const store = mockStore({
        showMessage: {
          responseMessage: '',
          responseType: ''
        },
        session: {
          user: 'superman'
        },
        allMappingNames: []
      });
      const mappingsFromFile = [
        {
          mapping_name: 'name',
          lookup_table: {
            instance: 'instance',
            enrollments: 'enrollments table',
            event: 'event'
          },
          mapping_json: {
            instance: {
              patient_id: 'mIsOR6yU'
            },
            event: {
              event_id: 'erJkt4F'
            }
          },
          config: {
            searchable: [],
            comparable: [],
            openLatestCompletedEnrollment: 'yes'
          }
        }
      ];
      const updatedMapping = {
        mapping_name: 'name',
        lookup_table: '{"instance":"instance","enrollments":"enrollments table","event":"event"}',
        mapping_json: '{"instance":{"patient_id":"mIsOR6yU"},"event":{"event_id":"erJkt4F"}}',
        config: '{"searchable":[],"comparable":[],"openLatestCompletedEnrollment":"yes"}',
        user: 'superman'
      };
      const body = [
        JSON.stringify(updatedMapping)
      ];

      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const putMock = sandbox.mock(ajax).expects('put')
        .withArgs('/dhis-integration/api/mappings', body)
        .returns(Promise.resolve({ data: 'Successfully Imported' }));
      const sessionMock = sandbox.mock(Actions).expects('ensureActiveSession')
        .returns({ type: 'session', user: 'admin' });

      await store.dispatch(MappingActions.importMappings(mappingsFromFile));

      expect(store.getActions()).toEqual(expectedActions);

      putMock.verify();
      sessionMock.verify();
      sandbox.restore();
    });
  });
});
