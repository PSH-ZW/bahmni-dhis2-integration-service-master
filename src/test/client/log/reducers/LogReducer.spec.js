import {
  logs,
  filters,
  noEventsToDisplay,
  noFilterEventsToDisplay
} from '../../../../main/client/log/reducers/LogReducer';

describe('LogReducer', () => {
  describe('logs', () => {
    it('should return empty array on default', () => {
      expect(logs()).toEqual([]);
    });

    it('should return action logs when action type is logs', () => {
      const state = [];
      const logsObj = [{ date_created: '2018-02-10', user: 'superman' }];
      const action = {
        type: 'logs',
        logs: logsObj
      };
      expect(logs(state, action)).toEqual(logsObj);
    });

    it('should return state when action type is other than logs', () => {
      const state = [];
      const logsObj = [{ date_created: '2018-02-10', user: 'superman' }];
      const action = {
        type: 'not logs',
        logs: logsObj
      };
      expect(logs(state, action)).toEqual([]);
    });
  });

  describe('filters', () => {
    it('should return default state when no parameters sent', () => {
      expect(filters()).toEqual({});
    });

    it('should return action filters when action type is filterOn', () => {
      const state = {};
      const filterObj = {
        date: '2018-10-08 13:30:40',
        service: 'HT Service',
        user: 'superman'
      };
      const action = {
        type: 'filterOn',
        filter: filterObj
      };
      expect(filters(state, action)).toEqual(filterObj);
    });

    it('should return state when action type is other than filterOn', () => {
      const state = {};
      const filterObj = {
        date: '2018-10-08 13:30:40',
        service: 'HT Service',
        user: 'superman'
      };
      const action = {
        type: 'no filter',
        filter: filterObj
      };
      expect(filters(state, action)).toEqual({});
    });
  });

  describe('noEventsToDisplay', () => {
    it('should return default state when no parameters sent', () => {
      expect(noEventsToDisplay()).toBeFalsy();
    });

    it('should return action filters when action type is noEventsToDisplay', () => {
      const state = false;
      const action = {
        type: 'noEventsToDisplay',
        noEvents: true
      };
      expect(noEventsToDisplay(state, action)).toBeTruthy();
    });

    it('should return state when action type is other than noEventsToDisplay', () => {
      const state = false;
      const action = {
        type: 'no events',
        noEvents: true
      };
      expect(noEventsToDisplay(state, action)).toBeFalsy();
    });
  });

  describe('noFilterEventsToDisplay', () => {
    it('should return default state when no parameters sent', () => {
      expect(noFilterEventsToDisplay()).toBeFalsy();
    });

    it('should return action filters when action type is noFilterEventsToDisplay', () => {
      const state = false;
      const action = {
        type: 'noFilterEventsToDisplay',
        noFilterEvents: true
      };
      expect(noFilterEventsToDisplay(state, action)).toBeTruthy();
    });

    it('should return state when action type is other than noFilterEventsToDisplay', () => {
      const state = false;
      const action = {
        type: 'no filter events',
        noFilterEvents: true
      };
      expect(noFilterEventsToDisplay(state, action)).toBeFalsy();
    });
  });
});
