# Builder stage
FROM node:18.17-bullseye as builder


RUN apt-get update && apt-get install -y python3 make g++ gcc libc6-dev && \
  rm -rf /var/lib/apt/lists/*


# Setup working directory
WORKDIR /app


COPY --chown=node:node package.json yarn.lock ./

# Installing all dependencies
RUN yarn install --pure-lockfile

# Copying source files
COPY --chown=node:node ./src /app/src
COPY --chown=node:node tsconfig.json nest-cli.json .swcrc /app/

# Running the package script
RUN yarn build

# yarn cache stage
FROM node:18.17-bullseye as cache

# Installing system dependencies
RUN apt-get update && apt-get install -y python3 make g++ gcc libc6-dev && \
  rm -rf /var/lib/apt/lists/*

# Setup working directory
WORKDIR /app

# Removing development dependencies
COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --pure-lockfile --production

# Runner stage
FROM node:18.17-bullseye as runner
WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./
COPY --from=builder /app/dist /app/dist
COPY --from=cache /app/node_modules /app/node_modules

# Setting environment variables
ENV NODE_ENV production

# Exposing port
EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=4s --start-period=5s \
  CMD curl -f http://localhost:${PORT}/v2/healthcheck/mongo || exit 1


# Setting the command to run
CMD [ "node", "--enable-source-maps", "dist/main" ]
