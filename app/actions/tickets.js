import * as types from '../constants/ActionTypes';

export function incrementTime(id, dayLength)
{
	return { type: types.INCREMENT_TIME, id, dayLength };
}

export function addTicket(name, colour, summary, ticketType) {
	return { type: types.ADD_TICKET, name, colour, summary, ticketType };
}

export function deleteTicket(ticket, merge) {
	return { type: types.DELETE_TICKET, ticket, merge };
}

export function editTicket(ticket, time, merge) {
	return { type: types.EDIT_TICKET, ticket, time, merge };
}
export function completeCurrentTicket() {
	return { type: types.COMPLETE_TICKET };
}
export function FinishDay() {
	return { type: types.FINISH_DAY };
}

export function UploadTicket(ticket, success) {
	return { type: types.UPLOAD_TICKET, ticket, success };
}

export function updateProgress(dayLength) {
	return { type: types.UPDATE_PROGRESS, dayLength };
}