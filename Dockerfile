FROM node:22-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]