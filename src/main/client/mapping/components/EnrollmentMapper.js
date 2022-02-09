import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DisplayTableNames from './DisplayTableNames';
import { filterTables } from '../../utils/MappingUtil';
import { selectedEnrollmentsTable } from '../actions/MappingActions';

class EnrollmentMapper extends Component {
  constructor() {
    super();
    this.updateFilteredTables = this.updateFilteredTables.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.state = {
      filteredTables: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedTable) {
      this.refs.tablesSearch.value = this.props.selectedTable !== nextProps.selectedTable
        ? nextProps.selectedTable
        : this.props.selectedTable;
    }
  }

  componentDidMount() {
    this.props.enrConfig && this.addClass(document.getElementById(this.props.enrConfig));
  }

  componentDidUpdate() {
    this.props.enrConfig && this.addClass(document.getElementById(this.props.enrConfig));
  }

  addClass(element) {
    element.classList.add('fa', 'fa-ok', 'clicked-button');
    this.props.setOpenLatestCompletedEnrollment(this.props.enrConfig);
  }

  updateFilteredTables() {
    this.setState({
      filteredTables: filterTables(
        this.refs.tablesSearch.value,
        this.props.tables
      )
    });

    this.props.dispatch(selectedEnrollmentsTable());
  }

  onButtonClick(_event) {
    if (_event.target.classList.contains('fa')) {
      _event.target.classList.remove('fa', 'fa-ok', 'clicked-button');
      this.props.setOpenLatestCompletedEnrollment('');
    } else {
      _event.target.classList.add('fa', 'fa-ok', 'clicked-button');
      this.props.setOpenLatestCompletedEnrollment(_event.target.innerHTML.toLowerCase());
    }
    _event.target.nextElementSibling ? _event.target.nextElementSibling.classList.remove('fa', 'fa-ok', 'clicked-button')
      : _event.target.previousElementSibling.classList.remove('fa', 'fa-ok', 'clicked-button');
  }

  render() {
    return (
      <div className="mapper">
        {/* <span>
          Please select program enrollment table
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
          category="enrollments"
          filteredTablesAction={() => {
            this.setState({ filteredTables: [] });
          }}
        /> */}
        <span className="enrollment-question">
          Do you want to open latest completed enrollment?
          {' '}
          <span className="asterisk">*</span>
        </span>
        <span>
          <button id="yes" onClick={this.onButtonClick} className="enrollment-answer">Yes</button>
          <button id="no" onClick={this.onButtonClick} className="enrollment-answer">No</button>
        </span>
      </div>
    );
  }
}

EnrollmentMapper.propTypes = {
  selectedTable: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  tables: PropTypes.array.isRequired,
  setOpenLatestCompletedEnrollment: PropTypes.func.isRequired,
  setOpenLatestCompletedEnrollment: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  selectedTable: state.selectedEnrollmentsTable,
  tables: state.allTables,
  enrConfig: state.mappingConfig.openLatestCompletedEnrollment,
  state,
});

export default connect(mapStateToProps)(EnrollmentMapper);
