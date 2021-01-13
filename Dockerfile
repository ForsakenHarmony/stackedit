FROM node:12-alpine AS builder

WORKDIR /app

RUN apk add --no-cache make gcc git g++ python

RUN mkdir -p /app/server
COPY server/package.json server/yarn.lock ./server/
RUN cd server && yarn install && yarn cache clean && cd /app

COPY package.json yarn.lock ./
RUN yarn install && yarn cache clean

COPY . ./

ENV NODE_ENV production
RUN yarn build

FROM node:12-alpine AS runner

WORKDIR /app
EXPOSE 8080

COPY . ./

# Adding production dependencies to image
COPY --from=builder /app/server/node_modules /app/node_modules
# copy build
COPY --from=builder /app/dist /app/dist

ENV \
    LISTENING_PORT=8080 \
    ROOT_URL=/ \
    NODE_ENV=production \
    PANDOC_PATH=pandoc \
    WKHTMLTOPDF_PATH=wkhtmltopdf \
    USER_BUCKET_NAME=stackedit-users \
    PAYPAL_RECEIVER_EMAIL= \
    DROPBOX_APP_KEY= \
    DROPBOX_APP_KEY_FULL= \
    GITHUB_CLIENT_ID= \
    GITHUB_CLIENT_SECRET= \
    GOOGLE_CLIENT_ID= \
    GOOGLE_API_KEY= \
    WORDPRESS_CLIENT_ID=

CMD [ "node", "." ]
