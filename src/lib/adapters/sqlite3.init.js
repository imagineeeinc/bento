import { Sequelize, Model, DataTypes } from '@sequelize/core'
import { SqliteDialect, OPEN_READWRITE, OPEN_CREATE } from '@sequelize/sqlite3'

const FILE_NAME = process.env.SQLITE3_FILE || "./db/bento.db"

export const sequelize = new Sequelize({
  dialect: SqliteDialect,
  storage: FILE_NAME,
	mode: OPEN_READWRITE | OPEN_CREATE
})
export class Notes extends Model {}
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
export class Settings extends Model {}
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
export class Tokens extends Model {}
Tokens.init(
	{
		token_id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		token: {
			type: DataTypes.STRING,
			allowNull: false
		},
		expiry: {
			type: DataTypes.STRING,
			allowNull: true
		}
	},
	{
		sequelize,
		modelName: 'Tokens'
	}
)
sequelize.sync({ force: false })