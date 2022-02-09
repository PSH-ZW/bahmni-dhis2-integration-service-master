import 'jsdom-global/register';
import React from 'react';
import thunkMiddleware from 'redux-thunk';
import { configure, mount, render } from 'enzyme';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import SyncDashboard from '../../../main/client/sync/SyncDashboard';
import * as SyncActions from '../../../main/client/sync/actions/SyncActions';

configure({ adapter: new Adapter() });

describe('Sync dashboard', () => {
  let rendered,
    store;

  beforeEach(() => {
    store = createStore(() => ({
      mappingNames: ['HTS Service', 'TB Service'],
      syncDetails: {
        'HTS Service': { date: '2018-10-03 11:21:32.000000', status: '' },
        'TB Service': { date: '2018-10-04 11:21:32.000000', status: '' }
      },
      hideSpinner: false,
      showMessage: {
        responseMessage: '',
        responseType: ''
      },
      session: '{user: \'admin\', privileges: []}'
    }), applyMiddleware(thunkMiddleware));

    rendered = render(
      <Provider store={store}>
        <SyncDashboard
          dispatch={() => {
          }}
          history={{}}
        />
      </Provider>
    );
  });

  it('should have a "service-names-table" table', () => {
    expect(rendered.find('.service-names-table')).toHaveLength(1);
  });

  it('should have two elements with class name "mapping-name"', () => {
    expect(rendered.find('.mapping-name')).toHaveLength(4);
  });

  it('should have two elements with class name "sync-comment"', () => {
    expect(rendered.find('.sync-comment')).toHaveLength(2);
  });

  it('should have two elements with class name "preview-button"', () => {
    expect(rendered.find('.preview-button')).toHaveLength(2);
  });

  it('should have a section header with class name "section-title" button', () => {
    expect(rendered.find('.section-title')).toHaveLength(1);
  });

  it('should have a section header with class name "title-name" button', () => {
    expect(rendered.find('.title-name')).toHaveLength(2);
  });

  it('should have a section header with class name "title-comments" button', () => {
    expect(rendered.find('.title-comments')).toHaveLength(1);
  });

  it('should dispatch sendData on send-button click', () => {
    const history = {};
    const sandbox = sinon.createSandbox();
    const syncMock = sandbox.mock(SyncActions)
      .expects('syncData')
      .withArgs('HTS Service')
      .returns({ type: '' });

    rendered = mount(
      <Provider store={store}>
        <SyncDashboard
          dispatch={() => {}}
          history={history}
        />
      </Provider>
    );

    rendered.find('.send-button').first().simulate('click');

    syncMock.verify();
    sandbox.restore();
  });
});
