import fs from 'node:fs'
import { Sequelize, Model, DataTypes } from '@sequelize/core'
import { SqliteDialect, OPEN_READWRITE, OPEN_CREATE } from '@sequelize/sqlite3'


if (!fs.existsSync("./db")) {
  fs.mkdirSync("./db");
}

const FILE_NAME = process.env.SQLITE3_FILE || "./db/bento.db"

const sequelize = new Sequelize({
  dialect: SqliteDialect,
  storage: FILE_NAME,
	mode: OPEN_READWRITE | OPEN_CREATE
})
class Notes extends Model {}
Notes.init(
	{
		notes_id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false
		},
		data: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastUpdated: {
			type: DataTypes.STRING,
			allowNull: false
		},
		created: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		delete: {
			type: DataTypes.BOOLEAN,
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: 'Notes'
	}
)
class Settings extends Model {}
Settings.init(
	{
		settings_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false
		},
		settings: {
			type: DataTypes.STRING,
			allowNull: false
		}
	},
	{
		sequelize,
		modelName: 'Settings'
	}
)
sequelize.sync({ force: false })