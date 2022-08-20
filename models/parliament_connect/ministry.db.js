import mp from "./mp.db.js";

class MinistryDb {
	constructor(db) {
		this.db = db;
		this.availableAttributes = {
			mid: "=",
			name: "ILIKE",
			minister: "ILIKE",
			mp_ref: "=",
			group: "=",
		};
	}

	// check if ministry exists
	async ministryExists(name, group) {
		const res = await this.db.query(
			`SELECT * FROM ministry WHERE name = $1 AND "group" = $2`,
			[name, group]
		);
		return res.rows.length > 0;
	}

	// create a new ministry without mp_ref of the minister
	async createMinistry(name, group, minister) {
		if (await this.ministryExists(name, group)) {
			return {
				status: "error",
				message: "Ministry already exists",
			};
		}

		try {
			const res = await this.db.query(
				`INSERT INTO ministry (name, "group", minister) VALUES ($1, $2, $3) RETURNING *`,
				[name, group, minister]
			);
			return {
				status: "success",
				message: "Ministry created",
				data: res.rows[0],
			};
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	// Create Ministry with mp_ref of the minister
	async createMinistryWithMp_ref(name, group, minister, mp_ref) {
		// check if ministry exists
		if (await this.ministryExists(name, group)) {
			return {
				status: "error",
				message: "Ministry already exists",
			};
		}
		try {
			// insert ministry query
			const res = await this.db.query(
				`INSERT INTO ministry (name, "group", minister, mp_ref) VALUES ($1, $2, $3, $4)`,
				[name, group, minister, mp_ref]
			);
			return {
				// return created ministry
				status: "success",
				message: "Ministry created",
			};
		} catch (err) {
			return {
				// if there's an error, return the error message
				status: "error",
				message: err.message,
			};
		}
	}

	// update ministry with all details
	async updateMinistry(mid, name, group, minister, mp_ref) {
		// check if ministry exists
		if (!(await this.ministryExists(name, group))) {
			return {
				status: "error",
				message: "Ministry does not exist",
			};
		}
		try {
			// update ministry query
			const res = await this.db.query(
				`UPDATE ministry SET name = $1, "group" = $2, minister = $3, mp_ref = $4 WHERE mid = $5`,
				[name, group, minister, mp_ref, mid]
			);
			return {
				// return updated ministry
				status: "success",
				message: "Ministry updated",
			};
		} catch (err) {
			// if there's an error, return the error message
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	// set mp_ref of the minister of the existing ministry
	async setMpRef(mid, mp_ref) {
		// check if ministry exists
		if ((await this.getMinistryById(mid)).status !== "success") {
			return {
				status: "error",
				message: "Ministry does not exist",
			};
		}

		// check if mp exists
		const mpManager = new mp(this.db);
		if ((await mpManager.getMpById(mp_ref)).status !== "success") {
			return {
				status: "error",
				message: "MP ID does not exist",
			};
		}

		try {
			const res = await this.db.query(
				`UPDATE ministry SET mp_ref = $1 WHERE mid = $2`,
				[mp_ref, mid]
			);
			return {
				status: "success",
				message: "Ministry updated",
			};
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	async deleteMinistryById(id) {
		try {
			const res = await this.db.query(
				`DELETE FROM ministry WHERE mid = $1 RETURNING *`,
				[id]
			);
			if (res.rowCount > 0) {
				return {
					status: "success",
					message: "Ministry deleted",
					data: res.rows,
				};
			}
			return {
				status: "error",
				message: "Ministry does not exist",
			};
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	async getMinistryById(id) {
		try {
			const res = await this.db.query(
				`SELECT * FROM ministry WHERE mid = $1`,
				[id]
			);
			if (res.rows.length > 0) {
				return {
					status: "success",
					message: res.rows[0],
				};
			}
			return {
				status: "error",
				message: "Ministry does not exist",
			};
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	async getAllMinistries() {
		try {
			const res = await this.db.query(`SELECT * FROM ministry`);
			if (res.rows.length > 0) {
				return {
					status: "success",
					message: res.rows,
				};
			} else {
				return {
					status: "error",
					message: "No ministries found",
				};
			}
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	async getAllMinistryNames() {
		try {
			const res = await this.db.query(
				`SELECT mid, name FROM ministry`
			);
			if (res.rows.length > 0) {
				return {
					status: "success",
					message: res.rows,
				};
			} else {
				return {
					status: "error",
					message: "No ministries found",
				};
			}
		} catch (err) {
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	async searchMinistryByName(name) {
		return await this.db.query(
			`SELECT * FROM ministry WHERE name ILIKE $1`,
			[name]
		);
	}

	async getMinistryByMpId(mp_id) {
		return await this.db.query(`SELECT * FROM ministry WHERE mp_ref = $1`, [
			mp_id,
		]);
	}

	async getMinisterInfo(mid) {
		return await this.db.query(
			`SELECT B.* FROM ministry A, mp B WHERE A.mp_ref = B.mp_id AND A.mid = $1`,
			[mid]
		);
	}

	async getMinistriesByGroup(group) {
		return await this.db.query(
			`SELECT * FROM ministry WHERE "group" = $1`,
			[group]
		);
	}
}

export default MinistryDb;
