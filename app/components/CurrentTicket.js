import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './CurrentTicket.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import moment from 'moment';
import * as Config from '../utils/Config';

export default class CurrentTicket extends Component {

  static propTypes = {
    ticket: PropTypes.object.isRequired,
    incrementTime: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context)
    this.tick = this.tick.bind(this);
    this.intervalHandle = setInterval(this.tick, 400);
  }

  getTicketURL() {
    const { ticket } = this.props;
    if (!ticket) return;
    if (ticket.type == TicketTypes.NOT_SELECTED) return '#';
    return Config.getBaseUrl() + ticket.name;
  }

  tick() {
    const { ticket, incrementTime } = this.props;
    if (ticket)
    {
      incrementTime(ticket.id);
    }
  }

  render() {
    const { ticket } = this.props;
    if (ticket)
    {
      return (
          <div className={style.currentTicket}>
            <span>Current: <a href={this.getTicketURL()}>{ticket.name}</a></span>
              <span>{TimeHelper.FormatTime(ticket.duration)}</span>
          </div>
      );
    } else {
      return (<span>No Ticket Currently Selected</span>);
    }
  }
}
