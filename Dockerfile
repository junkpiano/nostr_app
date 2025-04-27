# Use a lightweight Node.js image
FROM node:20-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json ./
RUN npm install

# Copy the app source
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
