import 'jsdom-global/register';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { configure, render, mount } from 'enzyme';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import LogFilters from '../../../../main/client/log/components/LogFilters';
import * as LogActions from '../../../../main/client/log/actions/LogActions';

configure({ adapter: new Adapter() });

describe('LogFilters', () => {
  let rendered;
  let store;

  beforeEach(() => {
    store = createStore(() => ({
      showMessage: {
        responseMessage: '',
        responseType: ''
      }
    }), applyMiddleware(thunkMiddleware));

    rendered = render(
      <Provider store={store}>
        <LogFilters />
      </Provider>
    );
  });

  it('should have filter-text class name', () => {
    expect(rendered.find('.filter-text')).toHaveLength(1);
  });

  it('should have filter-on class name', () => {
    expect(rendered.find('.filter-on')).toHaveLength(3);
  });

  it('should have date-picker class name', () => {
    expect(rendered.find('.date-picker')).toHaveLength(1);
  });

  it('should have time-picker class name', () => {
    expect(rendered.find('.time-picker')).toHaveLength(1);
  });

  it('should have filter-input class name', () => {
    expect(rendered.find('.filter-input')).toHaveLength(2);
  });

  it('should have filter-button class name', () => {
    expect(rendered.find('.filter-button')).toHaveLength(1);
  });

  it('should have fa-filter class name', () => {
    expect(rendered.find('.fa-filter')).toHaveLength(1);
  });

  it('should dispatch required actions on filter-button click', () => {
    const sandBox = sinon.createSandbox();
    const logActionsMock = sandBox.mock(LogActions);
    const filterValuesMock = logActionsMock.expects('filterValues').returns({ type: '' });
    const getUrcMock = logActionsMock.expects('getUtcFromLocal').returns({ type: '' });
    const getLogsMock = logActionsMock.expects('getLogsOnFilter').returns({ type: '' });

    store = createStore(() => ({
      showMessage: {
        responseMessage: '',
        responseType: ''
      }
    }), applyMiddleware(thunkMiddleware));

    rendered = mount(
      <Provider store={store}>
        <LogFilters />
      </Provider>
    );
    rendered.find('.filter-button').first().simulate('click');

    filterValuesMock.verify();
    getUrcMock.verify();
    getLogsMock.verify();
    sandBox.restore();
  });
});
