# Use a lightweight Node.js image
FROM node:22.5.1-alpine

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 5678

CMD ["npm", "run", "serve"]
