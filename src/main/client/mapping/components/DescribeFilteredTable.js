import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  currentMapping,
  dhisStageId,
  dhisStageIdAction,
  getMapping,
  getTables,
  mappingConfig,
  mappingJson,
  saveMappings,
  selectedEnrollmentsTable,
  selectedEventTable,
  selectedInstanceTable
} from '../actions/MappingActions';
import Message from '../../common/Message';
import Spinner from '../../common/Spinner';
import { showHome } from '../../common/Actions';
import InstanceMapper from './InstanceMapper';
import EnrollmentMapper from './EnrollmentMapper';
import EventMapper from './EventMapper';

class DescribeFilteredTable extends Component {
  constructor() {
    super();
    this._onCancel = this._onCancel.bind(this);
    this._onSave = this._onSave.bind(this);
    this._setOpenLatestCompletedEnrollment = this._setOpenLatestCompletedEnrollment.bind(this);
    this.state = {
      openLatestCompletedEnrollment: '',
    };
  }

  componentDidMount() {
    this.props.dispatch(showHome(false));
    const { mappingName } = this.props.match.params;
    if (mappingName) {
      this.props.dispatch(getMapping(mappingName, this.props.history));
      this.refs.mappingName.value = mappingName;
      this.refs.dhisStageId.value = this.props.dhisStageId;
    }
    this.props.dispatch(getTables());
  }

  componentWillReceiveProps(nextProps) {
    console.log('nxtprops', nextProps);
    if (nextProps.dhisStageId) {
      this.refs.dhisStageId.value = nextProps.dhisStageId;
    }
  }

  componentWillUnmount() {
    this.props.dispatch(showHome());
  }

  _setOpenLatestCompletedEnrollment(value) {
    this.setState({
      openLatestCompletedEnrollment: value,
    });
  }

  _onCancel() {
    this.props.dispatch(selectedInstanceTable());
    this.props.dispatch(selectedEnrollmentsTable());
    this.props.dispatch(selectedEventTable());
    this.props.dispatch(currentMapping());
    this.props.dispatch(mappingJson());
    this.props.dispatch(mappingConfig());
    this.props.dispatch(dhisStageIdAction());
    this.props.history.push('/dhis-integration/mapping');
  }

  _onSave() {
    const mappingName = this.refs.mappingName.value;
    const mappings = {};
    mappings.instance = document.getElementsByClassName('instance');
    const formTableMappings = {};
    for (let j = 0; j < this.props.selectedEventTable.length; j++) {
      const formName = this.props.selectedEventTable[j];
      const elementsObj = {};
      if (formName.length > 0) {
        this.props.columns[formName].map((e) => {
          const elmnt = document.getElementsByClassName(`${formName} ${e}`)[0];
          elementsObj[e] = elmnt.value;
        });
      }

      formTableMappings[formName] = elementsObj;
    }
    const dhisStageId = document.getElementsByClassName('dhis-stage-id')[0].value;
    const payload = {
      formTableMappings,
      dhisStageId,
    };
    const lookupTable = {
      instance: this.props.selectedInstanceTable,
      enrollments: this.props.selectedEnrollmentsTable,
      event: this.props.selectedEventTable,
    };
    this.props.dispatch(
      saveMappings(
        mappingName,
        payload,
        lookupTable,
        this.props.history,
        this.props.currentMapping,
        this.state.openLatestCompletedEnrollment
      )
    );
  }

  render() {
    return (
      <div className="mapping-div">
        <Message />
        <Spinner hide={this.props.hideSpinner} />
        <div>Mapping Name</div>
        <input
          type="text"
          ref="mappingName"
          className="mapping-name mapping-name-input"
          placeholder="Enter Mapping Name"
        />
        <br />
        <EnrollmentMapper
          setOpenLatestCompletedEnrollment={
            this._setOpenLatestCompletedEnrollment
          }
        />
        <br />
        <div>DHIS Program Stage ID</div>
        <input
          type="text"
          ref="dhisStageId"
          className="dhis-stage-id dhis-stage-id-input mapping-name-input"
          placeholder="Enter DHIS Program Stage ID"
        />

        <EventMapper />

        <div className="footer">
          {this.props.selectedEventTable && (
            <button type="button" className="save" onClick={this._onSave}>
              Save
            </button>
          )}
          <button type="button" className="cancel" onClick={this._onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

DescribeFilteredTable.propTypes = {
  selectedInstanceTable: PropTypes.string.isRequired,
  selectedEnrollmentsTable: PropTypes.string.isRequired,
  selectedEventTable: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  hideSpinner: PropTypes.bool.isRequired,
  currentMapping: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  selectedInstanceTable: state.selectedInstanceTable,
  selectedEnrollmentsTable: state.selectedEnrollmentsTable,
  selectedEventTable: state.selectedEventTable,
  hideSpinner: state.hideSpinner,
  currentMapping: state.currentMapping,
  columns: state.selectedEventTableColumns,
  dhisStageId: state.dhisStageId,
});


export default connect(mapStateToProps)(DescribeFilteredTable);
