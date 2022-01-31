import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import ColumnMappings from "./ColumnMappings";
import DisplayTableNames from "./DisplayTableNames";
import {filterTables} from "../../utils/MappingUtil";
import {selectedEventTable} from "../actions/MappingActions";

class EventMapper extends Component {

    constructor(){
        super();
        this.updateFilteredTables = this.updateFilteredTables.bind(this);
        this.state = {
            filteredTables : []
        };
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.selectedTable){
            this.refs.tablesSearch.value = nextProps.selectedTable !== this.props.selectedTable ?
                nextProps.selectedTable
                :this.props.selectedTable;
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

        this.props.dispatch(selectedEventTable());
    }

    render(){
        return (
          <div className="mapper">
            <span>
          Please select program events table
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
              category="events"
              filteredTablesAction={()=>{this.setState({filteredTables:[]})}}
            />

            {(this.props.selectedTable) && (
            <ColumnMappings
              columns={this.props.columns}
              mappingJson={this.props.mappingJson.event}
              category="events"
              dhisMappingHeader="DHIS2 Data Element ID"
              mappingConfig={{}}
            />
                )}
          </div>
        )
    }
}

EventMapper.propTypes = {
    selectedTable: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    tables: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    mappingJson: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    selectedTable: state.selectedEventTable,
    tables: state.allTables,
    columns: state.selectedEventTableColumns,
    mappingJson: state.mappingJson
});

export default connect(mapStateToProps)(EventMapper);
