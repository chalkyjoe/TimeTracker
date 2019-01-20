import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './ProgressBar.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import moment from 'moment';
import _ from 'underscore';
import * as Config from '../utils/Config';

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
    Config.getBaseUrl().then(url => {
      this.setState({baseURL: url});
    })
    Config.getDayLength().then(length => {
      this.setState({dayLength: length});
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
  getTotalTime = () => {
    const {tickets} = this.props;
    var dayLength = this.state.dayLength;
    var percent = 0;
    tickets.map(function(ticket) { percent += ticket.width })
    return TimeHelper.FormatTime(this.state.duration) + '/' + dayLength + ' (' + Math.floor(percent) + '%)';
  }
  getRemainingTime = () => {
    return 'Remaining: ' + TimeHelper.FormatTime(TimeHelper.ParseTime(this.state.dayLength) - this.state.duration);
  }
  getPercent = () => {
    const {tickets} = this.props;
    var percent = 0;
    tickets.map(function(ticket) { percent += ticket.width })
    return Math.floor(percent) + '%';
  }
  getProgressLabel = () => {
    var cycle = [ 
      this.getTotalTime(),
      this.getRemainingTime(),
      this.getPercent()
    ]
    var cycleNo = this.state.cycleNo%cycle.length;
    return cycle[cycleNo];
  }
  onClick = () => {
    this.setState({cycleNo: this.state.cycleNo+1})
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
