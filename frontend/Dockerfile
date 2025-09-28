FROM node:23 AS builder

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:23

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 2907

CMD ["serve", "-s", "build", "-l", "2907"]