FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port 3000
EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000

# Start Docusaurus dev/live server
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "3000", "--no-open"]
