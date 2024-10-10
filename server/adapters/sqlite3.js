import 'dotenv/config'
import { sequelize, Notes, Settings, Tokens } from './sqlite3.init.js'

export async function putAway(data, timestamp, updated) {
	updated.forEach(i => {
		let item = data[i]
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

export async function saveToken(token, expiry) {
	Tokens.create({ token, expiry })
}

export async function checkToken(token) {
	return await Tokens.findOne({ where: { token } })
}