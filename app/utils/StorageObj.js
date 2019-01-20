export function get(store) {
	return new Promise(resolve => {
		chrome.storage.sync.get(store, items => {
			resolve(items);
		});
	})
}

export function set(store) {
	return new Promise(resolve => {
		chrome.storage.sync.set(store, items => {
			resolve();
		});
	})
}
