# Use the official Node.js 18 image as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml (if available)
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of your app's source code
COPY . .

# Build your Next.js app
RUN pnpm build

# Expose the port your app runs on
EXPOSE 3000

# Run your app
CMD ["pnpm", "start"]