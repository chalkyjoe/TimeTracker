import * as Config from './Config.js';
import moment from 'moment';

export function LogWork(ticket)
{
	var json = {
		'started': moment(ticket.timeStarted, 'X').format('YYYY-MM-DDT00:00:00.00+0000'),
  		'timeSpentSeconds': ticket.duration
	};
	console.log(json);
	return GenericFetch(`issue/${ticket.name}/worklog`, json, 'POST')
}

export function GetTicketDescription(name)
{
	return GenericFetch(`issue/${name}?fields=summary`, 'GET')
}

function GenericFetch(endpoint, json, method, callback)
{
	var tok = Config.getUsername() + ':' + Config.getAccessCode();
  	var hash = btoa(tok);
	return fetch(`http://localhost:8080/https://${Config.getBaseUrl()}/rest/api/3/${endpoint}`, {
	  method,
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization': 'Basic ' + hash,
	    'Origin': '',
	    'Access-Control-Allow-Origin': '*'
	  },
	  body: method == 'POST' ? JSON.stringify(json) : null
	})
}