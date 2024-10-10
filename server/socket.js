import { save, load, settingsSave, settingsLoad, authenticate, checkTokenValidity } from './db.js'
export function socketManger(socket, io) {
	socket.on('syncFirst', async (data, fn) => {	
		let res = await save(data)
		let settings = await settingsLoad()
		fn({ notes: res, settings })
	})

	socket.on('save', async (data) => {	
		await save(data)
	})

	socket.on('settingsSave', async (data) => {
		await settingsSave(data)
		socket.emit('settingsSave', res)
	})

	socket.on('signIn', async (data, fn) => {
		const token = await authenticate(data, process.env.WEB_PASS || "")
		fn({ token })
	})

	socket.on('authVerify', async (data, fn) => {
		if (await checkTokenValidity(data) == null) {
			fn({ signOut: true })
		} else {
			fn({ signOut: false })
		}
	})
}
