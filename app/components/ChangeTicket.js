import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './ChangeTicket.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../Utils/TimeHelper';
import * as Config from '../utils/Config';

export default class ChangeTicket extends Component {

  static propTypes = {
    addTicket:  PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      canChange: false,
      ticketNo: null
    };
  }

  handleOnClick = () => {
    this.props.addTicket(this.state.ticketNo);
  }
  isTicket(url) {
    return url.includes(Config.getBaseUrl());
  }

  render() {
    var self = this;
    chrome.tabs.query({'active': true}, function (tabs) {
      var url = tabs[0].url;
      var baseUrl = Config.getBaseUrl();
      var ticketNo = url.replace(baseUrl, '');
      self.setState({
        canChange: self.isTicket(url),
        ticketNo
      });
    });
    return (
      <button className={style.btnChange} onClick={this.handleOnClick} disabled={!this.state.canChange}>Change to this ticket</button>
    );
  }
}
