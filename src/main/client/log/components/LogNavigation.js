import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getNextPageLogs, getPrevPageLogs, getUtcFromLocal } from '../actions/LogActions';
import { API } from '../../common/constants';

class LogNavigation extends Component {
  constructor(props) {
    super(props);
    this.onPrevPage = this.onPrevPage.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.state = {
      analytics: false,
     };
  }
  componentDidMount() {
    const locList = window.location.href.split("/");
    this.setState({
      analytics: locList.slice(-1)[0] === 'analyticslogs',
    });
  }
  onPrevPage() {
    const { filters } = this.props;
    const api = this.state.analytics ? API.ANALYTICS_LOGS : API.SYNC_LOGS;
    this.props.dispatch(getPrevPageLogs(filters.date, filters.service, filters.user, api));
  }

  onNextPage() {
    const { filters } = this.props;
    const api = this.state.analytics ? API.ANALYTICS_LOGS : API.SYNC_LOGS;
    this.props.dispatch(getNextPageLogs(filters.date, filters.service, filters.user, api));
  }

  render() {
    return (
      <div className="log-navigation">
        <p className="log-table-buttons">
          <button
            type="submit"
            className="prev-page"
            onClick={this.onPrevPage}
          >
            <i className="fa fa-chevron-left" />
          </button>
          <button
            type="submit"
            className="next-page"
            onClick={this.onNextPage}
          >
            <i className="fa fa-chevron-right" />
          </button>
        </p>
      </div>
    );
  }
}

LogNavigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  filters: state.filters
});

export default connect(mapStateToProps)(LogNavigation);
