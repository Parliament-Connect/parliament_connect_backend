export default (sequelize, DataTypes) => {
	return sequelize.define (
		"parliament_direct",
		{
			id: {
				type: DataTypes.UUID,
				field: "id",
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
				allowNull: false,
			},
			uname: {
				type: DataTypes.STRING,
				field: "uname",
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				field: "password",
				allowNull: false,
			},
		},
		{
			tableName: "parliament_direct",
		}
	);
};
