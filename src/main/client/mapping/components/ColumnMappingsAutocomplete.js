import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { headingMessage } from '../../common/constants';
import { connect } from 'react-redux';
import Ajax from '../../common/Ajax';
import DisplayOptions from './DisplayOptions';
import { hideSpinner } from '../../common/Actions';
import { filterOptions, filterTables } from '../../utils/MappingUtil';
import { mappingJson } from '../actions/MappingActions';

class ColumnMappingsAutocomplete extends Component {
  constructor() {
    super();
    this.renderColumns = this.renderColumns.bind(this);
    this.insertValues = this.insertValues.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
    this.onOptionSelect = this.onOptionSelect.bind(this);
    this.debounceSearch = this.debounceSearch.bind(this);
    this.state = {
      options: {},
    };
  }

  componentDidMount() {
    this.insertValues();
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.columns, nextProps.columns);
  }

  componentDidUpdate() {
    this.insertValues();
  }

  async updateOptions(enteredText, indx, column) {
    const ajax = Ajax.instance();
    // this.props.dispatch(hideSpinner(false));
    try {
      let newOptions = [];
      if(enteredText !== ''){
        let endpoint = 'searchDataElements';
        if(this.props.category === "instance"){
          endpoint = 'searchTrackedEntityAttributes';
        }
        const response = await ajax.get(
          `/dhis-integration/api/${endpoint}?searchString=${enteredText}`
        );
        newOptions = filterOptions(enteredText, response);
      } else {
        this.onOptionSelect(null, column, indx);
      }

      this.setState(
        (prevState) => {
          return {
            options: { ...prevState.options, [column]: newOptions },
          };
        },
        () => {
          const x = _.get(this.state, ["options", column], []);
          this.forceUpdate();
        }
      );
      // this.props.dispatch(hideSpinner(true));
    } catch (e) {
      this.setState((prevState) => {
        return {
          options: {},
        };
      });
      // this.props.dispatch(hideSpinner(true));
    }
  }

  insertValues() {
    const { mappingJson } = this.props;
    console.log("vauess", mappingJson);
    const { searchable, comparable } = this.props.mappingConfig;
    if (!this.props.columns || this.props.columns.length == 0) {
      return;
    }
    this.props.columns.forEach((column) => {
      try {
        const mapping = mappingJson[column];
        this.refs[column].value = mapping["displayName"] || "";
      } catch (e) {
        console.log(e);
      }
    });

    searchable &&
      searchable.forEach((column) => {
        const ref = this.refs[`${column}.searchable`];
        ref && (ref.checked = true);
      });

    comparable &&
      comparable.forEach((column) => {
        const ref = this.refs[`${column}.comparable`];
        ref && (ref.checked = true);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedTable) {
      nextProps.selectedTable.map((sl, indx) => {
        const elmnt = document.getElementsByClassName(`table-input${indx}`)[0];
        elmnt.value = sl;
      });
    }
  }

  onOptionSelect(val, column, index) {
    const element = document.getElementsByClassName(
      `${this.props.name} ${column}`
    )[0];
    element.value = val;
    this.setState({ options: [] });
    let newMappingJson = this.props.allMappingJson;
    try {
      newMappingJson[this.props.name][column] = val;
    } catch (e) {
      newMappingJson = {
        ...newMappingJson,
        [this.props.name]: { [column]: val },
      };
    }
    this.props.dispatch(mappingJson(newMappingJson));
    this.forceUpdate();
  }

  debounceSearch(e1, index, column) {
    let timer;
    clearTimeout(timer);
    const val = e1.target.value;
    timer = setTimeout(() => {
      this.updateOptions(val, index, column);
    }, 100);
  }

  renderColumns() {
    return this.props.columns.map((column, index) => (
      <tr
        key={column}
        className={`mapping-row table-row ${this.props.category}`}
      >
        <td className="mapping-column-name">{column}</td>
        <td className="mapping-data-element">
          <input
            type="text"
            name="tableName"
            placeholder=""
            onKeyUp={(e1) => {
              this.debounceSearch(e1, index, column);
            }}
            className={`${this.props.name} ${column}`}
            ref={column}
            style={{ minWidth: "500px" }}
            autocomplete="off"
          />
          <DisplayOptions
            options={_.get(this.state, ["options", column], [])}
            dispatch={this.props.dispatch}
            category="events"
            filteredTablesAction={(val) => {
              this.onOptionSelect(val, column, index);
            }}
            selectedTable="dfhf"
          />
        </td>
        <td className="mapping-data-element" style={{textAlign:'center'}}>
          {_.get(this, ["props", "mappingJson", column, "id"])}
        </td>

        {this.props.category === "instance" && (
          <td className="mapping-data-element">
            <input ref={`${column}.searchable`} type="checkbox" />
          </td>
        )}
        {this.props.category === "instance" && (
          <td className="mapping-data-element">
            <input ref={`${column}.comparable`} type="checkbox" />
          </td>
        )}
      </tr>
    ));
  }

  render() {
    return (
      <div className="mapping-table-div">
        {/*eslint-disable*/}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <span className="enrollment-table-span">
            Please provide DHIS2 {headingMessage[this.props.category]}
          </span>
        </div>

        {/* eslint-enable */}
        <section className="column-mapping-section">
          <table className="mapping-table">
            <tbody>
              <tr className="mapping-row-header">
                <th className="mapping-header">Bahmni Data Point</th>
                <th className="mapping-header">
                  {this.props.dhisMappingHeader}
                </th>
                <th className="mapping-header"  style={{ width: '150px'}}>ID</th>
                {this.props.category === "instance" && (
                  <th className="mapping-header" style={{ width: '150px'}}>Searchable</th>
                )}
                {this.props.category === "instance" && (
                  <th className="mapping-header" style={{ width: '150px'}}>Comparable</th>
                )}
              </tr>
              {this.props.columns &&
                this.props.columns.length > 0 &&
                this.renderColumns()}
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

ColumnMappingsAutocomplete.propTypes = {
  columns: PropTypes.array.isRequired,
  mappingJson: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  dhisMappingHeader: PropTypes.string.isRequired,
  mappingConfig: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  initialSelectedEventTable: PropTypes.array.isRequired,
  selectedTables: PropTypes.array.isRequired,
  programEventsTableName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  initialSelectedEventTable: state.initialSelectedEventTable,
  selectedTables: state.selectedTable,
  allMappingJson: state.mappingJson,
  mappingConfig: state.mappingConfig,
  state,
});

export default connect(mapStateToProps)(ColumnMappingsAutocomplete);