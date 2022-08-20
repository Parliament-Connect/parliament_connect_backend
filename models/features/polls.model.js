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
			options: {
				type: DataTypes.JSONB,
				field: "options",
				allowNull: false,
			},
			posted_by: {
				type: DataTypes.UUID,
				field: "posted_by",
				allowNull: false,
				references: {
					model: "parliament_auth",
					referencesKey: "id",
				},
			},
		},
		{
			tableName: "polls",
		}
	);
};
