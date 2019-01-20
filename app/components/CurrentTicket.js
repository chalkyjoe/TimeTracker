import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './CurrentTicket.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import * as Config from '../utils/Config';
import moment from 'moment';

export default class CurrentTicket extends Component {

  static propTypes = {
    ticket: PropTypes.object.isRequired,
    incrementTime: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      dayLength: '8h'
    }
    this.tick = this.tick.bind(this);
    this.intervalHandle = setInterval(this.tick, 400);
  }

  getTicketURL = () => {
    const { ticket } = this.props;
    if (!ticket) return;
    if (ticket.type == TicketTypes.NOT_SELECTED) return '#';
    Config.getBaseUrl().then(url => {
      chrome.tabs.create({ url: 'http://' + url + '/browse/' + ticket.name });
    });
  }

  tick() {
    const { ticket, incrementTime,  } = this.props;
    if (ticket)
    {
      Config.getDayLength().then(dayLength => {
        if (this.state.dayLength != dayLength)
        {
          this.props.updateProgress(dayLength);
          this.setState({dayLength});
        }
      });
      this.props.incrementTime(ticket.id, this.state.dayLength);
    }
  }

  render() {
    const { ticket } = this.props;
    if (ticket)
    {
      return (
          <div className={style.currentTicket}>
            <span className={style.ticketDescription}>Current: <a href="#" onClick={this.getTicketURL}>{ticket.name}{ticket.summary ? ' - ' : null} {ticket.summary}</a></span>
              <span>{TimeHelper.FormatTime(ticket.duration)}</span>
          </div>
      );
    } else {
      return (<span>No Ticket Currently Selected</span>);
    }
  }
}
