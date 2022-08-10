const objectIsEmpty = (obj) => {
	for (var i in obj) return false;
	return true;
};

// Find missing params from body
const findMissing = (obj) => {
	let missing = {};
	for (let key in obj) {
		if (!obj[key]) {
			missing[key] = key + " is required";
		}
	}
	return missing;
};

// Filtering object by non-empty keys
const filterNonEmpty = (obj) => {
	let filtered = {};
	for (let key in obj) {
		if (obj[key]) {
			filtered[key] = obj[key];
		}
	}
	return filtered;
};

export default { objectIsEmpty, findMissing, filterNonEmpty };
