import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {connect} from 'react-redux';
import fileDownload from 'js-file-download';
import Spinner from '../common/Spinner';
import {getAllMappings, exportMapping, exportAllMappings, importMappings} from './actions/MappingActions';
import Message from '../common/Message';
import { showMessage, hideSpinner } from '../common/Actions';
import auditLog from '../common/AuditLog';
import {auditLogEventDetails} from '../common/constants';

class MappingDashboard extends Component {
    constructor() {
        super();
        this.renderMappingNames = this.renderMappingNames.bind(this);
        this.redirectToAddEditMapping = this.redirectToAddEditMapping.bind(this);
        this.exportMapping = this.exportMapping.bind(this);
        this.exportAllMappings = this.exportAllMappings.bind(this);
        this.parseFile = this.parseFile.bind(this);
        this.importFile = this.importFile.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(getAllMappings());
    }

    redirectToAddEditMapping() {
        this.props.history.push('/dhis-integration/mapping/new');
    }

    async exportMapping(mappingName) {
        this.props.dispatch(hideSpinner(false));

        auditLogEventDetails.EXPORT_MAPPING_SERVICE.message = `User ${this.props.user} exported ${mappingName} Mapping Service`;
        await auditLog(auditLogEventDetails.EXPORT_MAPPING_SERVICE);

        let mappingDetails = await exportMapping(mappingName, this.props.dispatch);
        fileDownload(JSON.stringify(mappingDetails), `${mappingName}.json`);
        this.props.dispatch(hideSpinner());
        this.props.dispatch(showMessage(`Successfully exported ${mappingName} Mapping`, "success"));
    }

    async exportAllMappings() {
        this.props.dispatch(hideSpinner(false));
        await auditLog(auditLogEventDetails.EXPORT_ALL_MAPPINGS);

        const timestamp = moment().format("DDMMMYYYY_kk:mm:ss");
        const detailedMappingList = await exportAllMappings(this.props.dispatch);
        fileDownload(JSON.stringify(detailedMappingList), `AllMappingExport_${timestamp}.json`);
        this.props.dispatch(hideSpinner());
        this.props.dispatch(showMessage(`Successfully exported all the mappings`, "success"));
    }

    importFile(_event) {
        let file = _event.target.files;
        this.parseFile(file);
    }

    parseFile(file) {
        const reader = new FileReader();

        reader.onload = () => {
            try {
                let parsedInfo = JSON.parse(reader.result);
                this.props.dispatch(importMappings(parsedInfo));
            } catch (e) {
                this.props.dispatch(showMessage("Error while validating json file. Please import valid json file"));
            }
        };

        reader.readAsText(file[0]);
    }

    renderMappingNames() {
        return (
            this.props.mappingNames.sort().map(mappingName => (
              <tr key={mappingName} className="table-row">
                <td className="mapping-name">
                  {mappingName}
                </td>
                <td className="edit-mapping-button">

                  <a href={`/dhis-integration/mapping/edit/${mappingName}`} target="_parent" tabIndex="-1">
                    <button type="submit" className="edit-button">
Edit
                    </button>
                  </a>
                  <button type="submit" onClick={() => this.exportMapping(mappingName)} className="export-button">
                      Export
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
            <Spinner hide={this.props.hideSpinner} />
            <div className="center mapping-names-table">
              <button
                type="submit"
                className="add-mapping-button"
                onClick={this.redirectToAddEditMapping}
              >
                <i className="fa fa-plus-circle plus-sign" aria-hidden="true" />
                        Add Mapping
              </button>
              <button type="submit" className="import-button" onClick={() => importBtn.click()}>
                Import Mapping
                <input
                  accept=".json"
                  id="importBtn"
                  className="import-input"
                  onChange={this.importFile}
                  onClick={(e) => {
                       // eslint-disable-next-line
                       e.target.value = null;
                   }}
                  type="file"
                />
              </button>
              <button
                type="submit"
                className="export-all-button"
                disabled={this.props.mappingNames.length === 0}
                onClick={this.exportAllMappings}
              >
                    Export All Mappings
              </button>
              <section className="all-mappings-sections">
                <h2 className="section-title">
                            Mapping Name
                </h2>
                <table className="mapping-table">
                  <tbody>
                    {this.renderMappingNames()}
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        );
    }
}

MappingDashboard.propTypes = {
    hideSpinner: PropTypes.bool.isRequired,
    mappingNames: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    user: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
    mappingNames: state.allMappingNames,
    hideSpinner: state.hideSpinner,
    user: state.session.user
});

export default connect(mapStateToProps)(MappingDashboard);
