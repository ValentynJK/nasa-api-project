# sets enviroment
FROM node:lts-alpine 

# sets working dir for aplication
WORKDIR /app

# copies root dependencies and package-lock (installing the exact version of deps, remove "*" to install the latest deps)
COPY package*.json ./

# copies client's dependencies and package-lock
COPY client/package*.json client/ 
# installs dependencies for client
RUN npm install-client --omit=dev 

# copies server's dependencies and package-lock
COPY server/package*.json server/
# installs dependencies for server
RUN npm install-server --omit=dev 

# copies client folder
COPY client/ client/
# build client to the server
RUN npm run build --prefix client

# copies server folder
COPY server/ server/

# limit the access to the user
USER node

# starts the server
CMD [ "npm", "start", "--prefix", "server" ]

# run the image on PORT 8000
EXPOSE 8000