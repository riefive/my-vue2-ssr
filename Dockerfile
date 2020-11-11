# Image base
FROM node:alpine

# Install essential
RUN apk add python make g++

# Create app directory
WORKDIR /vue/ssr

# Install app dependencies
COPY package.json ./
COPY yarn.lock ./

# Install library
RUN yarn install --no-progress

# Bundle app source
COPY . .

# Build app
RUN yarn build
RUN node build

# Run app
WORKDIR /.appview
RUN yarn install --production=true
ENV NODE_ENV development

CMD [ "node", "index" ]
