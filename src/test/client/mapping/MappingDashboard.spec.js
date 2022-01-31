import 'jsdom-global/register';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import {configure, mount, render} from 'enzyme';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import {BrowserRouter as Router} from 'react-router-dom';
import MappingDashboard from '../../../main/client/mapping/MappingDashboard';

configure({adapter: new Adapter()});

describe('Mapping dashboard', function () {

    let rendered, store;

    beforeEach(() => {
        store = createStore(() => ({
            allMappingNames: ['HTS Service','TB Service'],
            hideSpinner: false,
            showMessage : {
                responseMessage : "",
                responseType: ""
            },
            session: {
                user: "superman"
            }
        }), applyMiddleware(thunkMiddleware));

        rendered = render(
          <Router>
            <Provider store={store}>
              <MappingDashboard
                dispatch={() => {
                  }}
                history={{}}
              />
            </Provider>
          </Router>
        );
    });

    it('should have a "mapping-names-table" table', function () {
        expect(rendered.find('.mapping-names-table')).toHaveLength(1);
    });

    it('should have a "add-mapping-button" button', function () {
        expect(rendered.find('.add-mapping-button')).toHaveLength(1);
    });

    it('should have a "export-all-button" button', function () {
        expect(rendered.find('.export-all-button')).toHaveLength(1);
    });

    it('should have two elements with class name "mapping-name"', function () {
        expect(rendered.find('.mapping-name')).toHaveLength(2);
    });

    it('should have two elements with class name "edit-mapping-button"', function () {
        expect(rendered.find('.edit-mapping-button')).toHaveLength(2);
    });

    it('should have a section header with class name "section-title" button', function () {
        expect(rendered.find('.edit-mapping-button')).toHaveLength(2);
    });

    it('should have two elements with class name "edit-button"', () => {
        expect(rendered.find('.edit-button')).toHaveLength(2);
    });

    it('should call history push on redirect to addEditMapping', () => {
        let history = {
            push : () => {}
        };
        let sandbox = sinon.createSandbox();
        let pushMock = sandbox.mock(history)
            .expects("push")
            .withArgs("/dhis-integration/mapping/new");

        history.push = pushMock;

        rendered = mount(
          <Router>
            <Provider store={store}>
              <MappingDashboard
                dispatch={() => {}}
                history={history}
              />
            </Provider>
          </Router>
        );

        rendered.find('.add-mapping-button').first().simulate('click');

        pushMock.verify();
        sandbox.restore();
    });

    it('should have export button for each service', () => {
        expect(rendered.find('.export-button')).toHaveLength(2);
    });

    it('should have button with import-button as class name', () => {
        expect(rendered.find('.import-button')).toHaveLength(1);
    });

    it('should have input with import-input as class name', function () {
        expect(rendered.find('.import-input')).toHaveLength(1);
    });
});
