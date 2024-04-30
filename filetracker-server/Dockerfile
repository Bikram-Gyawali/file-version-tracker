# Use a specific LTS version of Node.js
FROM node:14.19.0-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json separately to leverage Docker layer caching
COPY package.json .
COPY package-lock.json .

# Install dependencies as a non-root user
RUN adduser -D myuser
RUN chown -R myuser:myuser /usr/src/app
USER myuser
# RUN npm ci --only=production
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (avoid exposing ports unless necessary) 
# Note that the port still will be accessible to localhost
# EXPOSE 5007

# Load environment variables from .env file and run the server with npm run dev
# CMD ["sh", "-c", "cp .env && npm run dev"]

CMD ["npm", "run", "dev"]
