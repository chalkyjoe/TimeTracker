import * as TicketTypes from '../constants/TicketTypes';
import * as Config from './Config';
import * as ColourStore from '../utils/ColourStorage';

export function getTicketTypeConfig(ticketType) {
	switch(ticketType)
	{
		case TicketTypes.TICKET:
			var ticketColour = function(ticketID) { return ColourStore.GetTicketColour(ticketID) };
			return {
				buttonColour: '#006644',
				text: 'Change Ticket',
				setIsEnabled: function(type, callback) {
				    if (ticketType != TicketTypes.TICKET) return true;
				    chrome.tabs.query({'active': true}, function (tabs) {
				      var url = tabs[0].url;
				      var baseUrl = Config.getBaseUrl() + '/browse/';
				      var ticketNo = url.replace(baseUrl, '');
				      callback({
				      	canChange: url.includes(baseUrl),
				      	ticketNo
				      });
				    });
				},
				onClick: function(actions, state, props) {
					actions.completeCurrentTicket();
	    			actions.addTicket(state.ticketNo, ticketColour);
				}
			}
			break;
		case TicketTypes.BREAK:
			return {
				buttonColour: '#FD6A02',
				text: 'Start Break',
				setIsEnabled: function(type, callback) {
					callback({
				      	canChange: true,
				      	ticketNo: 'Break'
				      });
				},
				onClick: function(actions, state, props) {
					actions.completeCurrentTicket();
	    			actions.addTicket(state.ticketNo, function() { return 'repeating-linear-gradient(-45deg,#ff0012,#ff0012 10px,#B3000C 10px,#B3000C 20px)' });
				}
			}
			break;
		case TicketTypes.MEETING:
			return {
			buttonColour: '#FD6A02',
			text: 'Start Meeting',
			setIsEnabled: function(type, callback) {
				return callback({
				      	canChange: true,
				      	ticketNo: 'UDGINT-11'
				      });;
			},
			onClick: function(actions, state, props) {
				actions.completeCurrentTicket();
    			actions.addTicket(state.ticketNo, function() { return 'repeating-linear-gradient(-45deg,#606dbc,#606dbc 10px,#465298 10px,#465298 20px)' });
			}
		}
	}
}