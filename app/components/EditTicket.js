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
    editTicket: PropTypes.func.isRequired,
    duration: PropTypes.string.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      duration: this.props.duration,
      isValid: true
    };
  }
  handleChange = (event) => {
    this.setState({isValid: TimeHelper.ValidateTime(event.target.value)});
    this.setState({duration: event.target.value});
  }
  handleOnSubmit = () => {
    var time = TimeHelper.ParseTime(this.state.duration);
    this.props.editTicket(this.props.ticket.id, time);
    this.props.closeModal();
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
        <div className={buttonStyle.buttons}>
          <button onClick={this.handleOnSubmit} disabled={!this.state.isValid} className={buttonStyle.submit}>Submit</button>
          <button onClick={this.props.closeModal}>Close</button>
        </div>
      </div>
    );
  }
}
