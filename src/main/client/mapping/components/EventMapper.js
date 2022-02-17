import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ColumnMappings from './ColumnMappings';
import DisplayTableNames from './DisplayTableNames';
import { filterTables } from '../../utils/MappingUtil';
import { selectedEventTable } from '../actions/MappingActions';
import ColumnMappingsAutocomplete from './ColumnMappingsAutocomplete';
import DisplayProgramEventTableNames from './DisplayProgramEventTableNames';
import _ from 'underscore';

class EventMapper extends Component {
  constructor() {
    super();
    this.updateFilteredTables = this.updateFilteredTables.bind(this);
    this._onAdd = this._onAdd.bind(this);
    this.state = {
      filteredTables: {},
    };
  }

  updateFilteredTables(e, indx) {
    // let enteredText = this.refs.tablesSearch.value;
    const enteredText = e.target.value;
    const filteredTableNames = filterTables(enteredText, this.props.tables);
    this.setState((prevState) => {
      return {
        filteredTables: {
          ...prevState.filteredTables,
          [indx]: filteredTableNames,
        },
      };
    });
    this.props.selectedTable[indx] = e.target.value;
    this.props.dispatch(selectedEventTable(this.props.selectedTable));
  }

  _onAdd() {
    let tables = this.props.selectedTable;
    if (!tables) {
      tables = [];
    }
    tables.push("");
    this.props.dispatch(selectedEventTable(tables));
    this.forceUpdate();
  }

  render() {
    if (this.props && this.props.selectedTable) {
      this.props.selectedTable.map((e, indx) => {
        if (this.refs[`tablesSearch${e}`]) {
          this.refs[`tablesSearch${e}`].value = e;
        }
      });
    }

    return (
      <div className="mapper">
        {this.props &&
          this.props.selectedTable &&
          this.props.selectedTable.map((e, indx) => {
            console.log(e);
            return (
              <div style={{ marginTop: "2em" }}>
                <span>
                  {
                    _.get(this, ['props','mappingJsnData','isPatientMapping'], false) ? 'Please select patients table' : 'Please select program events table'
                  }
                  </span>
                <input
                  autocomplete="off"
                  type="text"
                  ref={`tablesSearch${e}`}
                  name="tableName"
                  placeholder="Enter at least 3 characters of the table name to search"
                  onKeyUp={(e) => {
                    this.updateFilteredTables(e, indx);
                  }}
                  className="table-input"
                />
                {/* {JSON.stringify(this.props.mappingJsnData)}
                {
                  _.get(this, ['props','mappingJsnData','isPatientMapping'], false) ? 'true' : 'false'
                } */}
                <DisplayProgramEventTableNames
                  index={indx}
                  filteredTables={this.state.filteredTables[indx]}
                  dispatch={this.props.dispatch}
                  category="events"
                  filteredTablesAction={() => {
                    this.setState({ filteredTables: {} });
                  }}
                  selectedTable={this.props.selectedTable}
                />
                <ColumnMappingsAutocomplete
                  name={e}
                  index={indx}
                  dispatch={this.props.dispatch}
                  columns={this.props.columns[e]}
                  mappingJson={this.props.mappingJson[e]}
                  category={
                    _.get(this, ['props','mappingJsnData','isPatientMapping'], false)
                      ? "instance"
                      : "events"
                  }
                  dhisMappingHeader="DHIS2 Data Element"
                  mappingConfig={{}}
                />
              </div>
            );
          })}
        <button type="button" onClick={this._onAdd} style={{ marginLeft: 0 }}>
          Add
        </button>
      </div>
    );
  }
}

EventMapper.propTypes = {
  selectedTable: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  tables: PropTypes.array.isRequired,
  columns: PropTypes.object.isRequired,
  mappingJson: PropTypes.array.isRequired,
  mapingJsnData: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  selectedTable: state.selectedEventTable,
  tables: state.allTables,
  columns: state.selectedEventTableColumns,
  mappingJson: state.mappingJson,
  mappingJsnData: state.mappingJsnData,
  state,
});

export default connect(mapStateToProps)(EventMapper);
