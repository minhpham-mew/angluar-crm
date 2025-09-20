export const environment = {
  production: true,
  appwrite: {
    endpoint: 'https://sfo.cloud.appwrite.io/v1',
    projectId: '68ce82f800133b2218e5',
    projectName: 'Angular CRM',
    databaseId: 'crm_db',
    collections: {
      contacts: 'contacts',
      deals: 'deals',
      meetings: 'meetings'
    }
  }
};
