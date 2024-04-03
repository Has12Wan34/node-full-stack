# Use an official Node.js runtime as the base image
FROM node:20.12.0
ENV NODE_ENV=production

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the working directory
COPY ["package.json", "package-lock.json*", "./"]

# Install Node.js dependencies
RUN npm install --production

# Define the command to run the app
CMD ["node", "server.js"]