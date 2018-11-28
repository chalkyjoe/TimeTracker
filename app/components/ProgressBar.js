import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './ProgressBar.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../Utils/TimeHelper';
import moment from 'moment';
import * as Config from '../utils/Config';

export default class ProgressBar extends Component {

  static propTypes = {
    tickets: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }

  CreateTable = () => {
    const { tickets } = this.props;
    let segments = [];

    for (let i = 0; i < tickets.length; i++) {
      var style = {width: this.getSegmentLength(i)}
      segments.push(<span style={style}></span>);
    }
    return segments;
  }
  getTotalTime = () => {
    const {tickets} = this.props;
    var duration = 0;
    tickets.map(function(ticket) {
      duration = duration + ticket.duration;
    })
    var hoursInDay = Config.getDayLength();
    return TimeHelper.FormatTime(duration) + '/' + hoursInDay + 'h' + ' (' + Math.floor((duration / ((hoursInDay*3600)/100))) + '%)';
  }
  getSegmentLength(index) {
    const { tickets } = this.props;
    var ticketsReversed = tickets.reverse();
    var ticket = ticketsReversed[index];
    var hoursInDay = Config.getDayLength();
    return (ticket.duration / ((hoursInDay*3600)/100)) + '%';

  }

  render() {
    const { ticket } = this.props;
    var table = this.CreateTable()
    return (
      <div className={style.progress}>
        <label>{this.getTotalTime()}</label>
        {table}
      </div>
    );
  }
}
