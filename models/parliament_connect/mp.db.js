import ParliamentManager from "./parliament.manager.js";

class MpDb {
	constructor(pool) {
		this.db = pool;
		this.availableAttributes = {
			mp_id: "=",
			name: "ILIKE",
			ismp: "=",
			constituency: "ILIKE",
			party_name: "=",
			sabha: "=",
			sabha_version: "=",
		};
	}

	// get mp by selected attributes
	async getMpsByAttributes(attributes) {
		let query = `SELECT * FROM mp WHERE`;
		let values = [];
		let i = 1;
		for (let key in attributes) {
			if (this.availableAttributes[key]) {
				query += ` ${key} ${this.availableAttributes[key]} $${i} AND`;
				values.push(attributes[key]);
				i++;
			}
		}
		query = query.slice(0, -4);
		return await this.db.query(query, values);
	}

	// create MP record in db
	async createMp(
		mp_id,
		name,
		ismp,
		party_name,
		sabha,
		version,
		constituency,
		created_at
	) {
		try {
			const parliament_manager = new ParliamentManager(this.db);
			const sabhaCheck = await parliament_manager.checkIfVersionExists(
				sabha,
				version
			);
			if (!sabhaCheck) {
				return {
					status: "error",
					message: "Sabha version does not exist",
				};
			}
			const res = await this.db.query(
				`INSERT INTO mp (mp_id, name, isMp, party_name, sabha, sabha_version, constituency, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
				[
					mp_id,
					name,
					ismp,
					party_name,
					sabha,
					version,
					constituency,
					new Date(created_at),
				]
			);
			return {
				// if all is good, returns success message with mp data
				status: "success",
				message: "MP created",
				result: res.rows,
			};
		} catch (err) {
			return {
				// if error, returns error message
				status: "Internal server error",
				message: err.message,
			};
		}
	}

	// delete an MP by mp_id
	async deleteMp(id) {
		try {
			const res = await this.db.query(
				`DELETE FROM mp WHERE mp_id = $1 RETURNING *`,
				[id]
			);
			return {
				status: "success",
				message: "MP deleted",
				result: res.rows,
			};
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	// update an MP by mp_id
	async updateMp(mpID, name, isMp, party, sabha, version, constituency) {
		try {
			const res = await this.db.query(
				`UPDATE mp SET name = $1, isMp = $2, party = $3, sabha_name = $4, sabha_version = $5, constituency = $6 WHERE mp_id = $7 RETURNING *`,
				[name, isMp, party, sabha, version, constituency, mpID]
			);
			return {
				// if all is good, returns success message with mp data
				status: "success",
				message: "MP updated",
				result: res.rows,
			};
		} catch (err) {
			return {
				// if error, returns error message
				status: "Internal server error",
				message: err.message,
			};
		}
	}

	// update mp record by mp_id with selected attributes
	async updateMpByAttributes(mpID, attributes) {
		let query = `UPDATE mp SET`;
		let values = [];
		let i = 1;
		for (let key in attributes) {
			if (this.availableAttributes[key]) {
				query += ` ${key} = $${i},`;
				values.push(attributes[key]);
				i++;
			}
		}
		query = query.slice(0, -1);
		query += ` WHERE mp_id = $${i} RETURNING *`;
		values.push(mpID);
		try {
			const res = await this.db.query(query, values);
			return {
				// if all is good, returns success message with mp data
				status: "success",
				message: "MP updated",
				result: res.rows,
			};
		} catch (err) {
			return {
				// if error, returns error message
				status: "Internal server error",
				message: err.message,
			};
		}
	}

	// Get mp record by mp_id
	async getMpById(id) {
		try {
			const res = await this.db.query(
				`SELECT * FROM mp WHERE mp_id = $1`,
				[id]
			);
			if (res.rows.length === 0) {
				// if no record found, returns error message
				return {
					status: "error",
					message: "MP not found",
				};
			}
			return {
				// if all is good, returns success message with mp data
				status: "success",
				message: "MP found",
				result: res.rows[0],
			};
		} catch (err) {
			return {
				// if error, returns error message
				status: "error",
				message: err.message,
			};
		}
	}

	// Get all mp records
	async getAllMps() {
		try {
			const res = await this.db.query(`SELECT * FROM mp`);
			if (res.rows.length === 0) {
				// if no record found, returns error message
				return {
					status: "error",
					message: "No MP found",
				};
			}
			return {
				status: "success",
				message: "MPs found",
				result: res.rows,
			};
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	async getAllMpNames() {
		try {
			const res = await this.db.query(
				`SELECT name, mp_id FROM mp WHERE isMp = true`
			);
			if (res.rows.length === 0) {
				// if no record found, returns error message
				return {
					status: "error",
					message: "No MP found",
				};
			}
			return {
				status: "success",
				message: "MPs found",
				result: res.rows,
			};
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	// get mp by party name
	async getMpsByParty(party) {
		return await this.db.query(`SELECT * FROM mp WHERE party = $1`, [
			party,
		]);
	}

	// search mp by constituency
	async searchMpsByConstituency(constituency) {
		return await this.db.query(
			`SELECT * FROM mp WHERE constituency ILIKE $1`,
			[constituency]
		);
	}

	async searchMpsByConstituencyAndParty(constituency, party) {
		return await this.db.query(
			`SELECT * FROM mp WHERE constituency ILIKE $1 AND party = $2`,
			[constituency, party]
		);
	}

	async getMpsFromDate(date) {
		return await this.db.query(`SELECT * FROM mp WHERE createdAt >= $1`, [
			date,
		]);
	}

	async getMpsBySabha(sabha) {
		return await this.db.query(`SELECT * FROM mp WHERE sabha = $1`, [
			sabha,
		]);
	}

	async getMpsBySabhaAndParty(sabha, party) {
		return await this.db.query(
			`SELECT * FROM mp WHERE sabha = $1 AND party = $2`,
			[sabha, party]
		);
	}

	async getMpsBySabhaAndVersion(sabha, version) {
		return await this.db.query(
			`SELECT * FROM mp WHERE sabha = $1 AND version = $2`,
			[sabha, version]
		);
	}

	async getMpsBySabhaAndVersionAndParty(sabha, version, party) {
		return await this.db.query(
			`SELECT * FROM mp WHERE sabha = $1 AND version = $2 AND party = $3`,
			[sabha, version, party]
		);
	}
}

export default MpDb;
