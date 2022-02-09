import {
  mappingNames,
  syncDetails
} from '../../../../main/client/sync/reducers/SyncReducer';

describe('#syncReducers', () => {
  let action,
    state;

  describe('mappingNames', () => {
    beforeEach(() => {
      action = {
        type: 'mappingNames',
        mappingNames: []
      };
    });

    it('should return state when "action.type" is anything other than "mappingNames"', () => {
      state = ['someValue'];
      expect(mappingNames(state)).toEqual(['someValue']);
    });

    it('should return action.mappingNames when "action.type" is mappingNames', () => {
      action.mappingNames = ['patient_identifier', 'tb-service'];
      expect(mappingNames(state, action)).toEqual(['patient_identifier', 'tb-service']);
    });

    it('should return state when "action.type" is anything other than "mappingNames"', () => {
      expect(mappingNames()).toEqual([]);
    });
  });

  describe('syncDetails', () => {
    beforeEach(() => {
      action = {
        type: 'syncDetails',
        syncDetails: {}
      };
    });

    it('should return state when "action.type" is anything other than "syncDetails"', () => {
      state = ['someValue'];
      expect(syncDetails(state)).toEqual(['someValue']);
    });

    it('should return action.syncDetails when "action.type" is syncDetails', () => {
      const syncDetailsData = {
        'HTS Service': { date: '2018-10-03 11:21:32.000000', status: '' },
        'TB Service': { date: '2018-10-04 11:21:32.000000', status: '' }
      };
      action.syncDetails = syncDetailsData;
      expect(syncDetails(state, action)).toEqual(syncDetailsData);
    });

    it('should return state when "action.type" is anything other than "syncDetails"', () => {
      expect(syncDetails()).toEqual({});
    });
  });
});
