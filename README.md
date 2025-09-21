# Angular CRM

A modern Customer Relationship Management (CRM) application built with Angular 20, PrimeNG, NgRx, and Appwrite as the backend service.

## 🚀 Features

- **Contact Management**: Add, edit, and manage customer contacts
- **Deal Tracking**: Track sales opportunities and deal progress
- **Meeting Scheduling**: Schedule and manage meetings with clients
- **Dashboard Overview**: Visual analytics and key metrics
- **User Authentication**: Secure login and registration
- **Responsive Design**: Modern UI with PrimeNG components
- **State Management**: Powered by NgRx for predictable state management
- **Real-time Search**: Advanced search functionality across all modules

## 🛠️ Tech Stack

- **Frontend**: Angular 20, TypeScript, PrimeNG, TailwindCSS
- **State Management**: NgRx (Store, Effects, Devtools)
- **Backend**: Appwrite (Database, Authentication, Real-time)
- **Build Tool**: Angular CLI with Vite
- **Styling**: PrimeNG Aura Theme, TailwindCSS

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [Angular CLI](https://angular.dev/tools/cli) (v20 or higher)
- [Appwrite](https://appwrite.io/) account and project

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd angular-crm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file with your Appwrite configuration:

```bash
# Appwrite Configuration
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-project-id
APPWRITE_PROJECT_NAME=Angular CRM
APPWRITE_DATABASE_ID=your-database-id
```

### 4. Generate Environment Files

```bash
npm run env:generate
```

## 🔥 Appwrite Setup

### Step 1: Create Appwrite Project

1. Go to [Appwrite Console](https://cloud.appwrite.io/)
2. Create a new account or sign in
3. Create a new project
4. Copy your **Project ID** from the project settings

### Step 2: Configure Web Platform

1. In your Appwrite project, go to **Settings** → **Platforms**
2. Add a new **Web App** platform
3. Set the hostname to `localhost` (for development)
4. For production, add your production domain

### Step 3: Create Database

1. Go to **Databases** in your Appwrite console
2. Create a new database
3. Copy the **Database ID**

### Step 4: Create Collections

Create the following collections with these attributes:

#### Contacts Collection
```json
{
  "name": "contacts",
  "attributes": [
    { "key": "name", "type": "string", "size": 255, "required": true },
    { "key": "email", "type": "email", "required": true },
    { "key": "phone", "type": "string", "size": 20 },
    { "key": "company", "type": "string", "size": 255 },
    { "key": "position", "type": "string", "size": 255 },
    { "key": "notes", "type": "string", "size": 1000 },
    { "key": "createdAt", "type": "datetime", "required": true },
    { "key": "updatedAt", "type": "datetime", "required": true }
  ]
}
```

#### Deals Collection
```json
{
  "name": "deals",
  "attributes": [
    { "key": "title", "type": "string", "size": 255, "required": true },
    { "key": "description", "type": "string", "size": 1000 },
    { "key": "value", "type": "double", "required": true },
    { "key": "stage", "type": "string", "size": 50, "required": true },
    { "key": "contactId", "type": "string", "size": 255 },
    { "key": "expectedCloseDate", "type": "datetime" },
    { "key": "probability", "type": "integer", "min": 0, "max": 100 },
    { "key": "createdAt", "type": "datetime", "required": true },
    { "key": "updatedAt", "type": "datetime", "required": true }
  ]
}
```

#### Meetings Collection
```json
{
  "name": "meetings",
  "attributes": [
    { "key": "title", "type": "string", "size": 255, "required": true },
    { "key": "description", "type": "string", "size": 1000 },
    { "key": "startTime", "type": "datetime", "required": true },
    { "key": "endTime", "type": "datetime", "required": true },
    { "key": "location", "type": "string", "size": 255 },
    { "key": "attendees", "type": "string", "size": 1000 },
    { "key": "contactId", "type": "string", "size": 255 },
    { "key": "dealId", "type": "string", "size": 255 },
    { "key": "status", "type": "string", "size": 50, "required": true },
    { "key": "createdAt", "type": "datetime", "required": true },
    { "key": "updatedAt", "type": "datetime", "required": true }
  ]
}
```

### Step 5: Configure Permissions

For each collection, set the following permissions:

1. **Create**: Any authenticated user
2. **Read**: Any authenticated user
3. **Update**: Any authenticated user
4. **Delete**: Any authenticated user

*Note: Adjust permissions based on your security requirements*

### Step 6: Enable Authentication

1. Go to **Auth** in your Appwrite console
2. Enable **Email/Password** authentication
3. Configure any additional authentication methods as needed

## 🚀 Development

### Start Development Server

```bash
npm start
```

The application will be available at `http://localhost:4200/`

### Build for Production

```bash
npm run build:prod
```

### Run Tests

```bash
npm test
```

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/                 # Authentication module
│   ├── core/                 # Core services and guards
│   ├── features/             # Feature modules
│   │   ├── contacts/         # Contact management
│   │   ├── deals/           # Deal tracking
│   │   └── meetings/        # Meeting scheduling
│   ├── shared/              # Shared components and services
│   └── layouts/             # Layout components
├── environments/            # Environment configurations (auto-generated)
└── styles/                  # Global styles
```

## 🔧 Available Scripts

- `npm start` - Start development server with environment generation
- `npm run build` - Build for development
- `npm run build:prod` - Build for production
- `npm run env:generate` - Generate environment files from .env
- `npm test` - Run unit tests
- `npm run watch` - Build and watch for changes

## 🌟 Key Features Explained

### State Management
The application uses NgRx for state management with separate stores for:
- Authentication state
- Contacts management
- Deals tracking
- Meetings scheduling
- Notifications

### Component Architecture
- **Standalone Components**: All components use the new standalone API
- **Signal-based**: Uses Angular signals for reactive state management
- **OnPush Strategy**: Optimized change detection for better performance

### Styling
- **PrimeNG**: Professional UI component library
- **Aura Theme**: Modern design system
- **TailwindCSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach

## 🔒 Security

- Environment variables are never committed to version control
- Appwrite handles authentication and authorization
- HTTPS enforced in production
- Input validation and sanitization

## 🚀 Deployment

### Environment Variables for Production

Set the following environment variables in your deployment platform:

```bash
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your-production-project-id
APPWRITE_PROJECT_NAME=Angular CRM
APPWRITE_DATABASE_ID=your-production-database-id
```

### Build and Deploy

```bash
npm run build:prod
```

Deploy the contents of the `dist/` directory to your hosting platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Environment Setup Guide](ENVIRONMENT_SETUP.md)
2. Review the [Appwrite Documentation](https://appwrite.io/docs)
3. Open an issue in the repository

## 🙏 Acknowledgments

- [Angular Team](https://angular.dev/) for the amazing framework
- [PrimeNG](https://primeng.org/) for the UI components
- [Appwrite](https://appwrite.io/) for the backend services
- [NgRx](https://ngrx.io/) for state management
