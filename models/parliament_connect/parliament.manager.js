class parliamentManager {
	constructor(pool) {
		this.db = pool;
	}

	// Check if a sabha version exists
	async checkIfVersionExists(sabha, version) {
		const query = `
						SELECT 
							table_name
						FROM 
							information_schema.tables
						WHERE 
							table_schema = 'public' 
								and
							table_name = '${sabha}_${version}'
					`;
		const res = await this.db.query(query);
		if (res.rows.length === 0) {
			// if the table does not exist
			return false;
		} else if (res.rows[0].table_name === `${sabha}_${version}`) {
			return true;
		}
		return false;
	}

	// validating sabha name
	static _validateSabhaName(sabha) {
		const table = sabha.toUpperCase().includes("LOK")
			? "lok_sabha"
			: sabha.toUpperCase().includes("RAJYA")
			? "rajya_sabha"
			: "";

		if (!table) {
			throw new Error("Sabha not found");
		}
		return table;
	}

	// creating new partition for a new sabha version withing the respective sabha partition
	// Main Table - Parliament Questions
	// Level 1    - Sabha (lok_sabha | rajya_sabha)
	// Level 2    - Sabha (lok_sabha | rajya_sabha) + Version (1 | 2 | 3 | ...)
	async createNewSabhaVersion(sabha, version) {
		const table = parliamentManager._validateSabhaName(sabha);

		try {
			const query = `
                CREATE TABLE 
                    ${table}_${version} 
                PARTITION OF
                    ${table}
                FOR VALUES IN (${version});
            `;
			const res = await this.db.query(query);
			return {
				// return success message if the table partition is created
				status: "success",
				message: "Sabha version created",
				result: res.rows,
			};
		} catch (error) {
			// if any error occurs return error message
			return {
				status: "error",
				message: "Internal server error",
				error: error.message,
			};
		}
	}

	// setting the current sabha version in parliament.current_sabha_version
	async setCurrentSabhaVersion(sabha, version) {
		// sabha name should be either lok_sabha or rajya_sabha
		const column = parliamentManager._validateSabhaName(sabha);

		try {
			// check if the sabha version exists
			if (await this.checkIfVersionExists(column, version)) {
				const query = `
					UPDATE 
						public.current_sabha_version
					SET
						${column} = ${version};
				`;
				const res = await this.db.query(query);
				return {
					// return the current sabha version and success message
					status: "success",
					message: "Sabha version set",
					result: res.rows,
				};
			} else {
				// if the sabha version does not exist
				return {
					// return error message
					status: "error",
					message: "Sabha version does not exist",
					result: null,
				};
			}
		} catch (error) {
			// if any error occurs
			return {
				status: "error",
				message: "Internal server error",
				error: error.message,
			};
		}
	}

	// getting the current sabha version from parliament.current_sabha_version
	async getCurrentSabhaVersion() {
		try {
			const query = `
				SELECT 
					lok_sabha,
					rajya_sabha
				FROM 
					public.current_sabha_version;
			`;
			const res = await this.db.query(query);
			return {
				// return the current sabha version and success message
				status: "success",
				message: "Current sabha version retrieved",
				result: res.rows,
			};
		} catch (error) {
			// if any error occurs return error message
			return {
				status: "error",
				message: "Internal server error",
				error: error.message,
			};
		}
	}

	// deleting the sabha version from the respective sabha partition
	async deleteSabhaVersion(sabha, version) {
		const table = parliamentManager._validateSabhaName(sabha);

		try {
			const query = `
                DROP TABLE
                    ${table}_${version};
            `;
			const res = await this.db.query(query);
			return {
				//	return success message if the table partition is deleted
				status: "success",
				message: "Sabha version deleted",
				result: res.rows,
			};
		} catch (error) {
			return {
				// if any error occurs return error message
				status: "error",
				message: "Internal server error",
				error: error.message,
			};
		}
	}
}

export default parliamentManager;
