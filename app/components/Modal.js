import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './Modal.css';
import * as TicketTypes from '../constants/TicketTypes';
import * as TimeHelper from '../utils/TimeHelper';
import * as Config from '../utils/Config';
import * as TicketTypeConfig from '../utils/TicketTypeConfig';

export default class Modal extends Component {
  static propTypes = {

  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: this.props.open
    };
  }
  closeModal = () => {
    this.props.open = false;
  }
  render() {
    return (
      <div className={this.props.open ? style.modalBackground : style.modalClosed}>
        <div className={style.modal}>
          <div className={style.closeButton} onClick={this.closeModal()}>Close</div>
          {this.props.children}
        </div>
      </div>
    );
  }
}
