import * as ActionTypes from '../constants/ActionTypes';
import * as TicketTypes from '../constants/TicketTypes';
import * as Config from '../utils/Config';
import * as ColourStore from '../utils/ColourStorage';
import * as TimeHelper from '../utils/TimeHelper';
import * as TempoAPI from '../utils/TempoAPI';
import moment from 'moment';

const initialState = [];

const actionsMap = {
  [ActionTypes.INCREMENT_TIME](state, action) {
    var dayLength = Config.getDayLength();
    return state.map(ticket => 
      ticket.id === action.id ?
      Object.assign({}, ticket, {
        duration: moment().unix() - ticket.timeStarted,
        width: (ticket.duration / (TimeHelper.ParseTime(dayLength)/100))
      }) :
      ticket)
  },
  [ActionTypes.ADD_TICKET](state, action) {
    var id = state.reduce((maxId, ticket) => Math.max(ticket.id, maxId), -1) + 1;
    return [ ...state, {
      id,
      completed: false,
      name: action.name,
      timeStarted: moment().unix(),
      duration: 0,
      type: action.ticketType,
      colour: action.colour(state.length),
      width: 0
    }];
  },
  [ActionTypes.DELETE_TICKET](state, action) {
    return state.filter(ticket =>
      ticket.id !== action.id
    );
  },
  [ActionTypes.EDIT_TICKET](state, action) {
    return state.map(ticket =>
      (ticket.id === action.id ?
        Object.assign({}, ticket, { time: action.duration }) :
        ticket)
    ); 
  },
  [ActionTypes.COMPLETE_TICKET](state, action) {
    var currentTicket = state.find(function(ticket) { return ticket.completed === false; });
    if (currentTicket) TempoAPI.LogWork(currentTicket);
    return state.map(ticket =>
      (ticket.completed === false ?
        Object.assign({}, ticket, { completed: true }) :
        ticket)
    ); 
  },
  [ActionTypes.FINISH_DAY](state, action) {
    var currentTicket = state.find(function(ticket) { return ticket.completed === false; });
    if (currentTicket) TempoAPI.LogWork(currentTicket);
    return [];
  }
};

export default function tickets(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
