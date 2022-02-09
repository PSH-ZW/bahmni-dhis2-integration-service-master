import 'jsdom-global/register';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { configure, render, mount } from 'enzyme';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import DescribeFilteredTable from '../../../../main/client/mapping/components/DescribeFilteredTable';
import * as MappingActions from '../../../../main/client/mapping/actions/MappingActions';

configure({ adapter: new Adapter() });

describe('DescribeFilteredTable', () => {
  it('should render ColumnMapping component when selectedInstanceTable have value', () => {
    const rendered = getDescribeRenderer({ instance: 'pat_identifier', enrollments: '', event: '' }, false);
    expect(rendered.find('.mapping-table-div')).toHaveLength(1);
  });

  it('should render DisplayColumns', () => {
    const describeRenderer = getDescribeRenderer();

    expect(describeRenderer.find('.tables-list')).toHaveLength(3);
  });

  it('should have an 4 input element', () => {
    const describeRenderer = getDescribeRenderer();
    expect(describeRenderer.find('input')).toHaveLength(4);
  });

  it('should have a footer and cancel className', () => {
    const describeRenderer = getDescribeRenderer();
    expect(describeRenderer.find('.footer')).toHaveLength(1);
    expect(describeRenderer.find('.cancel')).toHaveLength(1);
    expect(describeRenderer.find('.save')).toHaveLength(0);
  });

  it('should have a save className when there are 3 selected tables', () => {
    const describeRenderer = getDescribeRenderer({ instance: 'someTable', enrollments: 'someTable', event: 'someTable' });
    expect(describeRenderer.find('.footer')).toHaveLength(1);
    expect(describeRenderer.find('.cancel')).toHaveLength(1);
    expect(describeRenderer.find('.save')).toHaveLength(1);
  });

  it('should not have overlay className when hideSpinner is true', () => {
    const describeRenderer = getDescribeRenderer();
    expect(describeRenderer.find('.overlay')).toHaveLength(0);
  });

  it('should have overlay className when hideSpinner is false', () => {
    const describeRenderer = getDescribeRenderer({ instance: '', enrollments: '', event: '' }, false);
    expect(describeRenderer.find('.overlay')).toHaveLength(1);
  });


  it('should call push on history on cancel click', () => {
    const sandbox = sinon.createSandbox();
    const history = {
      push: () => {}
    };
    const pushMock = sandbox.mock(history).expects('push')
      .withArgs('/dhis-integration/mapping');
    const mappingActions = sandbox.mock(MappingActions);
    const selectedInstanceTable = mappingActions.expects('selectedInstanceTable')
      .returns({ type: '' });
    const selectedEnrollmentsTable = mappingActions.expects('selectedEnrollmentsTable')
      .returns({ type: '' });
    const selectedEventTable = mappingActions.expects('selectedEventTable')
      .returns({ type: '' });
    const currentMapping = mappingActions.expects('currentMapping')
      .returns({ type: '' });
    const mappingJson = mappingActions.expects('mappingJson')
      .returns({ type: '' });

    const mappingConfig = mappingActions.expects('mappingConfig')
      .returns({ type: '' });

    history.push = pushMock;

    const describeRenderer = getDescribeMount(history);
    describeRenderer.find('.cancel').first().simulate('click');

    pushMock.verify();
    selectedInstanceTable.verify();
    selectedEnrollmentsTable.verify();
    selectedEventTable.verify();
    currentMapping.verify();
    mappingJson.verify();
    mappingConfig.verify();
    sandbox.restore();
  });


  it('should call dispatch saveMapping on save click', () => {
    const sandbox = sinon.createSandbox();
    const mappingActions = sandbox.mock(MappingActions);
    const docMock = sandbox.mock(document);
    const instanceMapping = docMock.expects('getElementsByClassName')
      .withArgs('instance');
    const eventMapping = docMock.expects('getElementsByClassName')
      .withArgs('events');
    const saveMappingMock = mappingActions.expects('saveMappings')
      .returns({ type: '' });

    const describeRenderer = getDescribeMount();
    describeRenderer.find('.save').first().simulate('click');

    docMock.verify();
    instanceMapping.verify();
    eventMapping.verify();
    saveMappingMock.verify();
    sandbox.restore();
  });

  function getDescribeRenderer(selectTable = { instance: '', enrollments: '', event: '' }, hideSpinner = true) {
    const store = createStore(() => ({
      selectedInstanceTable: selectTable.instance,
      selectedEnrollmentsTable: selectTable.enrollments,
      selectedEventTable: selectTable.event,
      allTables: [
        'patient_identifier',
        'hiv_self_testing',
        'bed_patient_assignment_default',
        'patient_encounter_details_default',
        'patient_allergy_status_default'
      ],
      selectedInstanceTableColumns: [
        'id',
        'name'
      ],
      selectedEnrollmentTableColumns: [
        'enrollId',
        'programName'
      ],
      selectedEventTableColumns: [
        'event_id',
        'patient_id'
      ],
      mappingConfig: {
        searchable: ['patient_id', 'visit_id'],
        openLatestCompletedEnrollment: ''
      },
      filteredInstanceTables: [],
      showMessage: {
        responseMessage: '',
        responseType: ''
      },
      hideSpinner,
      currentMapping: '',
      mappingJson: {
        instance: {},
        enrollments: {},
        event: {}
      }
    }), applyMiddleware(thunkMiddleware));

    return (render(
      <Provider store={store}>
        <DescribeFilteredTable
          dispatch={() => {
          }}
          history={{}}
          columns={[]}
          match={{ params: { mappingName: undefined } }}
        />
      </Provider>
    ));
  }

  function getDescribeMount(history = {}) {
    const store = createStore(() => ({
      selectedInstanceTable: 'instanceTable',
      selectedEnrollmentsTable: 'enrollmentsTable',
      selectedEventTable: 'eventTable',
      hideSpinner: true,
      currentMapping: 'current mapping',
      allTables: [
        'patient_identifier',
        'hiv_self_testing',
        'bed_patient_assignment_default',
        'patient_encounter_details_default',
        'patient_allergy_status_default'
      ],
      selectedInstanceTableColumns: [
        'id',
        'name'
      ],
      selectedEnrollmentTableColumns: [
        'enrollId',
        'programName'
      ],
      selectedEventTableColumns: [
        'event_id',
        'patient_id'
      ],
      filteredInstanceTables: [],
      showMessage: {
        responseMessage: '',
        responseType: ''
      },
      mappingJson: {
        instance: {},
        enrollments: {},
        event: {}
      },
      mappingConfig: {
        searchable: [],
        openLatestCompletedEnrollment: ''
      }
    }), applyMiddleware(thunkMiddleware));

    return (mount(
      <Provider store={store}>
        <DescribeFilteredTable
          dispatch={() => {
          }}
          history={history}
          match={{ params: { mappingName: undefined } }}
        />
      </Provider>
    ));
  }
});
