import 'jsdom-global/register';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import {configure, render, mount} from 'enzyme';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import Message from '../../../main/client/common/Message';
import * as Actions from '../../../main/client/common/Actions';

configure({adapter: new Adapter()});

describe('Message', () => {
    it('should have only error related class names when responseType is error', () => {
        let store = createStore(() => ({
            showMessage : {
                responseMessage : "message",
                responseType : "error"
            }
        }), applyMiddleware(thunkMiddleware));

        let renderer = render(
          <Provider store={store}>
            <Message dispatch={() => {}} />
          </Provider>
        );

        expect(renderer.find('.message-container')).toHaveLength(1);
        expect(renderer.find('.error-message-container')).toHaveLength(1);
        expect(renderer.find('.message-text')).toHaveLength(1);
        expect(renderer.find('.types-for-errors')).toHaveLength(1);
        expect(renderer.find('.button-wrapper')).toHaveLength(1);
        expect(renderer.find('.success-message-container')).toHaveLength(0);
        expect(renderer.find('message-icon')).toHaveLength(0);
        expect(renderer.find('message-text')).toHaveLength(0);
    });

    it('should have only success related class names when responseType is success', () => {
        let store = createStore(() => ({
            showMessage : {
                responseMessage : "message",
                responseType : "success"
            }
        }), applyMiddleware(thunkMiddleware));

        let renderer = render(
          <Provider store={store}>
            <Message dispatch={() => {}} />
          </Provider>
        );

        expect(renderer.find('.message-container')).toHaveLength(1);
        expect(renderer.find('.error-message-container')).toHaveLength(0);
        expect(renderer.find('.types-for-errors')).toHaveLength(0);
        expect(renderer.find('.button-wrapper')).toHaveLength(0);
        expect(renderer.find('.success-message-container')).toHaveLength(1);
        expect(renderer.find('.message-icon')).toHaveLength(1);
        expect(renderer.find('.message-text')).toHaveLength(1);
    });

    it('should call showMessage with empty args on ok button click', () => {
        let sandbox = sinon.createSandbox();

        let store = createStore(() => ({
            showMessage : {
                responseMessage : "message",
                responseType : "error"
            }
        }), applyMiddleware(thunkMiddleware));

        let showMessageMock = sandbox.mock(Actions).expects("showMessage").returns({ type: '' });

        let renderer = mount(
          <Provider store={store}>
            <Message dispatch={() => {}} />
          </Provider>
        );

        expect(renderer.find('.show-btn')).toHaveLength(1);
        renderer.find('.show-btn').first().simulate('click');

        showMessageMock.verify();
        sandbox.restore();
    });

    it('should call showMessage after 3 seconds of render when type is success', () => {
        let sandbox = sinon.createSandbox();

        let store = createStore(() => ({
            showMessage : {
                responseMessage : "message",
                responseType : "success"
            }
        }), applyMiddleware(thunkMiddleware));

        let showMessageMock = sandbox.mock(Actions).expects("showMessage").returns({ type: '' });

        mount(
          <Provider store={store}>
            <Message dispatch={() => {}} />
          </Provider>
        );

        setTimeout(() => showMessageMock.verify(), 3000);
        sandbox.restore();
    });

    it('should return empty when message is empty', () => {
        let store = createStore(() => ({
            showMessage : {
                responseMessage : "",
                responseType : "success"
            }
        }), applyMiddleware(thunkMiddleware));

        let renderer = render(
          <Provider store={store}>
            <Message dispatch={() => {}} />
          </Provider>
        );

        expect(renderer.html()).toBeNull();
    });
});