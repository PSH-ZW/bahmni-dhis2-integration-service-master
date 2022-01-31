import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ColumnMappings from "./ColumnMappings";
import DisplayTableNames from "./DisplayTableNames";
import {filterTables} from "../../utils/MappingUtil";
import {mappingConfig, selectedInstanceTable} from "../actions/MappingActions";

class InstanceMapper extends Component {

    constructor() {
        super();
        this.updateFilteredTables = this.updateFilteredTables.bind(this);
        this.state = {
            filteredTables: []
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.selectedTable){
            this.refs.tablesSearch.value = nextProps.selectedTable !== this.props.selectedTable ?
                nextProps.selectedTable
                : this.props.selectedTable;
        }
    }

    updateFilteredTables() {
        let enteredText = this.refs.tablesSearch.value;

        this.setState({
            filteredTables: filterTables(
                enteredText,
                this.props.tables
            )
        });

        this.props.dispatch(selectedInstanceTable());
        this.props.dispatch(mappingConfig());
    }

    render() {
        return (
          <div className="mapper">
            <span className="instance-table-span">
          Please select patient instance table
            </span>
            <input
              type="text"
              ref="tablesSearch"
              name="tableName"
              placeholder="Enter at least 3 characters of the table name to search"
              onKeyUp={this.updateFilteredTables}
              className="table-input"
            />

            <DisplayTableNames
              filteredTables={this.state.filteredTables}
              dispatch={this.props.dispatch}
              category="instance"
              filteredTablesAction={() => {
                        this.setState({filteredTables: []})
                    }}
            />

            {(this.props.selectedTable) && (
            <ColumnMappings
              columns={this.props.columns}
              mappingJson={this.props.mappingJson.instance}
              category="instance"
              dhisMappingHeader="DHIS2 Person Attribute ID"
              mappingConfig={this.props.mappingConfig}
            />
                )}
          </div>
        )
    }
}

InstanceMapper.propTypes = {
    selectedTable: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    tables: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    mappingJson: PropTypes.object.isRequired,
    mappingConfig: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    selectedTable: state.selectedInstanceTable,
    tables: state.allTables,
    columns: state.selectedInstanceTableColumns,
    mappingJson: state.mappingJson,
    mappingConfig: state.mappingConfig
});

export default connect(mapStateToProps)(InstanceMapper);
