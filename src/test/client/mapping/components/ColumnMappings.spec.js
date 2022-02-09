import 'jsdom-global/register';
import React from 'react';
import { configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ColumnMappings from '../../../../main/client/mapping/components/ColumnMappings';

configure({ adapter: new Adapter() });


describe('ColumnMappings', () => {
  let rendered;

  beforeEach(() => {
    rendered = render(
      <ColumnMappings
        dispatch={() => {
        }}
        columns={['pat_id', 'pat_name']}
        mappingJson={{}}
        category=""
        dhisMappingHeader="DHIS2 Data Element ID"
        mappingConfig={{ searchable: [] }}
      />
    );
  });

  it('should have table element with two children', () => {
    expect(rendered.find('.mapping-table')).toHaveLength(1);
    expect(rendered.find('.mapping-column-name')).toHaveLength(2);
  });

  it('should have table headers ', () => {
    const tableHeader = rendered.find('tr')[0];
    const tableHeaderFirstElement = tableHeader.children[0];
    const tableHeaderSecondElement = tableHeader.children[1];
    expect(tableHeaderFirstElement.children[0].data).toEqual('Bahmni Data Point');
    expect(tableHeaderSecondElement.children[0].data).toEqual('DHIS2 Data Element ID');
  });

  it('should have column name as table data', () => {
    const firstRow = rendered.find('tr')[1];
    const secondRow = rendered.find('tr')[2];
    const firstRowFirstElement = firstRow.children[0];
    const secondRowFirstElement = secondRow.children[0];

    expect(firstRowFirstElement.children[0].data).toEqual('pat_id');
    expect(secondRowFirstElement.children[0].data).toEqual('pat_name');
  });

  it('should have section tag and column-mapping-section className', () => {
    expect(rendered.find('section')).toHaveLength(1);
    expect(rendered.find('.column-mapping-section')).toHaveLength(1);
  });
});
