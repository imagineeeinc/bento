FROM node:21-alpine AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build
RUN npm prune --production

FROM node:21 AS run

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
RUN mkdir -p db
ENV SQLITE3_FILE=db/bento.db
RUN ulimit -c unlimited
ENTRYPOINT ["node", "build"]
