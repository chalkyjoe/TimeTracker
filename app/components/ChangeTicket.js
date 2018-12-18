import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './ChangeTicket.css';
import Modal from 'react-modal';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import * as Config from '../utils/Config';
import * as TicketTypeConfig from '../utils/TicketTypeConfig';

export default class ChangeTicket extends Component {

  static propTypes = {
    actions:  PropTypes.func.isRequired,
    ticketType: PropTypes.string.isRequired
  };
  constructor(props, context) {
    super(props, context);
    this.ticketConfigProvider = TicketTypeConfig.getTicketTypeConfig(this.props.ticketType);
    this.state = {
      canChange: true,
      ticketNo: '',
      modalOpen: false
    };
    this.setCanChange();

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalOpen: true});
    this.ticketConfigProvider.onClick(this.props.actions, this.state, this.props);
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
    this.ticketConfigProvider.onClick(this.props.actions, this.state, this.props);
  }

  setCanChange()
  {
    var self = this;
    this.ticketConfigProvider.setIsEnabled(this.props.ticketType, function(response) {
      self.state = response;
    })
  }

  render() {
    return (
      <span>
        <button className={style[this.props.ticketType]} onClick={this.openModal} disabled={!this.state.canChange}>{this.ticketConfigProvider.text}</button>
        <Modal
          isOpen={this.state.modalOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
        >

        </Modal>
      </span>
    );
  }
}
