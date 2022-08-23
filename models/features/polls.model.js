import models from "../admin.js";

export default (sequelize, DataTypes) => {
	return sequelize.define(
		"polls",
		{
			id: {
				type: DataTypes.UUID,
				field: "id",
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			question: {
				type: DataTypes.TEXT,
				field: "question",
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				field: "description",
				allowNull: false,
			},
			options: {
				type: DataTypes.JSONB,
				field: "options",
				allowNull: false,
			},
			expiryDate: {
				type: DataTypes.DATE,
				field: "expiry_date",
				allowNull: false,
			},
			expiryTime: {
				type: DataTypes.TIME,
				field: "expiry_time",
				allowNull: false,
			},
		},
		{
			tableName: "polls",
		}
	);
};
