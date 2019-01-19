import * as TicketTypes from '../constants/TicketTypes';
import * as Config from './Config';
import * as ColourStore from '../utils/ColourStorage';
import * as TempoAPI from '../utils/TempoAPI';

export function getTicketTypeConfig(ticketType) {
	switch(ticketType)
	{
		case TicketTypes.TICKET:
			var ticketColour = ticketID => { return ColourStore.GetTicketColour(ticketID) };
			return {
				buttonColour: '#006644',
				text: 'Change Ticket',
				setIsEnabled: (type, callback) => {
				    if (ticketType != TicketTypes.TICKET) return true;
				    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
					    var url = tabs[0].url.split('?')[0].split('#')[0];
					    var baseUrl = "https://" + Config.getBaseUrl() + '/browse/';
					    var ticketNo = url.replace(baseUrl, '');
					    if (!url.includes(baseUrl))
				    	{
				    		callback({ canChange: false });
				    		return;
				    	}
					    TempoAPI.GetTicketDescription(ticketNo).then(response => {
					    	if (response == 201) 
				    		{
				    			callback({ canChange: url.includes(baseUrl), ticketNo });
				    			return;
				    		}
					      	response.json().then(res => {
					          callback({
						      	canChange: url.includes(baseUrl),
						      	ticketNo,
						      	summary: res.fields.summary
						      });
					        })
					    })
				    });
				},
				onClick: function(actions, state, props) {
					actions.completeCurrentTicket();
	    			actions.addTicket(state.ticketNo, ticketColour, state.summary);
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
	    			actions.addTicket(state.ticketNo, function() { return 'repeating-linear-gradient(-45deg,#ff0012,#ff0012 10px,#B3000C 10px,#B3000C 20px)' }, state.summary );
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
				      	ticketNo: Config.getMeetingTicketNo(),
				      	summary: 'Meeting'
				      });
			},
			onClick: function(actions, state, props) {
				actions.completeCurrentTicket();
    			actions.addTicket(state.ticketNo, function() { return 'repeating-linear-gradient(-45deg,#606dbc,#606dbc 10px,#465298 10px,#465298 20px)' }, state.summary);
			}
		}
	}
}