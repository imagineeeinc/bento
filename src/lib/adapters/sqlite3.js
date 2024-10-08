import 'dotenv/config'
import { Sequelize, Model, DataTypes } from '@sequelize/core'
import { SqliteDialect, OPEN_READWRITE, OPEN_CREATE } from '@sequelize/sqlite3'
import { env } from "$env/dynamic/private"

const FILE_NAME = env.SQLITE3_FILE || process.env.SQLITE3_FILE || "./db/bento.db"

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

export async function putAway(data, timestamp) {
	data.forEach(item => {
		Notes.upsert({ notes_id: item.uid, data: JSON.stringify(item), lastUpdated: timestamp, created: item.creation, delete: item.delete })
	})
	sequelize.sync({ force: false })
}
export async function retrive() {
	let result = await Notes.findAll({
		attributes: ['data'],
		order: [['created', 'ASC']],
	})
	result = result.map(item => JSON.parse(item.data))
	return result
}

const defaultSettings = {"adapter": "sqlite3", "logOut": {h: 24, m: 0}}
let [setting, settingCreated] = await Settings.findOrCreate({
	where: { settings_id: 1 },
	defaults: {
		settings: JSON.stringify(defaultSettings)
	},
})
export async function settingsPutAway(data) {
	await setting.update({ settings: JSON.stringify(data) })
	sequelize.sync({ force: false })
}
export async function settingsRetrive() {
	return JSON.parse(await setting.settings)
}