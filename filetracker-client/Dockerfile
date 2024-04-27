# Use a specific version of Node.js
FROM node:14.19.0-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json separately to leverage Docker layer caching
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Install serve globally to make it available for the serve script
RUN npm install -g serve

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Start the application using serve
CMD ["npm", "run", "serve"]
