import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { analyticsDisplayHeaderNames, API, displayHeaderNames, syncDisplayHeaderNames } from '../../common/constants';
import {
  getLogs, getUtcFromLocal, getLocalFromUtc, filterValues, logs
} from '../actions/LogActions';

class LogTable extends Component {
  constructor(props) {
    super(props);
    this.renderTableHeader = this.renderTableHeader.bind(this);
    this.renderTableData = this.renderTableData.bind(this);
    this.renderValues = this.renderValues.bind(this);
    this.state = {
      analytics: false,
    };
  }

  componentDidMount() {
    const locList = window.location.href.split("/");
    const analytics = locList.slice(-1)[0] === 'analyticslogs'
    this.setState({
      analytics,
    });
    const date = moment(new Date()).format('YYYY-MM-DD');
    const time = moment('12:00 AM', 'hh:mm A', true).format('HH:mm:ss');
    const dateTime = `${date} ${time}`;
    const api = analytics ? API.ANALYTICS_LOGS : API.SYNC_LOGS;
    this.props.dispatch(filterValues(dateTime));
    this.props.dispatch(getLogs(getUtcFromLocal(dateTime), '', '', api));
  }

  componentWillUnmount() {
    this.props.dispatch(logs([]));
  }

  renderTableHeader() {
    const { logs } = this.props;
    const keys = logs.length > 0 ? Object.keys(logs[0]) : [];
    const keysWithoutLogId = keys.filter(key => {
      // return key !== 'log_id' && !(this.state.analytics && key === 'status');
      return key !== 'log_id';
    });
    const headers = this.state.analytics ? analyticsDisplayHeaderNames : syncDisplayHeaderNames;
    return keysWithoutLogId.map(header => (
      <th key={headers[header]} className="log-header">
        {headers[header]}
      </th>
    ));
  }

  renderTableData() {
    // const logs = this.props.logs.map(log => {
    //   const newLog = { ...log};
    //   if(this.state.analytics){
    //     delete newLog.status;
    //   }
    //   return newLog;
    // })
    return this.props.logs.map(obj => (
      <tr className="log-row">
        {this.renderValues(obj)}
      </tr>
    ));
  }

  renderValues(rowObj) {
    const newRowObj = Object.assign({}, rowObj);
    delete newRowObj['log_id'];
    return Object.keys(newRowObj).map(key => (
      <td key={key} className="log-table-data-values">
        { key === 'date_created'
          ? getLocalFromUtc(newRowObj[key])
          : key === 'status' ? (
            <span className={newRowObj[key]}>
              {newRowObj[key]}
            </span>
          ) : key === 'start_date' ? (newRowObj[key] != null ? getLocalFromUtc(newRowObj[key]) : '')
            : key === 'end_date' ? (newRowObj[key] != null ? getLocalFromUtc(newRowObj[key]) : '')
              : newRowObj[key]
                }
      </td>
    ));
  }

  render() {
    return (
      <div className="log-table-page">
        <section className="log-table-section">
          <table className="log-table">
            <tbody>
              <tr className="log-row-header">
                {this.renderTableHeader()}
              </tr>
              {this.renderTableData()}
            </tbody>
          </table>
        </section>
      </div>
    );
  }
}

LogTable.propTypes = {
  dispatch: PropTypes.func.isRequired,
  logs: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
  logs: state.logs
});

export default connect(mapStateToProps)(LogTable);
