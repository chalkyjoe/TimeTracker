import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import onClickOutside from 'react-onclickoutside'
import style from './EditTicket.css';
import buttonStyle from './Buttons.css';
import * as TimeHelper from '../utils/TimeHelper';
import * as Config from '../utils/Config';

export default class EditTicket extends Component {

  static propTypes = {
    ticket: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    duration: PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      duration: this.props.duration,
      isValid: true,
      isMergeValid: true,
      selectedTicket: null
    };
  }

  handleChange = (event) => {
    this.setState({isValid: event.target.value ? TimeHelper.ValidateTime(event.target.value) : false});
    this.setState({duration: event.target.value});
  }

  handleOnSubmit = () => {
    var selectedTicket = this.state.selectedTicket;
    var self = this;
    var time = TimeHelper.ParseTime(this.state.duration);
    this.props.editTicket(this.props.ticket, time, this.props.tickets[selectedTicket]);
    Config.getDayLength().then(dayLength => {
      self.props.updateProgress(dayLength);
    });
    this.props.closeModal();
  }

  getTickets = () => {
    var tickets = this.props.tickets;
    var ticket = this.props.ticket;
    var ticketOptions = [];
    for (var i=0;i<tickets.length;i++)
    {
      if (tickets[i].id != ticket.id) ticketOptions.push(<option value={i}>{tickets[i].name}{tickets[i].summary ? ' - ' : null}{tickets[i].summary}</option>)
    }
    return ticketOptions;
  }
  getAssignLabel = () => {
    var ticket = this.props.ticket;
    if (!this.state.duration || !this.state.isValid) return '0s'
    return TimeHelper.FormatTime(this.getDifference());
  }
  onChange = (event) => {
    this.setState({selectedTicket: event.target.value});
  }
  getMergeTimeTotal = () => {
    var selectedTicket = this.props.tickets[this.state.selectedTicket];
    var ticket = this.props.ticket;
    if (!selectedTicket) return '';
    var total = selectedTicket.duration + (this.getDifference());
    var isValid = total > 0;
    if (this.state.isMergeValid != isValid) this.setState({isMergeValid: isValid})
    return TimeHelper.FormatTime(total);
  }
  getDifference = () => {
    var selectedTicket = this.props.tickets[this.state.selectedTicket];
    var ticket = this.props.ticket;
    if (!selectedTicket) return '';
    return (parseInt(ticket.duration) - TimeHelper.ParseTime(this.state.duration));
  }
  render() {
    const { ticket } = this.props;
    return (
      <div>
        <h1>Edit Time</h1>
        <p className={style.editTicketInformation}><strong>Ticket Name</strong></p>
        <input disabled className={style.editTimeInput}  value={ticket.name + (ticket.summary ? ' - ' + ticket.summary : '')} />
        <p className={style.editTicketInformation}><strong>Current Time</strong></p>
        <input disabled className={style.editTimeInput}  value={TimeHelper.FormatTime(ticket.duration)} />
        <p className={style.editTicketInformation}><strong>New Time</strong></p>
        <input value={this.state.duration} onChange={this.handleChange} className={style.editTimeInput} />
        <p className={style.editTicketInformation}><strong>Assign difference to... ({this.getAssignLabel()})</strong></p>
        <select className={style.editTimeInput} onChange={this.onChange} value={this.state.selectedTicket}>
          <option value="">None</option>
          {this.getTickets()}
        </select>
        <p className={style.editTicketInformation}>Merge Ticket Time</p>
        <input disabled className={style.editTimeInput} value={this.getMergeTimeTotal()} />
        <div className={buttonStyle.buttons}>
          <button onClick={this.handleOnSubmit} disabled={!this.state.isValid || !this.state.isMergeValid} className={buttonStyle.submit}>Submit</button>
          <button onClick={this.props.closeModal}>Close</button>
        </div>
      </div>
    );
  }
}
