# Restaurant POS

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Recommended version: 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

### 1. Install Dependencies

Before working on the project, you need to install the necessary dependencies. Run the following command:

```bash
npm ci
```

This will install the dependencies specified in the `package-lock.json` file, ensuring a consistent environment across all machines.

## Starting the Development Server

To start the development server and see your changes in action locally, run:

```bash
npm run dev
```

## Creating a Pull Request

Before creating a pull request, make sure to:

- Install dependencies (`npm ci`)
- Lint your code (`npm run lint`)
- Run tests (`npm run test -- --run`)
- Build the app (`npm run build`)