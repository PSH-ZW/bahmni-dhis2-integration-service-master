import 'jsdom-global/register';
import 'jsdom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import * as SyncActions from '../../../../main/client/sync/actions/SyncActions';
import Ajax from '../../../../main/client/common/Ajax';
import { sync } from '../../../../main/client/common/constants';

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);

describe('#syncActions', () => {
  describe('#comment', () => {
    it('should dispatch error message in the absence of comment', async () => {
      const mappingName = 'HTS Service';
      const user = 'admin';
      const expectedActions = [
        {
          responseMessage: 'Enter comment before syncing HTS Service',
          responseType: 'error',
          type: 'showMessage'
        }
      ];

      const store = mockStore({});
      await store.dispatch(SyncActions.syncData(mappingName, user, ''));

      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('#syncData', () => {
    it('should dispatch success message after an ajax call', async () => {
      const ajax = new Ajax();
      const mappingName = 'HTS Service';
      const user = 'admin';
      const comment = 'First Sync';
      const expectedActions = [
        { responseMessage: 'Sync started for HTS Service', responseType: 'success', type: 'showMessage' }
      ];

      const store = mockStore({});

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxMock = sandbox.mock(ajax);
      const ajaxPutMock = ajaxMock
        .expects('put')
        .withArgs(sync.URI, { service: mappingName, user, comment });

      await store.dispatch(SyncActions.syncData(mappingName, user, comment));

      expect(store.getActions()).toEqual(expectedActions);

      ajaxPutMock.verify();
      sandbox.restore();
    });

    it('should dispatch syncFailed error message when there is other error than NoDataToSync from ajax', async () => {
      const ajax = new Ajax();
      const mappingName = 'HTS Service';
      const user = 'admin';
      const comment = 'some comments';
      const expectedActions = [
        {
          responseMessage: 'Sync started for HTS Service',
          responseType: 'success',
          type: 'showMessage'
        },
        {
          responseMessage: 'Sync failed. Please check the logs for more information',
          responseType: 'error',
          type: 'showMessage'
        }
      ];

      const store = mockStore({});

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxMock = sandbox.mock(ajax);
      const message = { message: '500 SYNC FAILED', status: 500 };
      const response = {
        status: 500,
        json: () => Promise.resolve(message)
      };
      const ajaxPutMock = ajaxMock
        .expects('put')
        .withArgs(sync.URI, { service: mappingName, user, comment })
        .returns(Promise.reject(response));

      await store.dispatch(SyncActions.syncData(mappingName, user, comment));

      expect(store.getActions()).toEqual(expectedActions);

      ajaxPutMock.verify();
      sandbox.restore();
    });

    it('should dispatch error message when there is error from ajax', async () => {
      const ajax = new Ajax();
      const mappingName = 'HTS Service';
      const user = 'admin';
      const comment = 'some comments';
      const expectedActions = [
        {
          responseMessage: 'Sync started for HTS Service',
          responseType: 'success',
          type: 'showMessage'
        },
        {
          responseMessage: `No delta data to sync for ${mappingName}`,
          responseType: 'error',
          type: 'showMessage'
        }
      ];

      const store = mockStore({});

      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const ajaxMock = sandbox.mock(ajax);
      const message = { message: '500 NO DATA TO SYNC', status: 500 };
      const response = {
        status: 500,
        json: () => Promise.resolve(message)
      };
      const ajaxPutMock = ajaxMock
        .expects('put')
        .withArgs(sync.URI, { service: mappingName, user, comment })
        .returns(Promise.reject(response));

      await store.dispatch(SyncActions.syncData(mappingName, user, comment));

      expect(store.getActions()).toEqual(expectedActions);

      ajaxPutMock.verify();
      sandbox.restore();
    });
  });

  describe('mappingNames', () => {
    it('should return an empty array', () => {
      expect(SyncActions.mappingNames()).toEqual({
        type: 'mappingNames',
        mappingNames: []
      });
    });

    it('should return selected table columns in an array', () => {
      expect(SyncActions.mappingNames(['HTS Service', 'TB Service'])).toEqual({
        type: 'mappingNames',
        mappingNames: ['HTS Service', 'TB Service']
      });
    });
  });

  describe('syncDetails', () => {
    it('should return an empty object', () => {
      expect(SyncActions.syncDetails()).toEqual({
        type: 'syncDetails',
        syncDetails: {}
      });
    });

    it('should return selected table columns in an array', () => {
      const syncDetails = {
        'HTS Service': { date: '2018-10-03 11:21:32.000000', status: '' },
        'TB Service': { date: '2018-10-04 11:21:32.000000', status: '' }
      };
      expect(SyncActions.syncDetails(syncDetails)).toEqual({
        type: 'syncDetails',
        syncDetails
      });
    });
  });
});
