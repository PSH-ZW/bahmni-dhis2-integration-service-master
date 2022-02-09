import sinon from 'sinon';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import Ajax from '../../../../main/client/common/Ajax';
import {
  filterValues,
  getLogs,
  getNextPageLogs,
  getPrevPageLogs,
  logs,
  noEventsToDisplay,
  noFilterEventsToDisplay,
  getLogsOnFilter
} from '../../../../main/client/log/actions/LogActions';

const middleWares = [thunk];
const mockStore = configureMockStore(middleWares);
describe('LogActions', () => {
  describe('logs', () => {
    it('should return object with logs as type and empty array as default', () => {
      expect(logs()).toEqual({
        type: 'logs',
        logs: []
      });
    });

    it('should return object with logs as type and given array as logs', () => {
      const logsArr = [{ date_created: '2018-10-12 13:30:30', user: 'superman', service: 'HT Service' }];
      expect(logs(logsArr)).toEqual({
        type: 'logs',
        logs: logsArr
      });
    });
  });

  describe('filterValues', () => {
    it('should return object with filterOn as type and given date and default values for server and user when date is the only param', () => {
      expect(filterValues('2018-10-01 12:00:00')).toEqual({
        type: 'filterOn',
        filter: {
          date: '2018-10-01 12:00:00',
          service: '',
          user: ''
        }
      });
    });

    it('should return object with filterOn as type and given values', () => {
      const date = '2019-10-21 12:00:00';
      const service = 'HT Service';
      const user = 'superman';

      expect(filterValues(date, service, user)).toEqual({
        type: 'filterOn',
        filter: {
          date,
          service,
          user
        }
      });
    });
  });

  describe('noEventsToDisplay', () => {
    it('should return object with noEventsToDisplay as type and false as default value', () => {
      expect(noEventsToDisplay()).toEqual({
        type: 'noEventsToDisplay',
        noEvents: false
      });
    });

    it('should return object with noEventsToDisplay as type and given values', () => {
      expect(noEventsToDisplay(true)).toEqual({
        type: 'noEventsToDisplay',
        noEvents: true
      });
    });
  });

  describe('noFilterEventsToDisplay', () => {
    it('should return object with noFilterEventsToDisplay as type and false as default value', () => {
      expect(noFilterEventsToDisplay()).toEqual({
        type: 'noFilterEventsToDisplay',
        noFilterEvents: false
      });
    });

    it('should return object with noFilterEventsToDisplay as type and given values', () => {
      expect(noFilterEventsToDisplay(true)).toEqual({
        type: 'noFilterEventsToDisplay',
        noFilterEvents: true
      });
    });
  });

  describe('getLogs', () => {
    it('should dispatch logs and noEventsToDisplay as false when server has results', async () => {
      const logsArr = [{ date_created: '2018-10-12 13:30:30', user: 'superman', service: 'HT Service' }];
      const date = '2019-10-01 12:00:00';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'logs',
          logs: logsArr
        },
        {
          type: 'noEventsToDisplay',
          noEvents: false
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [],
        noEventsToDisplay: false
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: false, logId: 0, onLoad: true
        })
        .returns(Promise.resolve(logsArr));

      await store.dispatch(getLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });

    it('should dispatch noEventsToDisplay as true when server has no results', async () => {
      const date = '2019-10-01 12:00:00';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'noEventsToDisplay',
          noEvents: true
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [],
        noEventsToDisplay: false
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: false, logId: 0, onLoad: true
        })
        .returns(Promise.resolve([]));

      await store.dispatch(getLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });

    it('should dispatch error message on ajax fail', async () => {
      const date = '2019-10-01 12:00:00';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Could not get Events',
          responseType: 'error'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [],
        noEventsToDisplay: false,
        showMessage: {
          responseMessage: '',
          responseType: ''
        }
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: false, logId: 0, onLoad: true
        })
        .returns(Promise.reject([]));

      await store.dispatch(getLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });
  });

  describe('getNextPageLogs', () => {
    it('should dispatch logs and noEventsToDisplay as false on server has results for next page', async () => {
      const logsArr = [{ date_created: '2018-10-12 13:30:30', user: 'superman', service: 'HT Service' }];
      const date = '2018-10-12 14:30:30';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'logs',
          logs: logsArr
        },
        {
          type: 'noEventsToDisplay',
          noEvents: false
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [
          {
            date_created: '2018-10-12 13:30:30', user: 'superman', service: 'HT Service', log_id: 1
          },
          {
            date_created: date, user: 'superman', service: 'HT Service', log_id: 2
          }
        ],
        noEventsToDisplay: false
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: false, logId: 2, onLoad: false
        })
        .returns(Promise.resolve(logsArr));

      await store.dispatch(getNextPageLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });

    it('should dispatch noEventsToDisplay as true when server has no results for next page logs', async () => {
      const date = '2018-10-12 14:30:30';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'noEventsToDisplay',
          noEvents: true
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [
          {
            date_created: '2018-10-12 13:30:30', user: 'superman', service: 'HT Service', log_id: 1
          },
          {
            date_created: date, user: 'superman', service: 'HT Service', log_id: 2
          }
        ],
        noEventsToDisplay: false
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: false, logId: 2, onLoad: false
        })
        .returns(Promise.resolve([]));

      await store.dispatch(getNextPageLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });

    it('should dispatch error message on ajax fail for next page logs', async () => {
      const date = '2018-10-12 14:30:30';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Could not get Events',
          responseType: 'error'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [
          {
            date_created: '2018-10-12 13:30:30', user: 'superman', service: 'HT Service', log_id: 1
          },
          {
            date_created: date, user: 'superman', service: 'HT Service', log_id: 2
          }
        ],
        noEventsToDisplay: false,
        showMessage: {
          responseMessage: '',
          responseType: ''
        }
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: false, logId: 2, onLoad: false
        })
        .returns(Promise.reject([]));

      await store.dispatch(getNextPageLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });
  });

  describe('getPrevPageLog', () => {
    it('should dispatch logs and noEventsToDisplay as false when server has results for prev page', async () => {
      const logsArr = [{ date_created: '2018-10-12 13:30:30', user: 'superman', service: 'HT Service' }];
      const date = '2018-10-12 13:30:30';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'logs',
          logs: logsArr
        },
        {
          type: 'noEventsToDisplay',
          noEvents: false
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [
          {
            date_created: date, user: 'superman', service: 'HT Service', log_id: 1
          },
          {
            date_created: '2018-10-12 14:30:30', user: 'superman', service: 'HT Service', log_id: 2
          }
        ],
        noEventsToDisplay: false
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: true, logId: 1, onLoad: false
        })
        .returns(Promise.resolve(logsArr));

      await store.dispatch(getPrevPageLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });

    it('should dispatch noEventsToDisplay as true when server has no results for next page logs', async () => {
      const date = '2018-10-12 13:30:30';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'noEventsToDisplay',
          noEvents: true
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [
          {
            date_created: date, user: 'superman', service: 'HT Service', log_id: 1
          },
          {
            date_created: '2018-10-12 14:30:30', user: 'superman', service: 'HT Service', log_id: 2
          }
        ],
        noEventsToDisplay: false
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: true, logId: 1, onLoad: false
        })
        .returns(Promise.resolve([]));

      await store.dispatch(getPrevPageLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });

    it('should dispatch error message on ajax fail for next page logs', async () => {
      const date = '2018-10-12 13:30:30';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Could not get Events',
          responseType: 'error'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [
          {
            date_created: date, user: 'superman', service: 'HT Service', log_id: 1
          },
          {
            date_created: '2018-10-12 14:30:30', user: 'superman', service: 'HT Service', log_id: 2
          }
        ],
        noEventsToDisplay: false,
        showMessage: {
          responseMessage: '',
          responseType: ''
        }
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: true, logId: 1, onLoad: false
        })
        .returns(Promise.reject([]));

      await store.dispatch(getPrevPageLogs(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });
  });

  describe('getLogsOnFilter', () => {
    it('should dispatch logs and noFilterEventsToDisplay as false on server has results', async () => {
      const logsArr = [{ date_created: '2018-10-12 13:30:30', user: 'superman', service: 'HT Service' }];
      const date = '2019-10-01 12:00:00';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'logs',
          logs: logsArr
        },
        {
          type: 'noEventsToDisplay',
          noEvents: false
        },
        {
          type: 'noFilterEventsToDisplay',
          noFilterEvents: false
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [],
        noFilterEventsToDisplay: false
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: true, logId: 0, onLoad: true
        })
        .returns(Promise.resolve(logsArr));

      await store.dispatch(getLogsOnFilter(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });

    it('should dispatch noEventsToDisplay as true when server has no results', async () => {
      const date = '2019-10-01 12:00:00';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'logs',
          logs: []
        },
        {
          type: 'noEventsToDisplay',
          noEvents: false
        },
        {
          type: 'noFilterEventsToDisplay',
          noFilterEvents: true
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [],
        noFilterEventsToDisplay: false
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: true, logId: 0, onLoad: true
        })
        .returns(Promise.resolve([]));

      await store.dispatch(getLogsOnFilter(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });

    it('should dispatch error message on ajax fail', async () => {
      const date = '2019-10-01 12:00:00';
      const service = 'HT Service';
      const user = 'superman';
      const api = '/dhis-integration/api/logs';
      const expectedActions = [
        {
          type: 'hideSpinner',
          hideSpinner: false
        },
        {
          type: 'showMessage',
          responseMessage: 'Could not get Events',
          responseType: 'error'
        },
        {
          type: 'hideSpinner',
          hideSpinner: true
        }
      ];
      const store = mockStore({
        logs: [],
        noEventsToDisplay: false,
        showMessage: {
          responseMessage: '',
          responseType: ''
        }
      });
      const ajax = Ajax.instance();
      const sandbox = sinon.createSandbox();
      sandbox.stub(Ajax, 'instance').returns(ajax);
      const getMock = sandbox.mock(ajax).expects('get')
        .withExactArgs(api, {
          date, service, user, getAbove: true, logId: 0, onLoad: true
        })
        .returns(Promise.reject([]));

      await store.dispatch(getLogsOnFilter(date, service, user));

      expect(store.getActions()).toEqual(expectedActions);

      getMock.verify();
      sandbox.restore();
    });
  });
});
