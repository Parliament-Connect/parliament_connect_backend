import { Sequelize } from "sequelize";
import direct_auth from "./parliament_auth/parliament_direct.model.js";
import polls from "./features/polls.model.js";
import posts from "./features/posts.model.js";
import adminConfig from "../config/auth/config.js";

const sequelize = new Sequelize(
	adminConfig.database,
	adminConfig.user,
	adminConfig.password,
	{
		host: adminConfig.host,
		port: adminConfig.port,
		dialect: "postgres",
		operatorsAliases: "0",
		logging: false,

		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

const models = {
	direct_auth: direct_auth(sequelize, Sequelize.DataTypes),
	polls: polls(sequelize, Sequelize.DataTypes),
	posts: posts(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
	if (models[modelName].associate) {
		models[modelName].associate(models);
	}
});

export default sequelize;
export { models };
