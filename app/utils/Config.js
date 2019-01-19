import * as TimeHelper from './TimeHelper.js';

export function getBaseUrl() {
	return getConfig('baseURL', 'udgroup.atlassian.net');
}

export function getDayLength(callback) {
	return getConfig('dayLength', '8h');
}

export function getUsername(callback) {
	return getConfig('username', null);
}

export function getAccessCode() {
	return getConfig('accessCode', 'cWiizHyZbT5soPoujv9GCB3C');
}

export function getMeetingTicketNo() {
	return getConfig('meetingTicketNo', 'UDGINT1-6');
}
export function getToken() {
	return new Promise(resolve => {
		chrome.storage.sync.get({username: null, accessCode: null}, items => {
			resolve(items.username + ':' + items.accessCode);
		});
	})
}

function getConfig(name, defaultValue)
{
	return new Promise(resolve => {
		var params = {};
		params[name] = defaultValue;
		chrome.storage.sync.get(params, items => {
			resolve(items[name]);
		});
	})
}