import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DisplayOptions extends Component {
  constructor() {
    super();
    this.onSelect = this.onSelect.bind(this);
    this.getListItems = this.getListItems.bind(this);
  }

  onSelect(_event, index) {
    this.props.filteredTablesAction(this.props.options[index]);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options != this.props.options) {
      // this.forceUpdate();
    }
  }
  getListItems() {
    return this.props.options.map((option, index) => {
      const label = option["displayName"];
      console.log(option, label);
      return (
        /*eslint-disable*/
        <li
          key={label}
          onClick={(e) => {
            this.onSelect(e, index);
          }}
          data-table-name={label}
          className="table-name"
        >
          {label}
        </li>
      );
    });
    /* eslint-enable */
  }

  render() {
    return (
      <div className="tables-list">
        <ul
          type="none"
          className="filtered-tables"
          style={{
            maxWidth: this.props.maxWidth ? this.props.maxWidth : "500px",
          }}
        >
          {this.props &&
            this.props.options &&
            this.props.options.length > 0 &&
            this.getListItems()}
        </ul>
      </div>
    );
  }
}

DisplayOptions.propTypes = {
  options: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
  filteredTablesAction: PropTypes.func.isRequired,
  maxWidth: PropTypes.string,
};
