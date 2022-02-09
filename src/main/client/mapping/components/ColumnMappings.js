import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { headingMessage } from '../../common/constants';
import { connect } from 'react-redux';

class ColumnMappings extends Component {
  constructor() {
    super();
    this.renderColumns = this.renderColumns.bind(this);
    this.insertValues = this.insertValues.bind(this);
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

  insertValues() {
    const { mappingJson } = this.props;
    console.log('vauess', mappingJson);
    const { searchable } = this.props.mappingConfig;
    const { comparable } = this.props.mappingConfig;
    if (!this.props.columns || this.props.columns.length == 0) {
      return;
    }
    this.props.columns.forEach((column) => {
      try {
        const mapping = mappingJson[column];
        this.refs[column].value = mapping || '';
      } catch (e) {
        console.log(e);
      }
    });

    searchable
      && searchable.forEach((column) => {
        const ref = this.refs[`${column}.searchable`];
        ref && (ref.checked = true);
      });

    comparable
      && comparable.forEach((column) => {
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
              // className="mapping-input"
            className={`${this.props.name} ${column}`}
            ref={column}
          />
        </td>

        {this.props.category === 'instance' && (
        <td className="mapping-data-element">
          <input ref={`${column}.searchable`} type="checkbox" />
        </td>
        )}
        {this.props.category === 'instance' && (
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
                {this.props.category === "instance" && (
                  <th className="mapping-header">Searchable</th>
                )}
                {this.props.category === "instance" && (
                  <th className="mapping-header">Comparable</th>
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

ColumnMappings.propTypes = {
  columns: PropTypes.array.isRequired,
  mappingJson: PropTypes.object.isRequired,
  category: PropTypes.string.isRequired,
  dhisMappingHeader: PropTypes.string.isRequired,
  mappingConfig: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  initialSelectedEventTable: PropTypes.array.isRequired,
  selectedTables: PropTypes.array.isRequired,
  programEventsTableName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  initialSelectedEventTable: state.initialSelectedEventTable,
  selectedTables: state.selectedTable,
  state,
});

export default ColumnMappings;