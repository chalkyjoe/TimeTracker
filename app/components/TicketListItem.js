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
      color: '#fff'
    };
  }
  componentDidMount() {
    this.determineTextColour(this.props.ticket.colour);    
  }

  determineTextColour = (color) =>{
    // Variables for red, green, blue values
    var r, g, b, hsp;
    console.log(color);
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {

        // If HEX --> store the red, green, blue values in separate variables
        color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
        
        r = color[1];
        g = color[2];
        b = color[3];
    } 
    else {
        
        // If RGB --> Convert it to HEX: http://gist.github.com/983661
        color = +("0x" + color.slice(1).replace( 
        color.length < 5 && /./g, '$&$&'));

        r = color >> 16;
        g = color >> 8 & 255;
        b = color & 255;
    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
    if (hsp>150) {
      console.log(hsp);
        this.setState({text: {color: '#000', textShadow: '1px 1px #fff' }});
    } 
    else {
        this.setState({text: {color: '#fff', textShadow: '1px 1px #000' }})
        
    }
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
      <li style={{background: ticket.colour}} className={style.listItem}>
        <span onClick={this.handleClick} className={style.ticketDescription} style={this.state.text}>{ticket.name}{ticket.summary ? ' - ' : null}{ticket.summary}</span>
        <div className={style.pushRight}>
          <label>{TimeHelper.FormatTime(ticket.duration)}</label>
          <FontAwesomeIcon icon={faEllipsisV} className={style.fa} onClick={this.toggleMenuVisible}/>
          <ul className={style.menu} style={{display: this.state.menuOpen ? 'block' : 'none' }}>
            <li onClick={this.handleChangeClick}>Switch</li>
            <li onClick={this.handleEditClick}>Edit</li>
            <li onClick={this.handleDeleteClick}>Delete</li>
          </ul>
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
    );
  }
}

export default onClickOutside(TicketListItem);