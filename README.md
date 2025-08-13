<p align="center">
  <img src="https://example.com/logo.svg" width="120" alt="Cocos Challenge Logo" />
</p>

# Investment System

Investment System is a project designed to provide a scalable and efficient solution for modern web development. It leverages cutting-edge technologies to deliver high performance and maintainability.

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
   git clone https://github.com/frannbian/cocos-challange
   cd cocos-challange
   cp .env.example .env
   code .
   ```


### Running the Project in Docker Compose
To start the project using Docker Compose:
1. Ensure Docker and Docker Compose are installed and running on your system & all ports that are used by this project are available.
2. Start the services in background:
   ```bash
   docker-compose up -d
   ```
3. Access the application in your browser at `http://localhost:3000` (or the port specified in the `docker-compose.yml` file).

4. To stop the services, run:
   ```bash
   docker-compose stop
   ```

### Test the Project
To build the project for production:
```bash
npm run test
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
