import fs from 'node:fs'

if (!fs.existsSync("./db")) {
  fs.mkdirSync("./db");
}

import '../server/adapters/sqlite3.init.js'