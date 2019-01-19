import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './EditTicket.css';
import buttonStyle from './Buttons.css';
import moment from 'moment';

export default class DeleteTicket extends Component {

  static propTypes = {
    ticket: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    DeleteTicket: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
  }
  handleOnSubmit = () => {
    this.props.DeleteTicket(this.props.ticket.id);
    this.props.closeModal();
  }
  render() {
    const { ticket } = this.props;
    return (
      <div>
        <h1>Delete Ticket?</h1>
        <p className={style.editTicketInformation}><strong>Ticket Name</strong></p>
        <input disabled className={style.editTimeInput}  value={ticket.name + (ticket.summary ? ' - ' + ticket.summary : '')} />
        <div className={buttonStyle.buttons}>
          <button onClick={this.handleOnSubmit} className={buttonStyle.submit}>Delete</button>
          <button onClick={this.props.closeModal}>Close</button>
        </div>
      </div>
    );
  }
}
