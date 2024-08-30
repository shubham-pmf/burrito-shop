# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install app dependencies
RUN npm install

# Copy the rest of the app source code to the working directory
COPY . .

# Build the React app
#RUN npm run build

# Use a lightweight HTTP server to serve the React app
#RUN npm install -g serve

# Expose the port on which the React app will run (usually 3000)
EXPOSE 3001

# Start the React app when the container starts
CMD ["npm", "start"]