import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './TicketList.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import moment from 'moment';
import * as Config from '../utils/Config';

export default class TicketList extends Component {

  static propTypes = {
    tickets: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  CreateTable = () => {
    const { tickets } = this.props;
    let segments = [];
    var percent = 0;
    for (let i = 0; i < tickets.length; i++) {
      var ticket = tickets[i];
      var style = {
        background: ticket.colour
      };
      
      segments.push(<li style={style}>{ticket.name}  <label>{TimeHelper.FormatTime(ticket.duration)}</label></li>);
    }
    return segments;
  }
  getTotalTime = () => {
    const {tickets} = this.props;
    var duration = 0;
    tickets.map(function(ticket) { duration += ticket.duration; });
    var dayLength = Config.getDayLength();
    var percent = 0;
    tickets.map(function(ticket) { percent += ticket.width })

    return TimeHelper.FormatTime(duration) + '/' + dayLength + ' (' + Math.floor(percent) + '%)';
  }

  render() {
    const { ticket } = this.props;
    var table = this.CreateTable()
    return (
      <div style={{position: 'relative'}}>
        <ul className={style.listContainer}>
          {table}
        </ul>
      </div>
    );
  }
}
