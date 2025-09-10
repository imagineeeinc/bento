FROM node:24-alpine AS build

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

RUN npm run build
RUN npm prune --production --legacy-peer-deps

ENV NODE_ENV=production
# ENV PORT=3000

ENTRYPOINT ["npm", "start"]