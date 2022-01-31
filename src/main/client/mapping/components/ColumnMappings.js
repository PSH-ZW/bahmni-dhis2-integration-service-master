import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from "underscore";
import {headingMessage} from "../../common/constants";

export default class ColumnMappings extends Component {
    constructor() {
        super();
        this.renderColumns = this.renderColumns.bind(this);
        this.insertValues = this.insertValues.bind(this);
    }

    componentDidMount() {
        this.insertValues();
    }

    shouldComponentUpdate(nextProps) {
        return !(_.isEqual(this.props.columns, nextProps.columns));
    }

    componentDidUpdate() {
        this.insertValues();
    }

    insertValues() {
        let mappingJson = this.props.mappingJson;
        let searchable = this.props.mappingConfig.searchable;
        let comparable = this.props.mappingConfig.comparable;

        this.props.columns.forEach(column => {
            let mapping = mappingJson[column];
            this.refs[column].value = mapping || '';
        });

        searchable && searchable.forEach((column)=>{
            let ref = this.refs[`${column}.searchable`];
            ref && (ref.checked = true);
        });

        comparable && comparable.forEach((column)=>{
            let ref = this.refs[`${column}.comparable`];
            ref && (ref.checked = true);
        });
    }

    renderColumns() {
        return this.props.columns.map(column => (
          <tr key={column} className={`mapping-row table-row ${this.props.category}`}>
            <td className="mapping-column-name">
              {column}
            </td>
            <td className="mapping-data-element">
              <input type="text" className="mapping-input" ref={column} />
            </td>
            {
                  this.props.category === "instance" && (
                  <td className="mapping-data-element">
                    <input ref={`${column}.searchable`} type="checkbox" />
                  </td>
)
              }
            {
                  this.props.category === "instance" && (
                  <td className="mapping-data-element">
                    <input ref={`${column}.comparable`} type="checkbox" />
                  </td>
)
              }
          </tr>
        ));
    }

    render() {
        return (
          <div className="mapping-table-div">
            {/*eslint-disable*/}
                <span className="enrollment-table-span">
                    Please provide DHIS2 {headingMessage[this.props.category]}
                </span>
                {/*eslint-enable*/}
            <section className="column-mapping-section">
              <table className="mapping-table">
                <tbody>
                  <tr className="mapping-row-header">
                    <th className="mapping-header">
                                Bahmni Data Point
                    </th>
                    <th className="mapping-header">
                      {this.props.dhisMappingHeader}
                    </th>
                    {
                        this.props.category === "instance" &&(
                        <th className="mapping-header">
                                Searchable
                        </th>
                        )
                    }
                    {
                        this.props.category === "instance" &&(
                        <th className="mapping-header">
                                Comparable
                        </th>
                        )
                    }
                  </tr>
                  {this.renderColumns()}
                </tbody>
              </table>
            </section>
          </div>
        );
    }
}

ColumnMappings.propTypes = {
    columns: PropTypes.array.isRequired,
    mappingJson: PropTypes.object.isRequired,
    category: PropTypes.string.isRequired,
    dhisMappingHeader: PropTypes.string.isRequired,
    mappingConfig: PropTypes.object.isRequired
};