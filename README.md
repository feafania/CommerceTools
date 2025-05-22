# 🎁 Gift E-commerce Store (CommerceTools)

**Final Project for RS School JavaScript Front-End 2024 Q4**

## 📘 Project Overview

This project is an online gift shop developed as the final task for the **RS School JSFE 2024 Q4** course. It is a single-page application (SPA) built using **JavaScript**, **TypeScript**, and powered by the **CommerceTools API** for backend operations.

---

## ⚙️ Tech Stack

- **JavaScript (ES6+)**
- **TypeScript**
- **Webpack** for bundling
- **Jest** for unit testing
- **ESLint** for linting
- **Prettier** for code formatting
- **Husky + Lint-Staged** for pre-commit quality checks
- **dotenv** for environment configuration
- **CommerceTools** as the e-commerce backend platform

---

## 📜 Available Scripts

You can run the following scripts using `npm run <script-name>`:

| Script             | Description                                                       |
| ------------------ | ----------------------------------------------------------------- |
| `start`            | Runs the project in development mode with live reload             |
| `build`            | Builds the project for production                                 |
| `test`             | Runs Jest tests                                                   |
| `test:watch`       | Runs Jest in watch mode                                           |
| `test:coverage`    | Runs Jest and generates a code coverage report                    |
| `test:ci`          | Runs Jest in CI mode (with coverage and silent output)            |
| `test:unit`        | Runs only unit tests (ignores **tests**/integration folder)       |
| `test:integration` | Runs only integration tests (inside **tests**/integration folder) |
| `lint`             | Runs ESLint to check JS/TS files for issues                       |
| `lint:fix`         | Automatically fixes linting issues                                |
| `format`           | Formats code using Prettier                                       |
| `ci:format`        | Checks formatting (for CI purposes)                               |
| `prepare`          | Initializes Husky (for Git hooks)                                 |

---

## 🚀 Setup and Run Locally

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/feafania/CommerceTools.git
cd CommerceTools
```

### 2. Install dependencies

Install all required packages using npm:

```bash
npm install
```

### 3. Configure environment variables

The project uses environment variables managed via a .env file. An example file is provided:

```bash
cp .env.example .env
```

You can edit the new .env file if needed. It includes:

```bash
PORT=3020
# Possible values: 3000, 3005, 8080

NODE_ENV=development
# Possible values: development, production, test
```

Make sure to use the correct values depending on your local setup or deployment environment.

### 4. Start the development server

```bash
npm start
```

This will start the app in development mode with hot module replacement. The app will be available at http://localhost:PORT based on the PORT you specified.
