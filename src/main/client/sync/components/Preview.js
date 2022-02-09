import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDeltaData, getDeltaDataWithStartEndDates } from '../../utils/PreviewUtil';
import { showHeader } from '../../common/Actions';
import { getLocalFromUtc } from '../../log/actions/LogActions';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deltaData: {},
      serviceName: this.props.match.params.service,
      startDate: this.props.match.params.startDate,
      endDate: this.props.match.params.endDate,
      originalService: this.props.match.params.originalService
    };
    this.getHeader = this.getHeader.bind(this);
    this.getRows = this.getRows.bind(this);
  }

  async componentDidMount() {
    this.props.dispatch(showHeader(false));
    const deltaData = (this.state.startDate == undefined && this.state.endDate == undefined)
      ? await getDeltaData(this.state.serviceName)
      : await getDeltaDataWithStartEndDates(this.state.originalService, this.state.startDate, this.state.endDate);
    this.setState({
      deltaData
    });
  }

  componentWillUnmount() {
    this.props.dispatch(showHeader());
  }

  getHeader() {
    return (
      <tr>
        {
              Object.keys(this.state.deltaData.result[0]).map((field) => {
                return (
                  <th key={field} className="table-header bordered-cell preview-element">
                    {field}
                  </th>
                );
              })}
      </tr>
    );
  }

  getRows() {
    return this.state.deltaData.result.map((record) => {
      return (
        <tr className="table-row" key={record}>
          {
                  Object.keys(record).map((field) => {
                    return (
                      <td key={field} className="preview-element side-bordered-cell">
                        {this.booleanToString(record[field])}
                      </td>
                    );
                  })
              }
        </tr>
      );
    });
  }

  booleanToString(value) {
    return (typeof value === 'boolean') ? JSON.stringify(value) : value;
  }

  formatDeltaData() {
    return (
      <table className="center preview-table">
        {this.getHeader()}
        {this.getRows()}
      </table>
    );
  }

  render() {
    if (this.state.deltaData.error) {
      return (
        <span className="message">
          {this.state.deltaData.error}
        </span>
      );
    } else if (!this.state.deltaData.result) {
      return null;
    } else if (this.state.deltaData.result.length === 0) {
      return (
        <div>
          <span className="message">
            No Delta Data to Sync
          </span>
          <span className="time-stamp">
            Generated on
            {' '}
            {getLocalFromUtc(this.state.deltaData.generatedDate)}
          </span>
        </div>
      );
    }
    return (
      <div className="container">
        <span className="service-name">
          {this.state.serviceName}
        </span>
        <span className="time-stamp">
          Generated on
          {' '}
          {getLocalFromUtc(this.state.deltaData.generatedDate)}
        </span>
        {this.formatDeltaData()}
      </div>
    );
  }
}

Preview.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Preview);
