import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import {connect} from 'react-redux';
import Spinner from '../common/Spinner';
import {syncData} from './actions/SyncActions';
import {syncDataWithDateRange} from './actions/SyncActions';
import {getAllMappingsSyncInfo} from "./actions/SyncActions";
import {handlePreview} from "./actions/SyncActions";
import {ensureActiveSession, showMessage} from "../common/Actions";
import Message from "../common/Message";
import DatePicker from 'react-datepicker';

class SyncDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            syncDetails: this.props.syncDetails
        }
    }

    onStartDateChange(mappingName,date) {
        this.props.syncDetails[mappingName].startDate = date;//date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        this.setState({syncDetails: this.props.syncDetails});
    }

    onEndDateChange(mappingName, date) {
        this.props.syncDetails[mappingName].endDate = date;//date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        this.setState({syncDetails: this.props.syncDetails});
    }

    async componentDidMount() {
        this.props.dispatch(getAllMappingsSyncInfo());
        await this.props.dispatch(ensureActiveSession());
    }

    async onClick(unique_ref_prefix, mappingName) {
        this.props.syncDetails[mappingName].status = 'pending';
        this.setState({syncDetails: this.props.syncDetails});

        await this.props.dispatch(
            syncData(mappingName, this.props.session.user, this.refs[unique_ref_prefix + mappingName].value));

        this.props.syncDetails[mappingName].status = '';
        this.setState({syncDetails: this.props.syncDetails});
    }

    async onClickWithDateRange(unique_ref_prefix, mappingName, startDate, endDate) {
        this.props.syncDetails[mappingName].status = 'pending';
        this.setState({syncDetails: this.props.syncDetails});
        let formattedStartDate = this.props.syncDetails[mappingName].startDate !=null ? (this.props.syncDetails[mappingName].startDate.getFullYear() +
            "-" + ("0" +(this.props.syncDetails[mappingName].startDate.getMonth() + 1)).slice(-2) +
            "-" + ("0" +this.props.syncDetails[mappingName].startDate.getDate()).slice(-2)) : null;

        let formattedEndDate = this.props.syncDetails[mappingName].endDate !=null ? (this.props.syncDetails[mappingName].endDate.getFullYear() +
            "-" + ("0" +(this.props.syncDetails[mappingName].endDate.getMonth() + 1)).slice(-2) +
            "-" + ("0" +(this.props.syncDetails[mappingName].endDate.getDate())).slice(-2)) : null;

        await this.props.dispatch(
            syncDataWithDateRange(formattedStartDate, formattedEndDate, mappingName, this.props.session.user, this.refs[unique_ref_prefix + mappingName].value))

        this.props.syncDetails[mappingName].status = '';
        this.setState({syncDetails: this.props.syncDetails});
    }

    handleCheckbox(mappingName){
        this.props.syncDetails[mappingName].checkBoxClicked = ! this.props.syncDetails[mappingName].checkBoxClicked;
        if(this.props.syncDetails[mappingName].checkBoxClicked === false)
        {
            this.props.syncDetails[mappingName].endDate = null;
            this.props.syncDetails[mappingName].startDate = null;
        }
        this.setState({syncDetails: this.props.syncDetails});
    }

    async handlePreview(mappingName) {
        await this.props.dispatch(
            handlePreview(this.props.syncDetails[mappingName].startDate,this.props.syncDetails[mappingName].endDate,mappingName)
        )
    }

    renderMappingNames() {
        let unique_ref_prefix = 'prefix_';
        return (
            this.props.mappingNames.sort().map(mappingName => (
                <tr key={mappingName} className="table-row">
                    <td className="mapping-name">
                        {mappingName}
                    </td>
                    <td>
                  <textarea
                      className="sync-comment"
                      ref={unique_ref_prefix + mappingName}
                      placeholder='Please provide comments'
                  />
                    </td>
                    <td className="checkBox">
                        <input type="checkbox" id={mappingName} onClick={this.handleCheckbox.bind(this,mappingName)}/>
                    </td>
                    <td>
                        <DatePicker className="date"
                                    dateFormat="yyyy-MM-dd"
                                    selected={this.props.syncDetails[mappingName] != null ?
                                        (this.props.syncDetails[mappingName].startDate !=null ? (this.props.syncDetails[mappingName].startDate) : this.state.date) : this.state.date}
                                    onChange={this.onStartDateChange.bind(this,mappingName)}
                                    dropdownMode="select"
                                    id = {mappingName + 'startDate'}
                                    disabled={this.props.syncDetails[mappingName] && this.props.syncDetails[mappingName].checkBoxClicked === false}
                                    maxDate={new Date()}
                        />
                    </td>
                    <td>
                        <DatePicker className="date"
                                    dateFormat="yyyy-MM-dd"
                                    selected={this.props.syncDetails[mappingName] != null ?
                                        (this.props.syncDetails[mappingName].endDate !=null ? (this.props.syncDetails[mappingName].endDate) : this.state.date) : this.state.date}
                                    onChange={this.onEndDateChange.bind(this,mappingName)}
                                    dropdownMode="select"
                                    disabled={this.props.syncDetails[mappingName] && (this.props.syncDetails[mappingName].checkBoxClicked === false || this.props.syncDetails[mappingName].startDate === null)}
                                    maxDate={new Date()}
                                    minDate={this.props.syncDetails[mappingName] && this.props.syncDetails[mappingName].startDate !=null && this.props.syncDetails[mappingName].startDate}
                        />
                    </td>
                    <td className="mapping-name">
                        {this.props.syncDetails[mappingName] && this.props.syncDetails[mappingName].date &&
                        moment(moment.utc(this.props.syncDetails[mappingName].date)).local().format("dddd MMMM DD, YYYY hh:mm:ss A")}
                    </td>
                    <td>
                        <button
                            type="submit"
                            className="preview-button"
                            disabled={this.props.syncDetails[mappingName] && this.props.syncDetails[mappingName].status === 'pending'}
                            onClick={this.handlePreview.bind(this,mappingName)}
                        >
                            Preview
                        </button>
                        <button
                            type="submit"
                            className="send-button"
                            disabled={this.props.syncDetails[mappingName] && this.props.syncDetails[mappingName].status === 'pending'}
                            onClick={(this.props.syncDetails[mappingName] &&  (this.props.syncDetails[mappingName].startDate != null || this.props.syncDetails[mappingName].endDate != null))
                                ? this.onClickWithDateRange.bind(this, unique_ref_prefix, mappingName, this.props.syncDetails[mappingName].startDate, this.props.syncDetails[mappingName].endDate)
                                : this.onClick.bind(this, unique_ref_prefix, mappingName)}
                        >
                            Sync to DHIS
                        </button>
                    </td>
                </tr>
            ))
        );
    }

    render() {
        return (
            <div>
                <Message />
                <div className="center service-names-table">
                    <Spinner hide={this.props.hideSpinner} />
                    <section className="all-mappings-sections">
                        <table className="mapping-table">
                            <tbody>
                            <tr className="section-title">
                                <td className="title-name">
                                    Name
                                </td>
                                <td className="title-comments">
                                    Comments
                                </td>
                                <td className="checkBox">
                                    Date Range Sync
                                </td>
                                <td className="dateHeader">
                                    Start Date
                                </td>
                                <td className="dateHeader">
                                    End Date
                                </td>
                                <td className="title-name">
                                    Last Successful Sync
                                </td>
                                <td />
                            </tr>
                            {this.renderMappingNames()}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        );
    }
}

SyncDashboard.propTypes = {
    hideSpinner: PropTypes.bool.isRequired,
    mappingNames: PropTypes.array.isRequired,
    syncDetails: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    session: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    mappingNames: state.mappingNames,
    syncDetails: state.syncDetails,
    hideSpinner: state.hideSpinner,
    session : state.session
});

export default connect(mapStateToProps)(SyncDashboard);
