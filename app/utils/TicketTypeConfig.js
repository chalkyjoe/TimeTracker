import * as TicketTypes from '../constants/TicketTypes';
import * as Config from './Config';
import * as ColourStore from '../utils/ColourStorage';
import * as TempoAPI from '../utils/TempoAPI';

export function getTicketTypeConfig(ticketType) {
	switch(ticketType)
	{

		case TicketTypes.TICKETNOASSIGN:
			var ticketColour = ticketID => { return ColourStore.GetTicketColour(ticketID) };
			return {
				buttonColour: '#006644',
				text: 'Change Ticket Without Assigning',
				setIsEnabled: TicketIsEnabled,
				onClick: function(actions, state, props) {
					actions.completeCurrentTicket();
	    			actions.addTicket(state.ticketNo, ticketColour, state.summary, ticketType);
				}
			}
			break;
		case TicketTypes.TICKET:
			var ticketColour = ticketID => { return ColourStore.GetTicketColour(ticketID) };
			return {
				buttonColour: '#006644',
				text: 'Change Ticket',
				setIsEnabled: TicketIsEnabled,
				onClick: function(actions, state, props) {
					actions.completeCurrentTicket();
	    			actions.addTicket(state.ticketNo, ticketColour, state.summary, ticketType);
	    			TempoAPI.AssignToSelf(state.ticketNo);
	    			TempoAPI.MoveToInDevelopment(state.ticketNo);
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
	    			actions.addTicket(state.ticketNo, function() { return '#ff0012' }, state.summary, ticketType );
				}
			}
			break;
		case TicketTypes.MEETING:
			return {
			buttonColour: '#FD6A02',
			text: 'Start Meeting',
			setIsEnabled: function(type, callback) {
				Config.getMeetingTicketNo().then(ticketNo => {
					return callback({
				      	canChange: true,
				      	ticketNo,
				      	summary: 'Meeting'
				    });
				})
			},
			onClick: function(actions, state, props) {
				actions.completeCurrentTicket();
    			actions.addTicket(state.ticketNo, function() { return '#606dbc' }, state.summary, ticketType);
			}
		}
	}
}

function TicketIsEnabled(type, callback)
{
	var ticketType = type;
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, tabs => {
    	Config.getBaseUrl().then(baseUrlConfig => {
    		var url = tabs[0].url.split('?')[0].split('#')[0];
		    var baseUrl = "https://" + baseUrlConfig + '/browse/';
		    var ticketNo = url.replace(baseUrl, '');
		    if (!url.includes(baseUrl)) return callback({ canChange: false });
		    TempoAPI.GetTicketDescription(ticketNo).then(response => {
		    	if (response == 201) return callback({ canChange: url.includes(baseUrl), ticketNo });
	    		return response.json();
		    }).then(res => {
		    	var canChange = true;
		    	if (ticketType == TicketTypes.TICKET && res.fields.issuetype.name == 'Epic')
		    	{
		    		canChange = false
		    	}
			    callback({
			      	canChange,
			      	ticketNo,
			      	summary: res.fields.summary
				});
			})
	    })
	});
}