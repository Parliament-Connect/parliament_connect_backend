export default (sequelize, DataTypes) => {
	return sequelize.define(
		"posts",
		{
			id: {
				type: DataTypes.UUID,
				field: "id",
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			title: {
				type: DataTypes.STRING(100),
				field: "title",
				allowNull: false,
			},
			content: {
				type: DataTypes.TEXT,
				field: "content",
				allowNull: false,
			},
			likes: {
				type: DataTypes.INTEGER,
				field: "likes",
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
			instanceMethods: {
				like() {
					this.likes += 1;
					return this.save();
				},
				dislike() {
					this.likes -= 1;
					return this.save();
				},
			},
			tableName: "posts",
		}
	);
};
