import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Modal from 'react-modal';
import style from './FinishDay.css';
import buttonStyle from './Buttons.css';
import _ from 'underscore';
import * as TimeHelper from '../utils/TimeHelper';
import * as TempoAPI from '../utils/TempoAPI';
import * as TicketTypes from '../constants/TicketTypes';
import * as Config from '../utils/Config';

export default class FinishDay extends Component {

  static propTypes = {
    finishDay:  PropTypes.func.isRequired,
    tickets: PropTypes.array.isRequired,
    uploadTicket: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      modalOpen: false,
      dayLength: 0,
      readyToFinish: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    Config.getDayLength().then(length => {
      this.setState({dayLength: length});
    });
  }

  openModal() {
    this.setState({modalOpen: true});
  }

  afterOpenModal() {
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalOpen: false });
  }
  checkDayFinishable = () => {
    var uploadedTickets = this.props.tickets.filter(ticket =>  ticket.uploaded == true );
    return uploadedTickets.length == this.props.tickets.filter(ticket => ticket.type != TicketTypes.BREAK).length
  }
  handleOnClick = () => {
    this.setState({ modalOpen: true });
  }

  handleOnSubmit = () => {
    var self = this;
    _.forEach(this.props.tickets.filter(ticket => ticket.uploaded == false && ticket.type != TicketTypes.BREAK), function(ticket) {
      TempoAPI.LogWork(ticket).then(function(response) {
       if (response.status == 201) { 
        self.props.uploadTicket(ticket, true);
       } else {
        response.json().then(function(res) {
          self.props.uploadTicket(ticket, false);
        });
       }
     });
    });
  }

  finishDay = () => {
    if (this.checkDayFinishable() == false)
    {
      if (confirm('Not all tickets have been submitted. Continue with finishing day?') == false) return;
    }
    this.props.finishDay(this.props.tickets);
    this.props.closeModal();
  }

  getTotalTime = () => {
    let tickets = this.props.tickets;
    var dayLength = TimeHelper.ParseTime(this.state.dayLength);
    var duration = 0;
    var modifier = '';
    var timeStyle = {color: 'red'};
    tickets.map(function(ticket) { duration += ticket.duration; });
    var difference = duration - dayLength;
    if (difference > 0)
    {
      modifier = '+';
      timeStyle.color = 'green';
    }
    return <p style={timeStyle}>Time Completed: {TimeHelper.FormatTime(duration)} ({modifier}{TimeHelper.FormatTime(difference)})</p>;
  }

  CreateTable = () => {
    let tickets = this.props.tickets;
    let segments = [];
    var percent = 0;
    for (let i = 0; i < tickets.length; i++) {
      var ticket = tickets[i];
      var liStyle = {
        background: ticket.uploaded === false ? 'red' : 
                    ticket.uploaded === true ? 'green' :
                    ticket.uploaded === null ? 'orangered' :
                    'orangered'
      };
      if (ticket.type != TicketTypes.BREAK)
      {
        segments.push(<li key={'fd' + i} style={liStyle} className={style.ticket}>
          <span key={'fd1' + i} className={style.ticketDescription}>{ticket.name}{ticket.summary ? ' - ' : null}{ticket.summary}</span>
          <label key={'fd2' + i}>{TimeHelper.FormatTime(ticket.duration)}</label>
        </li>);
      }
    }
    return segments;
  }

  render() {
    return (
      <span>
      <button className={style.finishDay} onClick={this.handleOnClick} disabled={this.props.tickets.length == 0}>Finish Day</button>
      <Modal
          isOpen={this.state.modalOpen}
        >
        <h1>Finish Day</h1>
        <p>Tickets completed: {this.props.tickets.length}</p>
        {this.getTotalTime()}
        <ul className={style.container}>
          {this.CreateTable()}
        </ul>
        <div className={buttonStyle.buttons}>
          <button onClick={this.handleOnSubmit} className={buttonStyle.submit}>Submit</button>
          <button onClick={this.closeModal}>Close</button>
        </div>
        <button onClick={this.finishDay} className={buttonStyle.finish}>Finish Day</button>
        </Modal>
      </span>
    );
  }
}
