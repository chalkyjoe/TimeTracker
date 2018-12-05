import * as Config from './Config.js';
import moment from 'moment';

export function LogWork(ticket)
{
	var json = {
		'started': moment(ticket.timeStarted, 'X').format('YYYY-MM-DDT00:00:00.00+0000'),
  		'timeSpentSeconds': ticket.duration
	};

	GenericFetch(`issue/${ticket.name}/worklog`, json, 'POST').then(function(response) {
      console.log(response);
    });
}

function GenericFetch(endpoint, json, method, callback)
{
	var tok = Config.getUsername() + ':' + Config.getAccessCode();
  	var hash = btoa(tok);
	return fetch(`${Config.getBaseUrl()}/rest/api/3/${endpoint}`, {
	  method,
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization': 'Basic ' + hash,
	    'Origin': ''
	  },
	  body: JSON.stringify(json)
	})
}