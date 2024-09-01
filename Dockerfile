# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Install pip to manage Python packages
RUN apt-get update && apt-get install -y python3-pip

# Install Sherlock using pip
RUN pip3 install sherlock

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port your application will run on
EXPOSE 3000

# Start the application
CMD [ "node", "index.js" ]
