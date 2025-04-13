# NayaJob Backend

NayaJob is a comprehensive job board platform designed for the Nepali job market. This repository contains the backend API that powers the NayaJob platform, enabling employers to post job opportunities and job seekers to discover and apply for positions.

## Project Overview

NayaJob aims to connect talented professionals with employers across Nepal, offering a modern, efficient platform for job discovery and recruitment. The backend is built with Express.js and TypeScript, providing a robust and scalable API for all job-related operations.

## Core Features

### For Job Seekers

-   User Authentication - Secure signup and signin system with email verification
-   Profile Management - Create and maintain a professional profile with:
    -   Personal information
    -   Educational background
    -   Work experience
    -   Skills and certifications
-   Job Discovery - Search, filter, and browse job listings by various criteria
-   Application Management - Apply to jobs and track application status

### For Employers

-   Company Profile - Create and manage detailed company profiles
-   Job Posting - Create, edit, and manage job listings with comprehensive details
-   Candidate Management - Review applications and manage candidates
-   Analytics - Track job post performance metrics

## Technical Stack

-   Framework: Express.js with TypeScript
-   Database: PostgreSQL with Prisma ORM
-   Authentication: JWT-based authentication system
-   File Storage: Cloudinary for profile pictures and company logos
-   Email Service: Resend for transactional emails
-   Logging: Pino for structured logging
-   Validation: Zod for request validation and type safety

## Architecture

The project follows a clean architecture pattern with:

-   Controllers: Handle HTTP requests and responses
-   Services: Contain business logic and database operations
-   Middleware: Handle cross-cutting concerns like authentication and validation
-   Models: Define data structures and database schema via Prisma
-   Routes: Define API endpoints and connect them to controllers
-   Utils: Shared utility functions and helpers

## Development Features

-   Type Safety: Full TypeScript support with comprehensive type definitions
-   Error Handling: Centralized error handling with appropriate status codes and messages
-   Input Validation: Request validation using Zod schemas
-   Logging: Structured logging for better debugging and monitoring
-   Environment Configuration: Environment-based configuration management

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   PostgreSQL database
-   Cloudinary account for image storage
-   Resend account for email services

### Installation

-   Clone the repository
-   Install dependencies
-   Configure environment variables
-   Set up the database
-   Start the development server

### Environment Variables

```
-   PORT: Server port (default: 3000)
-   DATABASE_URL: PostgreSQL connection URL
-   JWT_SECRET: Secret key for JWT generation
-   JWT_EXPIRES_IN: JWT expiration time
-   CLOUDINARY\_\*: Cloudinary configuration
-   RESEND_API_KEY: Resend API key for email sending
-   FRONTEND_URL: URL of the frontend application
```

## License

MIT License

## Contact

For questions or suggestions, please open an issue on this repository.

Built with ❤️ by Sulav Maharjan
