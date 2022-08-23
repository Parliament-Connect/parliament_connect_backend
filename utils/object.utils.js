/* check if object is empty
 * @param {Object} obj - Object to be checked
 * @return {boolean} - True if empty, false if not
 *
 * NOTE - This is the fastest way to check if an object is empty
 */
const objectIsEmpty = (obj) => {
	for (var i in obj) return false;
	return true;
};

// Find missing params from body
/*
 *  Find missing params from body
 * @param {Object} obj - Object to be filtered
 * @return {Object} - The missing params with their keys & msg
 * */
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
/* filter non-empty keys from object
 * @param {Object} obj - Object to be filtered
 * @return {Object} - Filtered object
 * */
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
