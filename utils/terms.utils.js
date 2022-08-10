const isValidHouseName = (house) => {
	const House = house.toLowerCase();
	const tableName = House.includes("lok")
		? "lok_sabha"
		: House.includes("rajya")
		? "rajya_sabha"
		: "";
	if (tableName === "") {
		console.log("Invalid house");
		return false;
	}
	return tableName;
};

export default { isValidHouseName };
