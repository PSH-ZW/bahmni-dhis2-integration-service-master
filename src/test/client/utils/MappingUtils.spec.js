import assert from 'assert';
import { filterTables } from '../../../main/client/utils/MappingUtil';

describe('MappingUtils', () => {
  describe('filterTables', () => {
    let allTables;

    beforeEach(() => {
      allTables = [
        'meta_data_dictionary',
        'abuseFormTemplate',
        'ADDRESS_HIERARCHY_LEVEL_DEFAULT',
        'aivc_have_you_had_oral_thrush',
        'aivc_have_you_had_swelling_of',
        'aivc_heent_if_yes_specify_details'
      ];
    });

    it('should return empty array when searchText\'s length is less than 3', () => {
      assert.deepStrictEqual(filterTables('av', allTables), []);
    });

    it('should return array of tableNames when searchText is longer than 3 characters', () => {
      assert.deepStrictEqual(filterTables('meta', allTables), ['meta_data_dictionary']);
    });

    it('should return array of tableNames which contain the searchText when searchText is completely CAPITAL and table name is completely SMALL', () => {
      assert.deepStrictEqual(filterTables('META', allTables), ['meta_data_dictionary']);
    });

    it('should return array of tableNames which contain the searchText when searchText is completely SMALL and table name is completely SMALL', () => {
      assert.deepStrictEqual(filterTables('meta', allTables), ['meta_data_dictionary']);
    });

    it('should return array of tableNames which contain the searchText when searchText is completely SMALL and table name is completely CAPITAL', () => {
      assert.deepStrictEqual(filterTables('hiera', allTables), ['ADDRESS_HIERARCHY_LEVEL_DEFAULT']);
    });

    it('should return array of tableNames which contain the searchText when searchText is completely CAPITAL and table name is completely CAPITAL', () => {
      assert.deepStrictEqual(filterTables('HIERA', allTables), ['ADDRESS_HIERARCHY_LEVEL_DEFAULT']);
    });

    it('should return array of tableNames which contain the searchText when searchText is having BOTH CASES and table name is completely CAPITAL', () => {
      assert.deepStrictEqual(filterTables('HiErA', allTables), ['ADDRESS_HIERARCHY_LEVEL_DEFAULT']);
    });

    it('should return array of tableNames which contain the searchText when searchText is having BOTH CASES and table name is completely SMALL', () => {
      assert.deepStrictEqual(filterTables('MeTa', allTables), ['meta_data_dictionary']);
    });

    it('should return array of tableNames which contain the searchText when searchText is having BOTH CASES and table name is having BOTH CASES', () => {
      assert.deepStrictEqual(filterTables('FoRmT', allTables), ['abuseFormTemplate']);
    });

    it('should return array of tableNames which contain the searchText when searchText is completely CAPITAL and table name is having BOTH CASES', () => {
      assert.deepStrictEqual(filterTables('FORMT', allTables), ['abuseFormTemplate']);
    });

    it('should return array of tableNames which contain the searchText when searchText is completely SMALL and table name is having BOTH CASES', () => {
      assert.deepStrictEqual(filterTables('formt', allTables), ['abuseFormTemplate']);
    });
  });
});
