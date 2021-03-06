import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import style from './ChangeTicket.css';
import * as TicketTypeConfig from '../utils/TicketTypeConfig';
import moment from 'moment';

export default class ChangeTicket extends Component {

  static propTypes = {
    actions:  PropTypes.object.isRequired,
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
  }
  componentDidMount() {
    this.setCanChange();
  }
  
  handleOnClick = () => {
    this.ticketConfigProvider.onClick(this.props.actions, this.state, this.props);
  }

  setCanChange = () =>
  {
    var self = this;
    this.ticketConfigProvider.setIsEnabled(this.props.ticketType, function(response) {
      self.setState(response);
    })
  }

  render() {
    return (
        <button className={style[this.props.ticketType]} onClick={this.handleOnClick} disabled={!this.state.canChange}>{this.ticketConfigProvider.text}</button>
    );
  }
}
