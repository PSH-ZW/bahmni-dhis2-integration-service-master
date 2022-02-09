import React from 'react';
import PropTypes from 'prop-types';

const Spinner = (props) => {
  if (props.hide) {
    return null;
  }
  return (
    <div className="overlay" />
  );
};

Spinner.propTypes = {
  hide: PropTypes.bool.isRequired,
};

export default Spinner;
