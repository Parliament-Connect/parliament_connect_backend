import pool from "../config/db/database.js";
import pq from "./parliament_connect/pq.db.js";
import ministry from "./parliament_connect/ministry.db.js";
import mp from "./parliament_connect/mp.db.js";
import parliamentManger from "./parliament_connect/parliament.manager.js";

const models = {
	pq: new pq(pool),
	ministry: new ministry(pool),
	mp: new mp(pool),
	parliamentManager: new parliamentManger(pool),
};

export default models;