import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { getLogsOnFilter, filterValues, getUtcFromLocal } from '../actions/LogActions';
import { showMessage } from '../../common/Actions';
import Message from '../../common/Message';
import _ from 'underscore';
import { API } from '../../common/constants';

class LogFilters extends React.Component {
  constructor() {
    super();
    this.onDateChange = this.onDateChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
    this.onFilterClick = this.onFilterClick.bind(this);
    this.validateDate = this.validateDate.bind(this);
    this.validateTime = this.validateTime.bind(this);
    this.state = {
      date: new Date(),
      time: new Date(),
      disableButton: false,
      enteredDate: new Date(),
      enteredTime: new Date(),
      analytics: false,
    };
  }

  onDateChange(date) {
    this.setState({
      date,
      enteredDate: date
    });

    if (isNaN(this.state.enteredTime.getTime())) {
      this.setState({
        disableButton: false
      });
    }
  }

  onTimeChange(time) {
    this.setState({
      time,
      enteredTime: time
    });

    if (isNaN(this.state.enteredDate.getTime())) {
      this.setState({
        disableButton: false
      });
    }
  }

  onFilterClick() {
    const service = this.refs.service.value;
    let status = '';
    let user = '';
    if(this.state.analytics){
      status = this.refs.status.value;
    } else {
      user = this.refs.user.value;
    }
    const formattedTime = `${this.state.time.getUTCHours()}:${this.state.time.getUTCMinutes()}:${this.state.time.getUTCSeconds()}`;
    const formattedDate = `${this.state.date.getFullYear()}-${this.state.date.getUTCMonth() + 1}-${this.state.date.getUTCDate()}`;
    const dateCreated = `${formattedDate} ${formattedTime}`;
    const api = this.state.analytics ? API.ANALYTICS_LOGS : API.SYNC_LOGS;
    this.props.dispatch(filterValues(dateCreated, service, user, status));
    this.props.dispatch(getLogsOnFilter(dateCreated, service, user, api, status));
  }

  validateDate(dateObj) {
    const date = dateObj;
    this.setState({
      enteredDate: date
    });

    if (isValid(date)) {
      this.onDateChange(date);
    } else {
      this.props.dispatch(showMessage('Please Enter Valid date and format should be MM/DD/YYYY', 'error'));
      this.setState({
        disableButton: true
      });
    }
  }

  validateTime(timeObj) {
    const time = timeObj;
    this.setState({
      enteredTime: time
    });

    if (isValid(time)) {
      this.onTimeChange(time);
    } else {
      this.props.dispatch(showMessage('Please Enter Valid time and format should be either of h:mm A/P, '
                + 'h:mm AM/PM, hh:mm A/P, hh:mm AM/PM', 'error'));
      this.setState({
        disableButton: true
      });
    }
  }
  componentDidMount() {
    const locList = window.location.href.split("/");
    this.setState({
      analytics: locList.slice(-1)[0] === 'analyticslogs',
    });
  }
  render() {
    return (
      <div className="filters">
        <Message />
        <div className="filter-text">
          Filters
        </div>
        <span className="filter-on">
          Start From
        </span>
        <DatePicker
          selected={this.state.date}
          onChange={this.onDateChange}
          dropdownMode="select"
          className="date-picker"
          onBlur={this.validateDate}
          dateFormat="yyyy-MM-dd"
        />
        <DatePicker
          selected={this.state.time}
          onChange={this.onTimeChange}
          dropdownMode="select"
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="h:mm aa"
          className="time-picker"
          onBlur={this.validateTime}
        />
        <span className="filter-on">
          Service
        </span>
        <input className="filter-input" ref="service" />
        { !this.state.analytics && (
            <React.Fragment>
              <span className="filter-on">
                Username
              </span>
              <input className="filter-input" ref="user" />
            </React.Fragment>
          )
        }
        { this.state.analytics && (
            <React.Fragment>
              <span className="filter-on">
                Status
              </span>
              <select name="status" id="status" className="filter-input" ref="status">
                <option selected value=""></option>
                <option value="ERROR">Error</option>
                <option value="INFO">Info</option>
              </select>
            </React.Fragment>
          )
        }
        <button type="submit" className="filter-button" onClick={this.onFilterClick} disabled={this.state.disableButton}>
          <i className="fa fa-filter" />
          Filter
        </button>
      </div>
    );
  }
}

LogFilters.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(LogFilters);
