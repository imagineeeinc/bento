import fs from 'node:fs'

if (!fs.existsSync(process.env.SQLITE3_FOLDER || "./db")) {
  fs.mkdirSync(process.env.SQLITE3_FOLDER || "./db");
}

import '../server/adapters/sqlite3.init.js'