# Environment Setup

This project uses environment variables for configuration management.

## Setup Instructions

1. **Copy the example environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Fill in your configuration values in `.env`:**

   ```bash
   # Appwrite Configuration
   APPWRITE_ENDPOINT=https://your-appwrite-endpoint.com/v1
   APPWRITE_PROJECT_ID=your-project-id
   APPWRITE_PROJECT_NAME=Your Project Name
   APPWRITE_DATABASE_ID=your-database-id

   ```

3. **Generate environment files:**
   ```bash
   npm run env:generate
   ```

## How it Works

- The `.env` file contains your actual configuration values
- The `scripts/generate-env.js` script reads the `.env` file and generates the Angular environment files
- The environment files are automatically generated when you run `npm start` or `npm run build`

## Security

- The `.env` file is ignored by Git (see `.gitignore`)
- Never commit sensitive information to version control
- Use `.env.example` to document required environment variables
- Each developer should have their own `.env` file

## Available Scripts

- `npm run env:generate` - Generate environment files from .env
- `npm start` - Generate environment files and start development server
- `npm run build` - Generate environment files and build for development
- `npm run build:prod` - Generate environment files and build for production
