# Use the official Node.js image (Debian-based to support native modules like better-sqlite3)
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
# Note: better-sqlite3 requires build tools which are present in the standard node image
RUN npm install

# Copy the rest of the application code
COPY . .

# Create a directory for persistent data if needed
RUN mkdir -p /data

# Expose the port Hugging Face expects (7860)
EXPOSE 7860

# Set environment variable for the port
ENV PORT=7860

# Start the application
CMD ["node", "index.js"]