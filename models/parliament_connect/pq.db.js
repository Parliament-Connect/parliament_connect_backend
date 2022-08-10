class parliamentQuestions {
	constructor(pool) {
		this.db = pool;
	}

	// create a new parliament question
	async createQuestion(question, sabha, version, asked_by, asked_to) {
		console.log(sabha, version);
		const query = `
			INSERT INTO parliament_questions (
				question,
				sabha,
				version,
				askedby,
				askedto
			) values (
				$1,
				$2,
				$3,
				$4,
				$5
			) RETURNING *
		`;
		try {
			const res = await this.db.query(query, [
				question,
				sabha,
				version,
				asked_by,
				asked_to,
			]);
			return {
				// if the query is successful, return the data
				status: "success",
				message: "Question uploaded successfully",
				data: res.rows,
			};
		} catch (err) {
			return {
				// if the query is unsuccessful, return the error
				status: "error",
				message: err.message,
			};
		}
	}

	// get all the parliament questions with given sabha and version
	// In practical scenario, the sabha and version will be known while answering a question
	async answerQuestion(qid, answer, sabha, version) {
		const query = `
			UPDATE
				${sabha}_${version}
			SET
				answer = $1
			WHERE
				qid = $2
			RETURNING *
		`;
		try {
			const { rows } = await this.db.query(query, [answer, qid]);
			if (rows.length === 0) {
				// the question id does not exist
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if the query is successful, return the data
				status: "success",
				message: "Answer uploaded successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if the query is unsuccessful, return the error
				status: "error",
				message: err.message,
			};
		}
	}

	// fetch a question with its qid
	async getQuestionById(question_id) {
		const query = `
			SELECT
				*
			FROM
				parliament_questions
			WHERE
				qid = $1
		`;
		try {
			const { rows } = await this.db.query(query, [question_id]);
			if (rows.length === 0) {
				// if no question found, return an error
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Question fetched successfully",
				data: rows,
			};
		} catch (err) {
			// if an error occurs, return an error
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	async getRecentQuestions() {
		const currentSabha = await this.db.query(
			`SELECT * FROM current_sabha_version`
		);
		const lok_sabha = currentSabha.rows[0].lok_sabha;
		const rajya_sabha = currentSabha.rows[0].rajya_sabha;
		const query = `
						SELECT * 
						FROM 
							lok_sabha_${lok_sabha} 
						UNION 
						SELECT * 
						FROM 
							rajya_sabha_${rajya_sabha} 
						ORDER BY 
							asked_at DESC 
						LIMIT 
							10`;

		try {
			const result = await this.db.query(query);
			if (result.rows.length === 0) {
				// if no question found, return an error
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Question fetched successfully",
				data: result.rows,
			};
		} catch (err) {
			return {
				// if an error occurs, return an error
				status: "error",
				message: err.message,
			};
		}
	}

	async getQuestionsByQuery(query) {
		const currentSabha = await this.db.query(
			`SELECT * FROM current_sabha_version`
		);
		const lok_sabha = currentSabha.rows[0].lok_sabha;
		const rajya_sabha = currentSabha.rows[0].rajya_sabha;
		const query_string = `
						SELECT * 
						FROM 
							lok_sabha_${lok_sabha} 
						UNION 
						SELECT * 
						FROM 
							rajya_sabha_${rajya_sabha} 
						WHERE 
							question ILIKE '%${query}%' 
						ORDER BY 
							asked_at DESC 
						LIMIT 
							10`;

		try {
			const result = await this.db.query(query_string);
			if (result.rows.length === 0) {
				// if no question found, return an error
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Question fetched successfully",
				data: result.rows,
			};
		} catch (err) {
			return {
				// if an error occurs, return an error
				status: "error",
				message: err.message,
			};
		}
	}

	// get all the questions asked in a particular sabha given version
	// NOTE: The older questions in a sabha version are accessed less frequently
	async getQuestionByIdAndSabhaVersion(qid, sabha, version) {
		const query = `SELECT 
							* 
						FROM 
							${sabha}_${version}
						WHERE
							qid = ${qid}
						ORDER BY
							asked_at DESC
					`;
		try {
			const { rows } = await this.db.query(query);
			if (rows.length === 0) {
				// if no question found, return an error
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Question fetched successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if an error occurs, return an error
				status: "error",
				message: err.message,
			};
		}
	}

	// update a question with all the given details
	async updateQuestion(qid, question, asked_by, asked_to) {
		const query = `
			UPDATE
				parliament_questions
			SET
				question = $1,
				askedBy = $2,
				askedTo = $3
			WHERE
				qid = $4
			RETURNING *
		`;
		try {
			const { rows } = await this.db.query(query, [
				question,
				asked_by,
				asked_to,
				qid,
			]);
			return {
				// if the query is successful, return the data
				status: "success",
				message: "Question updated successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if the query is unsuccessful, return the error
				status: "error",
				message: err.message,
			};
		}
	}

	// delete a question given the qid
	// NOTE: less frequently used
	async deleteQuestion(qid) {
		const query = `
			DELETE FROM
				parliament_questions
			WHERE
				qid = $1
			RETURNING *
		`;
		try {
			const { rows } = await this.db.query(query, [qid]);
			return {
				// if the query is successful, return the data
				status: "success",
				message: "Question deleted successfully",
				data: rows,
			};
		} catch (err) {
			// if the query is unsuccessful, return the error
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	// get all the questions asked in a particular sabha
	// NOTE: The older the sabha version lesser it is accessed
	// practically the query performance will not be good
	async getQuestionsBySabha(sabha) {
		const query = `SELECT 
							* 
						FROM 
							$1
						ORDER BY
							asked_at DESC`;
		try {
			const { rows } = await this.db.query(query, [sabha]);
			if (rows.length === 0) {
				// the sabha does not exist
				return {
					status: "error",
					message: "Sabha not found",
				};
			}
			return {
				// if the query is successful, return the data
				status: "success",
				message: "Questions fetched successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if the query is unsuccessful, return the error
				status: "error",
				message: err.message,
			};
		}
	}

	async getQuestionsBySabhaAndVersion(sabha, version) {
		const query = `SELECT 
							* 
						FROM 
							${sabha}_${version}
						ORDER BY
							date_asked DESC
					`;
		try {
			const { rows } = await this.db.query(query);

			if (rows.length === 0) {
				// the sabha and version does not exist
				return {
					status: "error",
					message: "No questions found",
				};
			}
			return {
				// if the query is successful, return the data
				status: "success",
				message: "Questions fetched successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if the query is unsuccessful, return the error
				status: "error",
				message: err.message,
			};
		}
	}

	// fetch all questions from the database
	async getAllQuestions() {
		const query = `
            SELECT
                *
            FROM
                parliament_questions
            ORDER BY
                date_asked DESC
        `;
		try {
			const { rows } = await this.db.query(query);
			if (rows.length === 0) {
				// if no questions are found, return an error
				return {
					status: "error",
					message: "No questions uploaded yet",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Questions fetched successfully",
				data: rows,
			};
		} catch (err) {
			// if an error occurs, return an error
			return {
				status: "error",
				message: err.message,
			};
		}
	}

	async getQuestionByMpId(mp_id) {
		const query = `SELECT 
							* 
						FROM 
							parliament_questions 
						WHERE 
							askedBy = $1`;
		try {
			const { rows } = await this.db.query(query, [mp_id]);
			if (rows.length === 0) {
				// if no question found, return an error
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Question fetched successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if an error occurs, return an error
				status: "error",
				message: err.message,
			};
		}
	}

	async getQuestionsByMinistryId(ministry_id) {
		const query = `SELECT 
							* 
						FROM 
							parliament_questions 
						WHERE 
							askedTo = $1
						ORDER BY
							asked_at DESC `;
		try {
			const { rows } = await this.db.query(query, [ministry_id]);
			if (rows.length === 0) {
				// if no question found, return an error
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Questions fetched successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if an error occurs, return an error
				status: "error",
				message: err.message,
			};
		}
	}

	async getQuestionsByMinistryIdAndMpId(ministry_id, mp_id) {
		const query = `SELECT 
							* 
						FROM 
							parliament_questions 
						WHERE 
							askedTo = $1 AND askedBy = $2`;
		try {
			const { rows } = await this.db.query(query, [ministry_id, mp_id]);
			if (rows.length === 0) {
				// if no question found, return an error
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Questions fetched successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if an error occurs, return an error
				status: "error",
				message: err.message,
			};
		}
	}

	async getQuestionsByParty(party) {
		const query = `SELECT 
							A.* 
						FROM 
							parliament_questions A
						INNER JOIN
							mp B
						ON
							A.askedBy = B.mp_id  
						WHERE 
							B.party = $2`;
		try {
			const { rows } = await this.db.query(query, [party]);
			if (rows.length === 0) {
				// if no question found, return an error
				return {
					status: "error",
					message: "Question not found",
				};
			}
			return {
				// if questions are found, return them
				status: "success",
				message: "Questions fetched successfully",
				data: rows,
			};
		} catch (err) {
			return {
				// if an error occurs, return an error
				status: "error",
				message: err.message,
			};
		}
	}
}

export default parliamentQuestions;
