import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Modal from 'react-modal';
import style from './FinishDay.css';
import _ from 'underscore';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import * as Config from '../utils/Config';

export default class FinishDay extends Component {

  static propTypes = {
    finishDay:  PropTypes.func.isRequired,
    ticketCount: PropTypes.number.isRequired,
    tickets: PropTypes.array.isRequired,
    uploadTicket: PropTypes.func.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      modalOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalOpen: false});
  }

  handleOnClick = () => {
    this.setState({ modalOpen: true });
  }


  handleOnSubmit = () => {
  	//this.props.finishDay(this.prop.tickets);
    var self = this;
    _.forEach(this.props.tickets, function(ticket) {
      console.log(ticket);
      self.props.uploadTicket(ticket);
    })
  }

  CreateTable = () => {
    const { tickets } = this.props;
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
      
      segments.push(<li style={liStyle} className={style.ticket}>{ticket.name}  <label>{TimeHelper.FormatTime(ticket.duration)}</label></li>);
    }
    return segments;
  }

  render() {
    return (
      <span>
      <button className={style.finishDay} onClick={this.handleOnClick} disabled={!this.props.ticketCount != 0}>Finish Day</button>
      <Modal
          isOpen={this.state.modalOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
        >
        <h2>Finish Day</h2>
        <ul>
          {this.CreateTable()}
        </ul>
        <div className={style.buttons}>
          <button onClick={this.handleOnSubmit} className={style.submit}>Submit</button>
          <button onClick={this.closeModal}>Close</button>
        </div>
        </Modal>
      </span>
    );
  }
}
