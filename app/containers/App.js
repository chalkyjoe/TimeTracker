import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CurrentTicket from '../components/CurrentTicket';
import TicketListItem from '../components/TicketListItem';
import ChangeTicket from '../components/ChangeTicket';
import ProgressBar from '../components/ProgressBar';
import FinishDay from '../components/FinishDay';
import ThemePicker from '../components/ThemePicker';
import * as TicketTypes from '../constants/TicketTypes';
import * as TicketActions from '../actions/tickets';
import * as ThemeActions from '../actions/theme';
import style from './App.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import * as Config from '../utils/Config';
import * as TempoAPI from '../utils/TempoAPI';

@connect(
  state => ({
    tickets: state.tickets,
    theme: state.theme
  }),
  dispatch => ({
    actions: bindActionCreators({ ...TicketActions, ...ThemeActions }, dispatch)
  })
)
export default class App extends Component {
  static propTypes = {
    tickets: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    theme: PropTypes.string.isRequired
  };
  constructor(props, context) {
    super(props, context);
    
    Config.getDayLength().then(dayLength => {
      if (dayLength === undefined)
      {
        chrome.tabs.create({ url: '/options.html?firstTime=true' });
      }
    })
    chrome.browserAction.setBadgeText({
      'text': '' 
    });
  }
  componentDidMount() {
    document.body.classList.add(this.props.theme);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.theme !== this.props.theme) {
      document.body.classList.remove(prevProps.theme);
      document.body.classList.add(this.props.theme);
    }
  }
  CreateTicketList = (actions) => {
    const { tickets } = this.props;
    let segments = [];
    var percent = 0;
    for (let i = 0; i < tickets.length; i++) {
      segments.push(<TicketListItem key={'r' + i} ticket={tickets[i]} tickets={tickets} actions={actions} />);
    }
    return segments;
  }
  debug = () => {
    console.log(this.props.tickets);
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
    const { tickets, actions, theme } = this.props;
    return (
      <div className={style.progress}>
        <ThemePicker theme={theme} setTheme={actions.setTheme} />
        <h1 onClick={this.debug}>TimeTracker</h1>
        <CurrentTicket ticket={this.props.tickets.find(function (element) { return element.completed == false})} incrementTime={actions.incrementTime} updateProgress={actions.updateProgress}/>
        <ProgressBar tickets={tickets} />
        <ChangeTicket actions={actions} ticketType={TicketTypes.TICKET} text="Change to this Ticket"  />
        <ChangeTicket actions={actions} ticketType={TicketTypes.TICKETNOASSIGN} text="Change without assigning"  />
        <div className={style.inlineButtons}>
          <ChangeTicket actions={actions} ticketType={TicketTypes.MEETING}/>
          <ChangeTicket actions={actions} ticketType={TicketTypes.BREAK} />
        </div>
        <FinishDay uploadTicket={actions.UploadTicket} completeTicket={actions.completeTicket} finishDay={actions.FinishDay} tickets={tickets} />
        <div>
          <ul className={style.listContainer}>
            {this.CreateTicketList(actions)}
          </ul>
        </div>
      </div>
    );
  }
}
