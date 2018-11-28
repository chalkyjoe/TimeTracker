import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import CurrentTicket from '../components/CurrentTicket';
import ChangeTicket from '../components/ChangeTicket';
import ProgressBar from '../components/ProgressBar';
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
        <CurrentTicket ticket={tickets[0]} incrementTime={actions.incrementTime} />
        <ChangeTicket addTicket={actions.addTicket} />
        <ProgressBar tickets={tickets} />
      </div>
    );
  }
}
