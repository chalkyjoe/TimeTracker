import * as types from '../constants/ActionTypes';

export function incrementTime(id)
{
 return { type: types.INCREMENT_TIME, id };
}

export function addTicket(name) {
  return { type: types.ADD_TICKET, name };
}

export function deleteTicket(id) {
  return { type: types.DELETE_TICKET, id };
}

export function editTicket(id, time) {
  return { type: types.EDIT_TICKET, id, time };
}