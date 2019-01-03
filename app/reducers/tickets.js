import * as ActionTypes from '../constants/ActionTypes';
import * as TicketTypes from '../constants/TicketTypes';
import * as Config from '../utils/Config';
import * as ColourStore from '../utils/ColourStorage';
import * as TimeHelper from '../utils/TimeHelper';
import * as TempoAPI from '../utils/TempoAPI';
import moment from 'moment';
import _ from 'underscore';

const initialState = [];

const actionsMap = {
  [ActionTypes.INCREMENT_TIME](state, action) {
    var dayLength = Config.getDayLength();
    return state.map(ticket => 
      ticket.id === action.id ?
      Object.assign({}, ticket, {
        duration: moment().unix() - (ticket.timeResumed == 0 ? ticket.timeStarted : ticket.timeResumed) + ticket.durationSaved,
        width: (ticket.duration / (TimeHelper.ParseTime(dayLength)/100))
      }) :
      ticket)
  },
  [ActionTypes.ADD_TICKET](state, action) {
    var currentTicket = state.find(function(ticket) { return ticket.name === action.name; });
    if (currentTicket)
    {
      state = state.map(ticket =>
        (ticket.id === currentTicket.id ?
          Object.assign({}, ticket, { completed: false, timeResumed: moment().unix() }) :
          ticket)
      ); 
      return _.sortBy(state, 'completed');
    } else {
      var id = state.reduce((maxId, ticket) => Math.max(ticket.id, maxId), -1) + 1;
      return [ {
        id,
        completed: false,
        name: action.name,
        timeStarted: moment().unix(),
        timeResumed: 0,
        duration: 0,
        durationSaved: 0,
        type: action.ticketType,
        colour: action.colour(state.length),
        width: 0,
        uploaded: null
      }, ...state];
    }
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
    // var currentTicket = state.find(function(ticket) { return ticket.completed === false; });
    // if (currentTicket) TempoAPI.LogWork(currentTicket);
    return state.map(ticket =>
      (ticket.completed === false ?
        Object.assign({}, ticket, { completed: true, durationSaved: ticket.duration }) :
        ticket)
    ); 
  },
  [ActionTypes.FINISH_DAY](state, action) {
    var currentTicket = state.find(function(ticket) { return ticket.completed === false; });
    if (currentTicket) TempoAPI.LogWork(currentTicket);
    return [];
  },
  [ActionTypes.UPLOAD_TICKET](state, action) {
      TempoAPI.LogWork(action.ticket).then(function (response) {
        response = response.json()
        return state.map(ticket =>
          (ticket.id === action.id ?
            Object.assign({}, ticket, { uploaded: (response['id'] !== null), completed: true, durationSaved: ticket.duration }) :
            ticket)
        ); 
      });
  },
  [ActionTypes.RESUME_BREAK](state, action) {
    return state.map(ticket =>
      (ticket.id === action.id ?
        Object.assign({}, ticket, { completed: false }) :
        ticket)
    ); 
  }
};

export default function tickets(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
