import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import CurrentTicket from '../components/CurrentTicket';
import TicketList from '../components/TicketList';
import ChangeTicket from '../components/ChangeTicket';
import ProgressBar from '../components/ProgressBar';
import FinishDay from '../components/FinishDay';
import Modal from '../components/Modal';
import * as TicketTypes from '../constants/TicketTypes';
import * as TicketActions from '../actions/tickets';
import style from './App.css';

@connect(
  state => ({
    tickets: state.tickets
  }),
  dispatch => ({
    actions: bindActionCreators(TicketActions, dispatch)
  })
)
export default class App extends Component {

  static propTypes = {
    tickets: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { tickets, actions } = this.props;
    return (
      <div className={style.progress}>
        <h1>TimeTracker</h1>
        <CurrentTicket ticket={tickets.find(function (element) { return element.completed == false})} incrementTime={actions.incrementTime}/>
        <ProgressBar tickets={tickets} />
        <ChangeTicket actions={actions} ticketType={TicketTypes.TICKET} text="Change to this Ticket"  />
        <div className={style.inlineButtons}>
          <ChangeTicket actions={actions} ticketType={TicketTypes.MEETING}/>
          <ChangeTicket actions={actions} ticketType={TicketTypes.BREAK} />
        </div>
        <FinishDay finishDay={actions.FinishDay} ticketCount={tickets.length}/>
        <TicketList tickets={tickets} />
        <Modal />
      </div>
    );
  }
}
