# Use official Node.js image for build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Use a lightweight image to serve the build
FROM node:20-alpine AS production
WORKDIR /app

# Install 'serve' to serve static files
RUN npm install -g serve

# Copy built files from previous stage
COPY --from=build /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"] 