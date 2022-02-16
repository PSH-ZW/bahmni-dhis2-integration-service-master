import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import Spinner from '../common/Spinner';
import {
  syncData, syncDataWithDateRange, getAllMappingsSyncInfo, handlePreview
} from './actions/SyncActions';
import { ensureActiveSession, hideSpinner, showMessage } from '../common/Actions';
import Message from '../common/Message';
import Ajax from '../common/Ajax';

class PendingSyncDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: []
    };
    this.loadRows = this.loadRows.bind(this);
  }

  async loadRows() {
    const ajax = Ajax.instance();
    this.props.dispatch(hideSpinner(false));
    try {
      const response = await ajax.get("/dhis-integration/api/syncProgress");
      this.setState({
        rows: response,
      });
    } catch (e) {
      console.log(e);
      this.setState({
        rows: [],
      });
    }
    this.props.dispatch(hideSpinner());
  }
   
  componentDidMount() {
    this.loadRows();
    // await this.props.dispatch(ensureActiveSession());
  }

  renderRows() {
    console.log('rows', this.state.rows);
    return this.state.rows.map((row) => (
      <tr key={row.key} className="table-row">
        <td className="mapping-name" style={{ textAlign: "center" }}>
          {row.key}
        </td>
        <td className="mapping-name" style={{ textAlign: "center" }}>
          {row.value}
        </td>
      </tr>
    ));
  }

  render() {
    return (
      <div>
        <Message />
        <div className="pending-sync">
          <Spinner hide={this.props.hideSpinner} />
          <div
            style={{
              display: "flex",
              direction: "row",
              justifyContent: "flex-end",
            }}
          >
            <button
              type="submit"
              className="send-button"
              disabled={false}
              onClick={() => {
                this.loadRows();
              }}
            >
              Refresh
            </button>
          </div>
          <section className="all-mappings-sections">
            <table className="mapping-table">
              <tbody>
                <tr className="section-title">
                  <td className="title-name">Name</td>
                  <td className="title-name">Pending Sync Count</td>
                </tr>
                {this.renderRows()}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    );
  }
}

PendingSyncDashboard.propTypes = {
  hideSpinner: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  session: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  hideSpinner: state.hideSpinner,
  session: state.session
});

export default connect(mapStateToProps)(PendingSyncDashboard);
