export default (sequelize, DataTypes) => {
	return sequelize.define(
		"parliament_auth",
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
			},
			password: {
				type: DataTypes.STRING,
				field: "password",
				allowNull: false,
			},
			roles: {
				type: DataTypes.ARRAY(DataTypes.STRING),
				field: "roles",
				allowNull: false,
			},
			ref_id: {
				type: DataTypes.STRING,
				field: "ref_id",
				allowNull: false,
			},
		},
		{
			tableName: "parliament_auth",
		}
	);
};
