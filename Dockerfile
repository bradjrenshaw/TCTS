FROM node:12-alpine as BUILD_IMAGE

WORKDIR /app

# copy the package.json to install dependencies
COPY . /app

# Install the dependencies and make the folder
RUN yarn install && yarn build

FROM nginx:alpine

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=BUILD_IMAGE /app/build /usr/share/nginx/html

EXPOSE 8000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]