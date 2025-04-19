# Stage 1: Build the application
FROM node:20 as build

WORKDIR /app

# Copy package files and install all dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Run the build script
RUN npm run build

# Stage 2: Production environment
FROM node:20-alpine

WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files from build stage and install only production dependencies
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json* ./package-lock.json*
RUN npm ci --omit=dev

# Copy build artifacts and public directory from build stage
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public

# Expose the port the app runs on (Remix default is 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 