# Image base
FROM node:alpine

# Install essential
RUN apk add python make g++

# Install cleaner
RUN apk add --no-cache curl git && cd /tmp && \
    curl -#L https://github.com/tj/node-prune/releases/download/v1.0.1/node-prune_1.0.1_linux_amd64.tar.gz | tar -xvzf- && \
    mv -v node-prune /usr/local/bin && rm -rvf * && \
    echo "yarn cache clean && node-prune" > /usr/local/bin/node-clean && chmod +x /usr/local/bin/node-clean

# Create app directory
WORKDIR /public/application

# Install app dependencies
COPY package*.json ./
COPY yarn*.lock ./

# Check node_modules compressed file and Install library
RUN export COMPRESS=false
RUN export FILE=node_modules.tar.gz 
RUN [ "$COMPRESS" = true ] && [ -f "$FILE" ] && \ 
    (tar -zxvf node_modules.tar.gz > /dev/null 2>&1 && rm -rf node_modules.tar.gz) || echo "uncompressed cancel"

RUN yarn install --no-progress --frozen-lockfile

# Bundle app source
COPY . .

# Build app
RUN yarn build
RUN node build

# Compress node modules
RUN [ "$COMPRESS" = true ] && \ 
    (tar -cvjf node_modules.tar.gz node_modules > /dev/null 2>&1) || echo "compressed cancel"

# Remove all files except some files and directories
RUN ls -a | grep -v -P "node_modules*|package.json|yarn.lock|.appview" | xargs --no-run-if-empty rm -rf

# Run app
RUN cd .appview && yarn install --frozen-lockfile --production && node-clean
WORKDIR .appview

# Setting Env
ENV NODE_ENV development
ENV PORT 4000
ENV VUE_APP_TARGET ssr
ENV VUE_APP_TITLE Vue SSR Sampe

EXPOSE 4000
CMD [ "node", "index" ]
