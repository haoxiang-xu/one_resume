FROM node:23 AS builder

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm config set strict-ssl false
RUN npm install
COPY . .

# Set build-time environment variable
ARG REACT_APP_API_URL=http://localhost/
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

FROM node:23

WORKDIR /app

RUN npm config set strict-ssl false
RUN npm install -g serve

COPY --from=builder /app/build ./build

EXPOSE 2907

CMD ["serve", "-s", "build", "-l", "2907"]