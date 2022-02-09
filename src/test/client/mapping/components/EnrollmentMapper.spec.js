import 'jsdom-global/register';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { configure, render } from 'enzyme';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import EnrollmentMapper from '../../../../main/client/mapping/components/EnrollmentMapper';

configure({ adapter: new Adapter() });

describe('EnrollmentMapper', () => {
  let rendered;

  beforeEach(() => {
    const store = createStore(() => ({
      selectedEnrollmentsTable: 'patient_details',
      allTables: [],
      selectedEnrollmentTableColumns: [],
      mappingJson: {
        instance: {},
        enrollments: {}
      },
      mappingConfig: {
        openLatestCompletedEnrollment: ''
      }
    }), applyMiddleware(thunkMiddleware));

    rendered = render(
      <Provider store={store}>
        <EnrollmentMapper setOpenLatestCompletedEnrollment={() => {}} />
      </Provider>
    );
  });


  it('should not render ColumnMapping component when selectedEnrollmentTable have value', () => {
    expect(rendered.find('.mapping-table-div')).toHaveLength(0);
  });

  it('should render DisplayColumns', () => {
    expect(rendered.find('.tables-list')).toHaveLength(1);
  });

  it('should have an input box with class name table-input', () => {
    expect(rendered.find('.table-input')).toHaveLength(1);
  });

  it('should not have a span with class name Enrollment-table-span', () => {
    expect(rendered.find('.enrollment-table-span')).toHaveLength(0);
  });

  it('should have a span with class name enrollment-question', () => {
    expect(rendered.find('.enrollment-question')).toHaveLength(1);
  });

  it('should have a span with class name asterisk', () => {
    expect(rendered.find('.asterisk')).toHaveLength(1);
  });

  it('should have a button with id yes', () => {
    expect(rendered.find('#yes')).toHaveLength(1);
  });

  it('should have a button with id no', () => {
    expect(rendered.find('#no')).toHaveLength(1);
  });
});
