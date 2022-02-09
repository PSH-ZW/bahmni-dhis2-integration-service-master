import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { configure, render } from 'enzyme';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import LogDashboard from '../../../../main/client/log/components/LogDashboard';

configure({ adapter: new Adapter() });

describe('LogDashboard', () => {
  let rendered;
  let store;

  beforeEach(() => {
    store = createStore(() => ({
      noEventsToDisplay: true,
      noFilterEventsToDisplay: true,
      logs: [],
      filters: {
        date: '',
        service: '',
        user: ''
      },
      showMessage: {
        responseMessage: '',
        responseType: ''
      },
      hideSpinner: true
    }), applyMiddleware(thunkMiddleware));

    rendered = render(
      <Provider store={store}>
        <LogDashboard />
      </Provider>
    );
  });

  it('should have filters class name for log filters', () => {
    expect(rendered.find('.filters')).toHaveLength(1);
  });

  it('should have log-table-page class name for log table', () => {
    expect(rendered.find('.log-table-page')).toHaveLength(1);
  });

  it('should have log-navigation class name for log navigation', () => {
    expect(rendered.find('.log-navigation')).toHaveLength(1);
  });

  it('should have no-events class name when noEvents or noFilterEvents from store is true', () => {
    expect(rendered.find('.no-events')).toHaveLength(2);
  });

  it('should not have no-events class name when noEvents or noFilterEvents from store is false', () => {
    store = createStore(() => ({
      noEventsToDisplay: false,
      noFilterEventsToDisplay: false,
      logs: [],
      filters: {
        date: '',
        service: '',
        user: ''
      },
      showMessage: {
        responseMessage: '',
        responseType: ''
      },
      hideSpinner: true
    }), applyMiddleware(thunkMiddleware));

    rendered = render(
      <Provider store={store}>
        <LogDashboard />
      </Provider>
    );
    expect(rendered.find('.no-events')).toHaveLength(0);
  });

  it('should have no-events class name when either of noEvents or noFilterEvents from store is true', () => {
    store = createStore(() => ({
      noEventsToDisplay: false,
      noFilterEventsToDisplay: true,
      logs: [],
      filters: {
        date: '',
        service: '',
        user: ''
      },
      showMessage: {
        responseMessage: '',
        responseType: ''
      },
      hideSpinner: true
    }), applyMiddleware(thunkMiddleware));

    rendered = render(
      <Provider store={store}>
        <LogDashboard />
      </Provider>
    );
    expect(rendered.find('.no-events')).toHaveLength(1);
  });

  it('should not have overlay class name when hideSpinner is true', () => {
    expect(rendered.find('.overlay')).toHaveLength(0);
  });

  it('should have overlay class name when hideSpinner is false', () => {
    store = createStore(() => ({
      noEventsToDisplay: false,
      noFilterEventsToDisplay: true,
      logs: [],
      filters: {
        date: '',
        service: '',
        user: ''
      },
      showMessage: {
        responseMessage: '',
        responseType: ''
      },
      hideSpinner: false
    }), applyMiddleware(thunkMiddleware));

    rendered = render(
      <Provider store={store}>
        <LogDashboard />
      </Provider>
    );
    expect(rendered.find('.overlay')).toHaveLength(1);
  });
});
