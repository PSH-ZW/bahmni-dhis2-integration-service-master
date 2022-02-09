import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends Component {
  constructor() {
    super();
    this.redirect = this.redirect.bind(this);
  }

  redirect() {
    const { history } = this.props;
    if (history.location.pathname !== '/dhis-integration/') {
      history.push('/dhis-integration/');
    } else {
      window.location.pathname = '/home';
    }
  }

  render() {
    if (!this.props.showHeader) {
      return null;
    }
    return (
      <div className="opt-header-wrapper">
        <header className="center header-wrap-dhis">
          {this.props.showHomeButton && (
          <button type="submit" className="back-btn" onClick={this.redirect}>
            <i className="fa fa-home" />
          </button>
          )}
        </header>
      </div>
    );
  }
}

Header.propTypes = {
  showHomeButton: PropTypes.bool.isRequired,
  showHeader: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  showHomeButton: state.showHomeButton,
  showHeader: state.showHeader
});

export default connect(mapStateToProps)(Header);
