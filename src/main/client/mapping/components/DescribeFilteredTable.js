import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
  selectedInstanceTable,
} from "../actions/MappingActions";
import Message from "../../common/Message";
import Spinner from "../../common/Spinner";
import { showHome } from "../../common/Actions";
import InstanceMapper from "./InstanceMapper";
import EnrollmentMapper from "./EnrollmentMapper";
import EventMapper from "./EventMapper";
import DisplayOptions from "./DisplayOptions";
import _ from "underscore";
import Ajax from "../../common/Ajax";
import { filterOptions } from "../../utils/MappingUtil";

class DescribeFilteredTable extends Component {
  constructor() {
    super();
    this._onCancel = this._onCancel.bind(this);
    this._onSave = this._onSave.bind(this);
    this._setOpenLatestCompletedEnrollment =
      this._setOpenLatestCompletedEnrollment.bind(this);
    this.getStageIds = this.getStageIds.bind(this);
    this.onOptionSelect = this.onOptionSelect.bind(this);
    this.updateOptions = this.updateOptions.bind(this);

    this.state = {
      openLatestCompletedEnrollment: "",
      dhisStageIdOptions: [],
      dhisStageIdOptionsFiltered: [],
      dhisStageId: null,
    };
  }

  componentDidMount() {
    this.props.dispatch(showHome(false));
    const { mappingName } = this.props.match.params;
    if (mappingName) {
      this.props.dispatch(getMapping(mappingName, this.props.history));
      this.refs.mappingName.value = mappingName;
      if(_.get(this, "props.allMappingJson.isPatientMapping", false)) {
        this.refs.dhisStageId.value = this.props.dhisStageId;
      }
    }
    this.props.dispatch(getTables());
    this.getStageIds();
  }

  async getStageIds() {
    const ajax = Ajax.instance();
    try {
      const url = "/dhis-integration/api/getProgramStages";
      const response = await ajax.get(url);
      this.setState((prevState) => {
        return {
          ...prevState,
          dhisStageIdOptions: response,
        };
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("nxtprops", nextProps);
    if (
      nextProps.dhisStageId &&
      _.get(this, "props.allMappingJson.isPatientMapping", false)
    ) {
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
    this.props.history.push("/dhis-integration/mapping");
  }

  _onSave() {
    const mappingName = this.refs.mappingName.value;
    const mappings = {};
    mappings.instance = document.getElementsByClassName("instance");
    const formTableMappings = this.props.allMappingJson;
    const dhisProgramStageId =_.get(this, 'state.dhisStageId.id', _.get(this, 'refs.dhisStageId.value'));
    const payload = {
      formTableMappings,
      dhisProgramStageId,
      config: mappingConfig,
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

  onOptionSelect(val) {
    console.log("dhisstageid", val);
    this.refs.dhisStageId.value = `${val.displayName} (${val.id})`;
    this.setState((prevState) => {
      return {
        ...prevState,
        dhisStageIdOptionsFiltered: [],
        dhisStageId: val,
      };
    });
    this.forceUpdate();
  }
  updateOptions(e1) {
    let newOptions = [];
    const enteredText = e1.target.value;
    if (enteredText !== "") {
      newOptions = filterOptions(enteredText, this.state.dhisStageIdOptions);
      this.setState(
        (prevState) => {
          return {
            ...prevState,
            dhisStageIdOptionsFiltered: newOptions,
          };
        },
        () => {
          this.forceUpdate();
        }
      );
    } else {
      this.onOptionSelect(null);
    }
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
        {!_.get(this, "props.mappingJsnData.isPatientMapping", false) && (
          <React.Fragment>
            <EnrollmentMapper
              setOpenLatestCompletedEnrollment={
                this._setOpenLatestCompletedEnrollment
              }
            />
            <br />
            <div>DHIS Program Stage ID</div>
            <input
              type="text"
              name="dhisStageId"
              placeholder="Enter DHIS Program Stage ID"
              onKeyUp={this.updateOptions}
              className="dhis-stage-id dhis-stage-id-input mapping-name-input"
              ref="dhisStageId"
              autocomplete="off"
            />
            <DisplayOptions
              options={_.get(this.state, "dhisStageIdOptionsFiltered", [])}
              dispatch={this.props.dispatch}
              category="events"
              filteredTablesAction={(val) => {
                this.onOptionSelect(val);
              }}
              selectedTable="dfhf"
              maxWidth="350px"
            />
          </React.Fragment>
        )}

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
  columns: PropTypes.array.isRequired,
  mappingJsnData: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  selectedInstanceTable: state.selectedInstanceTable,
  selectedEnrollmentsTable: state.selectedEnrollmentsTable,
  selectedEventTable: state.selectedEventTable,
  hideSpinner: state.hideSpinner,
  currentMapping: state.currentMapping,
  columns: state.selectedEventTableColumns,
  dhisStageId: state.dhisStageId,
  allMappingJson: state.mappingJson,
  mappingJsnData: state.mappingJsnData,
});

export default connect(mapStateToProps)(DescribeFilteredTable);
