import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './ProgressBar.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import moment from 'moment';
import _ from 'underscore';
import * as Config from '../utils/Config';
import * as Storage from '../utils/StorageObj'

export default class ProgressBar extends Component {

  static propTypes = {
    tickets: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      totalTime: 0,
      dayLength: '8h',
      baseURL: '',
      cycleNo: 0
    }
    this.tick = this.tick.bind(this);
    this.intervalHandle = setInterval(this.tick, 400);
    Storage.get({cycleNo: 0, dayLength: 0, baseURL: ''}).then(items => {
      this.setState(items)
    });
  }
  getTicketURL() {
    const { ticket } = this.props;
    if (!ticket) return;
    if (ticket.type == TicketTypes.NOT_SELECTED) return '#';
    return this.state.baseURL + ticket.name;
  }
  tick() {
    const {tickets} = this.props;
    var duration = 0;
    tickets.map(function(ticket) { duration += ticket.duration; });
    this.setState({ duration });
  }
  CreateElements = () => {
    const { tickets } = this.props;
    let segments = [];
    var percent = 0;
    var gradient = 'linear-gradient(to right';
    for (let i = tickets.length-1; i >= 0; i--) {
      var width = tickets[i].width;
      if (percent + width >= 100)
      {
        width = 100 - percent;
      }
      percent += width;
      gradient += `, ${tickets[i].colour} ${percent}%`;

      if (i != 0)
      {
        gradient += `, ${tickets[i-1].colour} ${percent}%`;
      } else { //If last in sequence, fill with transparent bar
        gradient += ', rgba(0, 0, 0, 0) 0)';
      }
    }
    var style = {
      width: '100%',
      background: gradient,
      borderRadius: '20px'
    };
    return <span style={style}></span>;
  }
  getProgressLabel = () => {
    var tickets = this.props.tickets;
    var dayLength = this.state.dayLength;
    var duration = this.state.duration;
    var cycle = [ 
      TimeHelper.FormatTime(duration) + '/' + dayLength + ' (' + TimeHelper.GetPercent(tickets) + ')',
      'Remaining: ' + TimeHelper.FormatTime(TimeHelper.ParseTime(dayLength) - duration),
      TimeHelper.GetPercent(tickets)
    ];

    var cycleNo = this.state.cycleNo%cycle.length
    return cycle[cycleNo];
  }
  onClick = () => {
    this.setState({cycleNo: this.state.cycleNo+1}, () => {
      Storage.set({cycleNo: this.state.cycleNo});
    });
  }
  getTimeStart = () => {
    var tickets = this.props.tickets;
    if (tickets.length == 0) return;
    var time = moment().unix() - this.state.duration;
    return moment(time, 'X').format('hh:mma');
  }

  getTimeEnd = () => {
    var tickets = this.props.tickets;
    if (tickets.length == 0) return;
    var time = moment().unix() + (TimeHelper.ParseTime(this.state.dayLength) - this.state.duration);
    return moment(time, 'X').format('hh:mma');
  }

  render() {
    const { tickets } = this.props;
    var elements = this.CreateElements()
    return (
      <div>
        <span style={{fontWeight: 'bold'}}>{this.getTimeStart()}</span>
        <span style={{float: 'right', fontWeight: 'bold'}}>{this.getTimeEnd()}</span>
        <div style={{position: 'relative'}}>
          <div className={style.progress}>
            <label onClick={this.onClick}>{this.getProgressLabel()}</label>
            {elements}
          </div>
        </div>
      </div>
    );
  }
}
