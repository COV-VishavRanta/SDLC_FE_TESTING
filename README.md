# Pop Logic

A modern web application built with Next.js, serving both as the frontend and Backend for Frontend (BFF)

## Project Config

| Technology                                                                                                        | Version | Purpose                          |
| ----------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------- |
| [Node.js](https://nodejs.org)                                                                                     | 24.13.0 | JavaScript Runtime               |
| [Next.js](https://nextjs.org)                                                                                     | 16.1.6  | React Framework (Frontend + BFF) |
| [React](https://react.dev)                                                                                        | 19.2.3  | UI Library                       |
| [TypeScript](https://www.typescriptlang.org)                                                                      | 5.9.3   | Type Safety                      |
| [Apollo Client](https://github.com/apollographql/apollo-client-integrations/blob/main/packages/nextjs/README.md/) | 4.1.3   | GraphQL Client (RSC + Browser)   |
| [AWS Amplify](https://docs.amplify.aws/)                                                                          | 6.16.0  | AWS Cognito Authentication       |
| [next-intl](https://next-intl-docs.vercel.app/)                                                                   | 4.8.0   | Internationalization (i18n)      |
| [Tailwind CSS](https://tailwindcss.com)                                                                           | 4.x     | Utility-first CSS Framework      |
| [shadcn/ui](https://ui.shadcn.com/)                                                                               | 3.7.0   | Accessible UI Component Library  |
| [Base UI](https://base-ui.com/)                                                                                   | 1.1.0   | Unstyled, accessible components  |
| [ESLint](https://eslint.org)                                                                                      | 9.39.2  | Code Linting                     |
| [Prettier](https://prettier.io)                                                                                   | 3.8.1   | Code Formatting                  |

## Getting Started

### Prerequisites

- Node.js v24.13.0 installed
- Package manager of your choice:
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/CovalienceLLC/pop-logic-frontend.git

# Navigate to the project directory
cd pop-logic-frontend

# Install dependencies
npm install
```

## Project Structure

```
pop-logic-frontend/
├── PopLogic-figma.fig         # Project Figma design source file
├── docs/                      # Architecture & feature documentation
│   └── features/              # Feature-specific documentation
│       ├── auth/              # Authentication architecture
│       └── i18n/              # Internationalization architecture
├── public/
│   └── locales/               # Translation files (manually managed)
│       ├── en/                # English translations
│       └── es/                # Spanish translations
│       └── fr/                # French translations
├── src/
│   ├── app/                   # Next.js App Router (pages, layouts, etc.)
│   ├── components/            # UI components
│   ├── constant/              # Constants and enums
│   │   └── enums/             # Application enums
│   ├── graphql/               # GraphQL queries, mutations & fragments
│   ├── hooks/                 # Custom React hooks
│   ├── i18n/                  # Internationalization config & utilities
│   ├── lib/                   # Third-party library configurations
│   │   ├── amplify/           # AWS Amplify (Cognito auth)
│   │   └── apollo/            # Apollo Client (GraphQL)
│   ├── types/                 # TypeScript types and interfaces
│   └── utils/                 # Utility functions
```

Each folder contains its own `README.md` with detailed guidelines and examples.

## Documentation

Comprehensive documentation is available in the [`docs/`](docs/) directory:

- **[Authentication Architecture](docs/features/auth/login.architecture.md)** — AWS Cognito integration with Amplify
- **[Internationalization Architecture](docs/features/i18n/internationalization.architecture.md)** — Multi-language support with next-intl
- **[Cognito Setup](COGNITO_SETUP.md)** — Creating and configuring AWS Cognito User Pools

## Design Assets

The repository also includes the project's Figma source file for design reference and collaboration:

- **[PopLogic-figma.fig](PopLogic-figma.fig)** — Checked-in Figma design asset for the Pop Logic project

## AWS Infrastructure

### Cognito Authentication

This project uses **AWS Cognito User Pools** (Single Page Application type) with **passwordless email OTP** as the authentication method. No passwords are stored — users log in by receiving a one-time code to their email.

To set up or update a Cognito user pool, see the **[Cognito Setup Guide](COGNITO_SETUP.md)**.

The required environment variables are:

| Variable                               | Description                  |
| -------------------------------------- | ---------------------------- |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID`     | The Cognito User Pool ID     |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID`        | The App Client ID            |
| `NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID` | The Cognito Identity Pool ID |

> These values are managed in **AWS Secrets Manager** for both the frontend and backend.

## Features

### 🌐 Multi-Language Support

The application supports multiple languages with client-side locale switching:

- **Dynamic locale switching** without page reloads or URL changes
- **Translation management** via local JSON files
- **No Flash of Untranslated Content (FOUC)** with server-side hydration

**Supported Languages:**

- English (en)
- Spanish (es)
- French (fr)
  **Quick Start:**

```tsx
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();
  return <h1>{t('welcome.title')}</h1>;
}
```

See the [Internationalization Architecture](docs/features/i18n/internationalization.architecture.md) for complete implementation details.

## Scripts

| Script                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Run linting, then start the development server |
| `npm run build`        | Run linting, then build for production         |
| `npm run start`        | Start the production server                    |
| `npm run lint`         | Run ESLint to check for code issues            |
| `npm run lint:fix`     | Run ESLint and automatically fix issues        |
| `npm run format`       | Format all files with Prettier                 |
| `npm run format:check` | Check if files are formatted (CI/pre-commit)   |

### Translation Management

Translations are managed locally in JSON files under [`public/locales/`](public/locales/). Each language has its own directory with a `translation.json` file:

```
public/locales/
├── en/translation.json    # English translations
├── es/translation.json    # Spanish translations
└── [locale]/translation.json
```

To add or update translations, directly edit the appropriate JSON file and restart the development server.
