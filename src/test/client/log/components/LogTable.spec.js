import 'jsdom-global/register';
import React from 'react';
import {configure, render, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import sinon from 'sinon';
import LogTable from "../../../../main/client/log/components/LogTable";
import * as LogActions from "../../../../main/client/log/actions/LogActions";

configure({adapter: new Adapter()});

describe("LogTable", () => {
    let rendered, store;

    beforeEach(() => {
        store = createStore(() => ({
            logs: []
        }), applyMiddleware(thunkMiddleware));

        rendered = render(
          <Provider store={store}>
            <LogTable dispatch={() => {
                }}
            />
          </Provider>
        );
    });

    it('should have log-table-section class name', function () {
        expect(rendered.find('.log-table-section')).toHaveLength(1);
    });

    it('should have log-table class name', function () {
        expect(rendered.find('.log-table')).toHaveLength(1);
    });

    it('should have log-row-header class name', function () {
        expect(rendered.find('.log-row-header')).toHaveLength(1);
    });

    it('should not have log-header class name when logs are empty', function () {
        expect(rendered.find('.log-header')).toHaveLength(0);
    });

    it('should not have log-row class name when logs are empty', function () {
        expect(rendered.find('.log-row')).toHaveLength(0);
    });

    it('should have log-header class name for all headers when logs are there', () => {
        let logs = [
            {date_created: "2018-10-13 12:00:00", synced_by: "superman", program: "HT Service", log_id: 1},
            {date_created: "2018-10-13 13:00:00", synced_by: "superman", program: "HT Service", log_id: 2}
        ];
        store = createStore(() => ({
            logs
        }), applyMiddleware(thunkMiddleware));

        rendered = render(
          <Provider store={store}>
            <LogTable dispatch={() => {
                }}
            />
          </Provider>
        );

        expect(rendered.find('.log-header')).toHaveLength(3);
    });

    it('should have log-row class name for all rows when logs are there', () => {
        let logs = [
            {date_created: "2018-10-13 12:00:00", synced_by: "superman", program: "HT Service", log_id: 1},
            {date_created: "2018-10-13 13:00:00", synced_by: "superman", program: "HT Service", log_id: 2}
        ];
        store = createStore(() => ({
            logs
        }), applyMiddleware(thunkMiddleware));

        rendered = render(
          <Provider store={store}>
            <LogTable dispatch={() => {
                }}
            />
          </Provider>
        );

        expect(rendered.find('.log-row')).toHaveLength(2);
    });

    it('should dispatch getLogs on component did mount', () => {
        let sandbox = sinon.createSandbox();

        let logActions = sandbox.mock(LogActions);
        let getLogsMock = logActions.expects('getLogs').returns({type: {}});
        let filterMock = logActions.expects('filterValues').returns({type: {}});

        store = createStore(() => ({
            logs: []
        }), applyMiddleware(thunkMiddleware));

        rendered = mount(
          <Provider store={store}>
            <LogTable dispatch={() => {
                }}
            />
          </Provider>
        );

        getLogsMock.verify();
        filterMock.verify();
        sandbox.restore();
    });
});
