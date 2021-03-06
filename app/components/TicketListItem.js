import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './TicketListItem.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import * as Config from '../utils/Config';
import moment from 'moment';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import onClickOutside from 'react-onclickoutside';
import EditTicket from './EditTicket.js';
import DeleteTicket from './DeleteTicket.js';


class TicketListItem extends Component {

  static propTypes = {
    ticket: PropTypes.object.isRequired,
    tickets: PropTypes.array.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      menuOpen: false,
      editModalOpen: false,
      deleteModalOpen: false,
      duration: 0,
      isValid: true,
      mousex: 0,
      mousey: 0
    };
  }

  toggleMenuVisible = (e) => {
    e.preventDefault();
    console.log(e.pageX);
    this.setState({menuOpen: !this.state.menuOpen, mousex: e.clientX, mousey: e.clientY})
    
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
  handleChangeClick = () => {
    this.props.actions.completeCurrentTicket();
    this.props.actions.addTicket(this.props.ticket.name, null, this.props.ticket.summary, this.props.ticket.type);
    this.setState({ menuOpen: false });
  }

  handleClick = () => {
    if (this.props.ticket.type != TicketTypes.BREAK)
    {
      Config.getBaseUrl().then(url => {
        chrome.tabs.create({ url: 'http://' + url + '/browse/' + this.props.ticket.name });
      });
    }
  }

  render() {
    const { ticket, tickets } = this.props;
    return (
      <div>
        <li style={{borderLeft: '5px solid ' + ticket.colour}} className={style.listItem} onContextMenu={this.toggleMenuVisible}>
          <span onClick={this.handleClick} className={style.ticketDescription}>{ticket.name}{ticket.summary ? ' - ' : null}{ticket.summary}</span>
          <div className={style.pushRight}>
            <label>{TimeHelper.FormatTime(ticket.duration)}</label>
            <FontAwesomeIcon icon={faEllipsisV} className={style.fa} onClick={this.toggleMenuVisible}/>
          </div>
          <Modal
              isOpen={this.state.editModalOpen}
              onRequestClose={this.closeEditModal}
              ariaHideApp={false}
          >
            <EditTicket ticket={ticket} tickets={tickets} closeModal={this.closeEditModal} updateProgress={this.props.actions.updateProgress} editTicket={this.props.actions.editTicket} duration={this.state.duration} />
          </Modal>
          <Modal
              isOpen={this.state.deleteModalOpen}
              onRequestClose={this.closeDeleteModal}
              ariaHideApp={false}
          >
            <DeleteTicket ticket={ticket} tickets={tickets} closeModal={this.closeDeleteModal} DeleteTicket={this.props.actions.deleteTicket} duration={this.state.duration} />
          </Modal>
        </li>
        <ul className={style.menu} style={{display: (this.state.menuOpen ? 'block' : 'none'), left: this.state.mousex + 'px', top: this.state.mousey + 'px' }}>
          <li onClick={this.handleChangeClick}>Switch</li>
          <li onClick={this.handleEditClick}>Edit</li>
          <li onClick={this.handleDeleteClick}>Delete</li>
        </ul>
      </div>
    );
  }
}

export default onClickOutside(TicketListItem);