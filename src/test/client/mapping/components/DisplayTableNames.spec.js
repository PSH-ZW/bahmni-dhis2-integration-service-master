import 'jsdom-global/register';
import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import * as MappingActions from '../../../../main/client/mapping/actions/MappingActions';
import DisplayTableNames from '../../../../main/client/mapping/components/DisplayTableNames';

configure({ adapter: new Adapter() });


describe('DisplayTableNames', () => {
  let rendered;

  beforeEach(() => {

    rendered = mount(
      <DisplayTableNames
        dispatch={() => {}}
        filteredTables={['pat_identifier', 'program']}
        filteredTablesAction={()=>{}}
        category=""
      />
    );
  });

  it('should have ul element with type none', () => {
    expect(rendered.find('ul')).toHaveLength(1);
    expect(rendered.find('ul').props().type).toEqual('none');
  });

  describe('#li elements', () => {
    it('should have two li elements', () => {
      const liElements = rendered.find('li');
      expect(liElements).toHaveLength(2);
    });

    it('should have filteredInstanceTables as li elements', () => {
      const liElements = rendered.find('li');
      expect(liElements.first().text()).toEqual('pat_identifier');
      expect(liElements.at(1).text()).toEqual('program');
    });

    it('should dispatch getTableColumns on click on li element', () => {
      const sandBox = sinon.createSandbox();

        let mappingActions = sandBox.mock(MappingActions);
        const getTableColumn = mappingActions.expects('getTableColumns')
        .withArgs('pat_identifier')
        .returns({
          type: 'selectedInstanceTable',
          selectedInstanceTable: 'pat_identifier'
        });

      rendered.find('li').first().simulate('click', { target: { dataset: { tableName: 'pat_identifier' } } });

      getTableColumn.verify();

      sandBox.restore();
    });
  });
});
