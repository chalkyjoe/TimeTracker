import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './TicketListItem.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import moment from 'moment';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import onClickOutside from 'react-onclickoutside';
import EditTicket from './EditTicket.js';
import DeleteTicket from './DeleteTicket.js';

class TicketListItem extends Component {

  static propTypes = {
    ticket: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      menuOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      duration: 0,
      isValid: true
    };
  }

  toggleMenuVisible = () => {
    this.setState({menuOpen: !this.state.menuOpen})
  }

  handleClickOutside = evt => {
    this.setState({menuOpen: false})
  };

  closeEditModal = () => {
    this.setState({editModalOpen: false});
  }
  closeDeleteModal = () => {
    this.setState({deleteModalOpen: false});
  }

  handleEditClick = () => {
    this.setState({ editModalOpen: true, menuOpen: false });
    this.setState({duration: TimeHelper.FormatTime(this.props.ticket.duration)});
  }

  handleDeleteClick = () => {
    this.setState({ deleteModalOpen: true, menuOpen: false });
  }

  render() {
    const { ticket } = this.props;
    return (
      <li style={{background: ticket.colour}} className={style.listItem}>
        <span className={style.ticketDescription}>{ticket.name}{ticket.summary ? ' - ' : null}{ticket.summary}</span>
        <div className={style.pushRight}>
          <label>{TimeHelper.FormatTime(ticket.duration)}</label>
          <FontAwesomeIcon icon={faEllipsisV} className={style.fa} onClick={this.toggleMenuVisible}/>
          <ul className={style.menu} style={{display: this.state.menuOpen ? 'block' : 'none' }}>
            <li onClick={this.handleEditClick}>Edit</li>
            <li onClick={this.handleDeleteClick}>Delete</li>
          </ul>
        </div>
        <Modal
            isOpen={this.state.editModalOpen}
            onRequestClose={this.closeEditModal}
        >
          <EditTicket ticket={ticket} closeModal={this.closeEditModal} editTicket={this.props.EditTicket} duration={this.state.duration} />
        </Modal>
        <Modal
            isOpen={this.state.deleteModalOpen}
            onRequestClose={this.closeDeleteModal}
        >
          <DeleteTicket ticket={ticket} closeModal={this.closeDeleteModal} DeleteTicket={this.props.DeleteTicket} duration={this.state.duration} />
        </Modal>
      </li>
    );
  }
}

export default onClickOutside(TicketListItem);