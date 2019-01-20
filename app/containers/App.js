import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CurrentTicket from '../components/CurrentTicket';
import TicketListItem from '../components/TicketListItem';
import ChangeTicket from '../components/ChangeTicket';
import ProgressBar from '../components/ProgressBar';
import FinishDay from '../components/FinishDay';
import * as TicketTypes from '../constants/TicketTypes';
import * as TicketActions from '../actions/tickets';
import style from './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'

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
  CreateTicketList = (actions) => {
    const { tickets } = this.props;
    let segments = [];
    var percent = 0;
    for (let i = 0; i < tickets.length; i++) {
      segments.push(<TicketListItem ticket={tickets[i]} EditTicket={actions.editTicket} DeleteTicket={actions.deleteTicket} />);
    }
    return segments;
  }
  getCurrentTicket = () =>
  {
    return new Promise(resolve => {
      resolve(this.props.tickets.find(function (element) { return element.completed == false})); 
    }).then(res => {
      return res;
    });
  }
  render() {
    const { tickets, actions } = this.props;
    return (
      <div className={style.progress}>
        <h1>TimeTracker</h1>
        <CurrentTicket ticket={this.props.tickets.find(function (element) { return element.completed == false})} incrementTime={actions.incrementTime} updateProgress={actions.updateProgress}/>
        <ProgressBar tickets={tickets} />
        <ChangeTicket actions={actions} ticketType={TicketTypes.TICKET} text="Change to this Ticket"  />
        <div className={style.inlineButtons}>
          <ChangeTicket actions={actions} ticketType={TicketTypes.MEETING}/>
          <ChangeTicket actions={actions} ticketType={TicketTypes.BREAK} />
        </div>
        <FinishDay uploadTicket={actions.UploadTicket} completeTicket={actions.completeTicket} finishDay={actions.FinishDay} ticketCount={tickets.length} tickets={tickets} />
        <div style={{position: 'relative'}}>
          <ul className={style.listContainer}>
            {this.CreateTicketList(actions)}
          </ul>
        </div>
      </div>
    );
  }
}
