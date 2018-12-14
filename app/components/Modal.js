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
      open: false
    };
  }
  closeModal = () => {
    this.setState(open: false);
  }
  render() {
    return (
      <div className={this.state.open ? style.modalBackground : style.modalClosed}>
        <div className={style.modal}>
          <div className={style.closeButton}>Close</div>
          <h2>Complete Ticket</h2>
          <p><input type="checkbox" /><label>Move to Dev Complete?</label></p>
          <p><label>Duration</label> <input className={style.durationInput}/></p>
          <button>Submit</button>
        </div>
      </div>
    );
  }
}
