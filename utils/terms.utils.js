// Sabha name validation
/*
 * Helper function to validate sabha name
 * @param {string} house - house/sabha name]
 * @return {boolean|string} - <formatted> if valid, false if invalid
 * validity is determined by the following:
 * - if the house name contains "lok" or "rajya" - case-insensitive
 * */
const isValidHouseName = (house) => {
	const House = house.toLowerCase();
	const tableName = House.includes("lok")
		? "lok_sabha"
		: House.includes("rajya")
		? "rajya_sabha"
		: "";
	if (tableName === "") {
		return false;
	}
	return tableName;
};

export default { isValidHouseName };
