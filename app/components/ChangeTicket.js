import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './ChangeTicket.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import * as Config from '../utils/Config';
import * as TicketTypeConfig from '../utils/TicketTypeConfig';

export default class ChangeTicket extends Component {

  static propTypes = {
    actions:  PropTypes.func.isRequired,
    ticketType: PropTypes.string.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.ticketConfigProvider = TicketTypeConfig.getTicketTypeConfig(this.props.ticketType);
    this.state = {
      canChange: true,
      ticketNo: '',
    };
    this.setCanChange();
  }

  handleOnClick = () => {
    this.ticketConfigProvider.onClick(this.props.actions, this.state, this.props);
  }

  setCanChange()
  {
    var self = this;
    this.ticketConfigProvider.setIsEnabled(this.props.ticketType, function(response) {
      self.state = response;
    })
  }

  render() {
    return (
      <button className={style[this.props.ticketType]} onClick={this.handleOnClick} disabled={!this.state.canChange}>{this.ticketConfigProvider.text}</button>
    );
  }
}
