import * as TicketTypes from '../constants/TicketTypes';

export const Colours = [
'#FB6542',
'#375E97',
'#FFBB00',
'#3F681C'
]

export function GetTicketColour(id) {
	return Colours[id%Colours.length];
}