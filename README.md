# E-Tutors

E-Tutors is a modern two-sided marketplace application that connects students with verified tutors. This project aims to provide a seamless experience for both students seeking tutoring services and tutors offering their expertise.

## Features

- **User Authentication**: Secure registration and login for both students and tutors.
- **Dashboards**: Personalized dashboards for tutors and students to manage profiles, bookings, and assignments.
- **Payment Processing**: Integration with Stripe for secure payment handling.
- **RESTful API**: A well-defined API for frontend and backend communication.

## Project Structure

The project is divided into several key components:

- **Backend**: Contains the server-side application built with TypeScript and Express/Fastify.
- **Frontend**: A React-based application for user interaction.
- **Payments**: Handles payment processing through Stripe.
- **Infrastructure**: Docker configurations for easy deployment.

## Getting Started

### Prerequisites

- Node.js
- TypeScript
- Docker (for infrastructure)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend and frontend directories and install dependencies:
   ```
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. Set up environment variables by copying `.env.example` to `.env` and filling in the required values.

### Running the Application

- To start the backend server:
  ```
  cd backend
  npm run start
  ```

- To start the frontend application:
  ```
  cd frontend
  npm run start
  ```

- To run the application using Docker:
  ```
  cd infra
  docker-compose up
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.