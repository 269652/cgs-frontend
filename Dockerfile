# Dockerfile for Next.js
FROM node:18

# Set the working directory
WORKDIR /app

# Install build tools for native modules and Chrome dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
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

# Accept STRAPI_URL as build arg and set as env var for Next.js SSG
ARG STRAPI_URL
ENV STRAPI_URL=${STRAPI_URL}

# Accept NEXT_PUBLIC_SITE_URL as build arg for metadata generation
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Build the Next.js application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
