import 'jsdom-global/register';
import React from 'react';
import {
    configure, mount, render
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import thunkMiddleware from 'redux-thunk';
import Header from "../../../main/client/common/Header";

configure({ adapter: new Adapter() });


describe('Header', () => {
    let rendered, store;

    beforeEach(() => {
        store = createStore(() => ({
            showHomeButton : true,
            showHeader: true
        }), applyMiddleware(thunkMiddleware));

        rendered = render(
          <Provider store={store}>
            <Header dispatch={() => {}} />
          </Provider>);
    });

    it('should have app-link className', function () {
        expect(rendered.find('.header-wrap-dhis')).toHaveLength(1);
    });

    it('should have back-btn className', function () {
        expect(rendered.find('.back-btn')).toHaveLength(1);
    });

    it('should have back-btn className', function () {
        expect(rendered.find('.fa-home')).toHaveLength(1);
    });

    it('should change path to DHIS2 dashboard when home button clicked from any other page', function () {
        const history = { location: { pathname: '/mapping' }, push: () => {}};

        const sandBox = sinon.createSandbox();

        const pushMock = sandBox.mock(history).expects('push')
            .withArgs('/dhis-integration/');

        history.push = pushMock;

        rendered = mount(
          <Provider store={store}>
            <Header history={history} dispatch={() => {}} />
          </Provider>
        );

        rendered.find('.back-btn').first().simulate('click');

        pushMock.verify();
        sandBox.restore();
    });
});