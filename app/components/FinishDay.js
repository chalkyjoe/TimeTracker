import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './FinishDay.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import * as Config from '../utils/Config';

export default class FinishDay extends Component {

  static propTypes = {
    finishDay:  PropTypes.func.isRequired,
    ticketCount: PropTypes.number.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  handleOnClick = () => {
  	this.props.finishDay();
  }

  render() {
    return (
      <button className={style.finishDay} onClick={this.handleOnClick} disabled={!this.props.ticketCount != 0}>Finish Day</button>
    );
  }
}
