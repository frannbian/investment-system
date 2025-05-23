<p align="center">
  <img src="https://example.com/logo.svg" width="120" alt="Cocos Challenge Logo" />
</p>

# Cocos Challenge

Cocos Challenge is a project designed to provide a scalable and efficient solution for modern web development. It leverages cutting-edge technologies to deliver high performance and maintainability.

## Description

The project is built with modern web technologies and includes features such as:
- Modular and scalable architecture.
- Support for both development and production environments.
- Docker support for containerized deployment.

Below is the documentation to help you get started with the project.

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v16 or later recommended)
- **npm** or **yarn** (for package management)

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cocos-challange
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Running the Project
1. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   yarn start
   ```

2. Open the project in your browser at `http://localhost:3000` (or the port specified in the configuration).

### Running the Project in Docker Compose
To start the project using Docker Compose:
1. Ensure Docker and Docker Compose are installed and running on your system.
2. Create a `docker-compose.yml` file in the project root (if not already present) with the necessary configuration.
3. Start the services:
   ```bash
   docker-compose up
   ```
4. Access the application in your browser at `http://localhost:3000` (or the port specified in the `docker-compose.yml` file).

5. To stop the services, run:
   ```bash
   docker-compose down
   ```

### Building the Project
To build the project for production:
```bash
npm run build
```
or
```bash
yarn build
```

The build output will be located in the `dist/` directory.
