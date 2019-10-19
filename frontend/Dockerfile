# Use an official node runtime as a parent image
FROM node:12.2.0-alpine

#RUN mkdir -p /app/pulp
WORKDIR /app

# add `/app/pulp/node_modules/.bin` to $PATH
ENV PATH /app/pulp/node_modules/.bin:$PATH

# Install and cache dependencies
COPY ./pulp/package.json /app
COPY ./pulp/package-lock.json /app
COPY ./pulp/webpack.config.js /app

RUN npm install

COPY ./pulp/public /app/public
COPY ./pulp/src /app/src

EXPOSE 8080 

CMD ["npm", "start"]
