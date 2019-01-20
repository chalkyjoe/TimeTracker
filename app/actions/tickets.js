import * as types from '../constants/ActionTypes';

export function incrementTime(id, dayLength)
{
	return { type: types.INCREMENT_TIME, id, dayLength };
}

export function addTicket(name, colour, summary) {
	return { type: types.ADD_TICKET, name, colour, summary };
}

export function deleteTicket(id) {
	return { type: types.DELETE_TICKET, id };
}

export function editTicket(id, time) {
	return { type: types.EDIT_TICKET, id, time };
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