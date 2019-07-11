import * as Config from './Config.js';
import moment from 'moment';

export function LogWork(ticket)
{
	var json = {
		'started': moment(ticket.timeStarted, 'X').format('YYYY-MM-DDT00:00:00.00+0000'),
  		'timeSpentSeconds': ticket.duration
	};
	return GenericFetch(`issue/${ticket.name}/worklog`, json, 'POST')
}

export function GetTicketDescription(name)
{
	return GenericFetch(`issue/${name}?fields=summary,issuetype`, null, 'GET');
}

export function AssignToSelf(name)
{
	var json = {
		"accountId": "5b67f1c628214a29fb01c25a"
	};
	return GenericFetch(`issue/${name}/assignee`, json, 'PUT')
}

export function MoveToInDevelopment(name)
{
	var json = {
		'transition': {
				id: 41
		}
	};
	return GenericFetch(`issue/${name}/transitions`, json, 'POST')
}

export function GetSelf()
{
	return GenericFetch('myself', null, 'GET');
}

function GenericFetch(endpoint, json, method)
{
	return Config.getTempoInfo().then(items => {
		var hash = btoa(items.username + ':' + items.accessCode);
		return fetch(`http://${items.corsEverywhere}/https://${items.baseURL}/rest/api/3/${endpoint}`, {
		  method,
		  headers: {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Authorization': 'Basic ' + hash,
		    'Origin': '',
		    'Access-Control-Allow-Origin': '*'
		  },
		  body: method == 'POST' || method == 'PUT' ? JSON.stringify(json) : null
		});
	});
}