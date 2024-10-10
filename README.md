# Bento

<img src="./static/images/bento.svg" width="30%" align="right">

A self hosted minimalist note taking service.

### Features
- Markdown Notes & preview
- Minimal Notes Grid for least friction
- Archiving & Tagging (*Tagging not implemented yet*)
- Search notes
- Can be installed as a PWA
- Offline First model, ensuring offline data is merged once online.

## Installation
### From Source
Make sure to have the latest version of Node and npm installed, also pnpm is recommended over npm
1. Clone the this repo
	```bash
	git clone https://github.com/imagineeeinc/bento.git
	```
2. Install dependencies
	```bash
	npm i
	# pnpm (recommended)
	pnpm i
	```

3. Generate SQLite Database
	```bash
	node scripts/sqlite.js
	# Set env "SQLITE3_FILE" to the database file to be used. Default is "db/bento.db", db folder is created. 
	```
4. Generate build
	```bash
	npm run build
	# pnpm
	pnpm build
	```
5. Run server. Set the `WEB_PASS` env to a password of your choice, you can also use a `.env` file in the root of the project.
	```bash
	node server/index.js
	```

### Docker
Make sure to have docker cli installed.
1. Build the image
	```bash
	docker build . -t bento
	```
2. Run. Set the `WEB_PASS` env to a password of your choice. You can also set the used port by setting the `PORT` env.
	```bash
	docker run -p 3000:3000 -e WEB_PASS=Password -d bento
	```
	Access the web app at `localhost:3000`.