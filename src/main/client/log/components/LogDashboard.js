import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LogFilters from './LogFilters';
import LogTable from './LogTable';
import LogNavigation from './LogNavigation';
import Spinner from '../../common/Spinner';

class LogDashboard extends Component {
  render() {
    return (
      <div className="log-page">
        <Spinner hide={this.props.hideSpinner} />
        <LogFilters />
        <LogTable />
        <LogNavigation />
        {this.props.noEvents && (
        <div className="no-events">
          No more events to be displayed !!
        </div>
        )}
        {this.props.noFilterEvents && (
        <div className="no-events">
          No matching events found for given criteria !!
        </div>
        )}
      </div>
    );
  }
}

LogDashboard.propTypes = {
  noEvents: PropTypes.bool.isRequired,
  hideSpinner: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  noEvents: state.noEventsToDisplay,
  noFilterEvents: state.noFilterEventsToDisplay,
  hideSpinner: state.hideSpinner
});

export default connect(mapStateToProps)(LogDashboard);
