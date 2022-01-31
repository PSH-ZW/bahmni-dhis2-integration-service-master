import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getTableColumns} from '../actions/MappingActions';

export default class DisplayTableNames extends Component {
    constructor() {
        super();
        this.onSelect = this.onSelect.bind(this);
        this.getListItems = this.getListItems.bind(this);
    }

    onSelect(_event) {
       this.props.dispatch(getTableColumns(_event.target.dataset.tableName, this.props.category));
       this.props.filteredTablesAction();
    }

    getListItems() {
        return this.props.filteredTables.map((tableName) => (
          /*eslint-disable*/
          <li
            key={tableName}
            onClick={this.onSelect}
            data-table-name={tableName}
            className="table-name"
          >
            {tableName}
          </li>));
          /*eslint-enable*/
    }

    render() {
        return (
          <div className="tables-list">
            <ul
              type="none"
              className="filtered-tables"
            >
              {this.getListItems()}
            </ul>
          </div>
        );
    }
}

DisplayTableNames.propTypes = {
    filteredTables: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    filteredTablesAction: PropTypes.func.isRequired,
    category: PropTypes.string.isRequired
};