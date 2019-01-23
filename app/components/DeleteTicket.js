import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './EditTicket.css';
import buttonStyle from './Buttons.css';
import moment from 'moment';

export default class DeleteTicket extends Component {

  static propTypes = {
    ticket: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    DeleteTicket: PropTypes.func.isRequired,
    tickets: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTicket: ''
    }
  }
  handleOnSubmit = () => {
    var selectedTicket = this.state.selectedTicket;
    this.props.DeleteTicket(this.props.ticket, selectedTicket != '' ? this.props.tickets[selectedTicket] : '');
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
  onChange = (event) => {
    this.setState({selectedTicket: event.target.value});
  }
  render() {
    const { ticket } = this.props;
    return (
      <div>
        <h1>Delete Ticket?</h1>
        <p className={style.editTicketInformation}><strong>Ticket Name</strong></p>
        <input disabled className={style.editTimeInput}  value={ticket.name + (ticket.summary ? ' - ' + ticket.summary : '')} />
        <p className={style.editTicketInformation}><strong>Merge time with...</strong></p>
        <select className={style.editTimeInput} onChange={this.onChange} value={this.state.selectedTicket}>
          <option value="">None</option>
          {this.getTickets()}
        </select>
        <div className={buttonStyle.buttons}>
          <button onClick={this.handleOnSubmit} className={buttonStyle.submit}>Delete</button>
          <button onClick={this.props.closeModal}>Close</button>
        </div>
      </div>
    );
  }
}
