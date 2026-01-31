# Dockerfile for Next.js
FROM node:18

# Set the working directory
WORKDIR /app

# Install build tools for native modules
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (use install instead of ci to resolve platform-specific deps)
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Rebuild native modules for Linux target and reinstall packages with native bindings
RUN npm rebuild && npm install lightningcss @tailwindcss/oxide --force

# Set NODE_ENV to production
ENV NODE_ENV=production

# Build the Next.js application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
