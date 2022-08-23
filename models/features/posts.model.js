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
			image_path: {
				type: DataTypes.TEXT,
				field: "image",
				allowNull: true,
			},
			tags: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				field: "tags",
				allowNull: true,
			},
			likes: {
				type: DataTypes.INTEGER,
				field: "likes",
				allowNull: false,
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
