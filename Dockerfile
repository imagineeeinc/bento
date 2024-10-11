FROM node:21-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN node scripts/sqlite.js
RUN npm run build
RUN npm prune --production

ENV NODE_ENV=production
# ENV PORT=3000

ENTRYPOINT ["npm", "start"]
