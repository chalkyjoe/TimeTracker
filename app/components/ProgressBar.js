import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './ProgressBar.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
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
    var percent = 0;
    for (let i = 0; i < tickets.length; i++) {
      var width = tickets[i].width;
      
      if (percent + width >= 100)
      {
        width = 100 - percent;
      }

      percent += width;
      var style = {
        width: width + '%',
        background: tickets[i].colour,
        borderRadius: tickets.length == 1 && i == 0 ? '20px' :
                      i == 0 ? '20px 0 0 20px' : 
                      i == tickets.length-1 ? '0 20px 20px 0' :
                      ''
      };
      segments.push(<span style={style}></span>);
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
  getTimeStart = () => {
    var tickets = this.props.tickets;
    if (tickets.length == 0) return;
    var time = tickets[0].timeStarted;
    return moment(time, 'X').format('hh:mma');
  }

  getTimeEnd = () => {
    var tickets = this.props.tickets;
    if (tickets.length == 0) return;
    var time = tickets[0].timeStarted;
    return moment(time + TimeHelper.ParseTime(Config.getDayLength()), 'X').format('hh:mma');
  }

  render() {
    const { tickets } = this.props;
    var table = this.CreateTable()
    return (
      <div>
        <span style={{fontWeight: 'bold'}}>{this.getTimeStart()}</span>
        <span style={{float: 'right', fontWeight: 'bold'}}>{this.getTimeEnd()}</span>
        <div style={{position: 'relative'}}>
          <div className={style.progress}>
            <label>{this.getTotalTime()}</label>
            {table}
          </div>
          <div className={style.progress + ' ' + style.progressOverlay}></div>
        </div>
      </div>
    );
  }
}
