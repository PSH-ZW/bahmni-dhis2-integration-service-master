import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { showMessage } from './Actions';

const SUCCESS = 'success';
class Message extends Component {
  constructor() {
    super();
    this.closeMessage = this.closeMessage.bind(this);
    this.closeSuccessMessage = this.closeSuccessMessage.bind(this);
    this.copyMessage = this.copyMessage.bind(this);
    this.setTimeToCloseMessage = this.setTimeToCloseMessage.bind(this);
  }

  onError() {
    return (
      <div className="message-container error-message-container">
        <div className="message-text">
          <div className="types-for-errors error-message" id="error">
            {this.props.message}
          </div>
          <div className="button-wrapper clearfix">
            <button type="button" className="copy-btn fl" onClick={this.copyMessage}>
              Copy Error
            </button>
            <button type="button" className="show-btn fr" onClick={this.closeMessage}>
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  onSuccess() {
    return (
      <div className="message-container success-message-container">
        <div className="message-icon">
          <i className="fa fa-check-circle" />
        </div>
        <div className="message-text">
          {this.props.message}
        </div>
      </div>
    );
  }

  setTimeToCloseMessage() {
    setTimeout(this.closeSuccessMessage, 3000);
  }

  copyMessage() {
    if (document.selection) {
      const range = document.body.createTextRange();
      range.moveToElementText(document.getElementById('error'));
      range.select();
    } else if (window.getSelection) {
      const range = document.createRange();
      range.selectNode(document.getElementById('error'));
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
    document.execCommand('Copy');
  }

  closeSuccessMessage() {
    this.props.type === SUCCESS && this.closeMessage();
  }

  closeMessage() {
    this.props.dispatch(showMessage());
  }

  render() {
    if (this.props.message === '') {
      return null;
    }
    if (this.props.type === SUCCESS) {
      this.setTimeToCloseMessage();
    }
    return (
      <div>
        {this.props.type === SUCCESS ? this.onSuccess() : this.onError()}
      </div>
    );
  }
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  message: state.showMessage.responseMessage,
  type: state.showMessage.responseType
});

export default connect(mapStateToProps)(Message);
