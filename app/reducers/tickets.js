import * as ActionTypes from '../constants/ActionTypes';
import * as TicketTypes from '../constants/TicketTypes';
import moment from 'moment';

const initialState = [{
  name: 'None Selected',
  completed: false,
  id: 0,
  timeStarted: 0,
  duration: 0,
  type: TicketTypes.NOT_SELECTED
}];

const actionsMap = {
  [ActionTypes.INCREMENT_TIME](state, action) {
    return state.map(ticket => 
      ticket.id === action.id ?
      Object.assign({}, ticket, { duration: moment().unix() - ticket.timeStarted }) :
      ticket)
  },
  [ActionTypes.ADD_TICKET](state, action) {
    return [{
      id: state.reduce((maxId, ticket) => Math.max(ticket.id, maxId), -1) + 1,
      completed: false,
      name: action.name,
      timeStarted: moment().unix(),
      duration: 0,
      type: TicketTypes.TICKET
    }, ...state];
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
  }
};

export default function tickets(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  if (!reduceFn) return state;
  return reduceFn(state, action);
}
