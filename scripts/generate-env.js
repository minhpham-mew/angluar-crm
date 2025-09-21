const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Ensure environments directory exists
const envDir = path.join(__dirname, '../src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const prodTargetPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const envConfigFile = `export const environment = {
  production: false,
  appwrite: {
    endpoint: '${process.env.APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1'}',
    projectId: '${process.env.APPWRITE_PROJECT_ID || ''}',
    projectName: '${process.env.APPWRITE_PROJECT_NAME || 'Angular CRM'}',
    databaseId: '${process.env.APPWRITE_DATABASE_ID || ''}',
    collections: {
      contacts: 'contacts',
      deals: 'deals',
      meetings: 'meetings',
    },
  },
};
`;

const prodEnvConfigFile = `export const environment = {
  production: true,
  appwrite: {
    endpoint: '${process.env.APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1'}',
    projectId: '${process.env.APPWRITE_PROJECT_ID || ''}',
    projectName: '${process.env.APPWRITE_PROJECT_NAME || 'Angular CRM'}',
    databaseId: '${process.env.APPWRITE_DATABASE_ID || ''}',
    collections: {
      contacts: 'contacts',
      deals: 'deals',
      meetings: 'meetings',
    },
  },
};
`;

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(prodTargetPath, prodEnvConfigFile);

console.log('Environment files generated successfully!');
console.log(`Development: ${targetPath}`);
console.log(`Production: ${prodTargetPath}`);
