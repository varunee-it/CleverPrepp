FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5050

CMD ["npm", "start"]
