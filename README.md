# Todo App

A modern todo application with a clean separation between frontend and backend.

## Architecture Overview

This application follows a layered architecture pattern with clear separation of concerns:

### Project Structure

```
├── src/
│   ├── server/           # Backend (Node.js + Express)
│   │   ├── index.js      # Main server file with REST API
│   │   ├── routes/       # API route handlers
│   │   ├── models/       # Data models
│   │   └── middleware/   # Express middleware
│   ├── client/           # Frontend (Vanilla JS/HTML/CSS)
│   │   ├── components/   # Reusable UI components
│   │   ├── styles/       # CSS stylesheets
│   │   ├── utils/        # Client-side utilities
│   │   └── app.js        # Main client application
│   └── shared/           # Code shared between client/server
│       ├── api.js        # API client functions
│       └── types.js      # Shared type definitions
├── public/               # Static assets served by Express
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
└── package.json
```

### Architecture Layers

#### 1. **Presentation Layer** (`src/client/`)
- **Components**: Modular UI components for todos, forms, and layout
- **Styles**: CSS modules for component styling
- **App**: Main application logic and state management

#### 2. **API Layer** (`src/shared/api.js`)
- Centralized HTTP client for all API calls
- Error handling and request/response transformation
- Shared between client and server for consistency

#### 3. **Business Logic Layer** (`src/server/`)
- **Routes**: REST API endpoints for todo CRUD operations
- **Models**: Data structure definitions and business rules
- **Middleware**: Authentication, validation, and logging

#### 4. **Data Layer**
- In-memory storage (can be extended to use databases)
- Data persistence and retrieval logic

### API Design

RESTful API following standard conventions:

- `GET /api/todos` - Retrieve all todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update existing todo
- `DELETE /api/todos/:id` - Delete todo

### Technology Stack

- **Backend**: Node.js, Express.js, UUID
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Development**: Nodemon for hot reloading
- **Testing**: Built-in test infrastructure

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

The server runs on `http://localhost:3000` with the frontend served from the `/public` directory.
