# feedback-board

A simple fullstack app that lets users submit, edit, and delete feedback. Built to explore basic CRUD operations with Vue on the frontend and Express + SQLite on the backend.

## Features
- Add, edit, delete feedback
- SQLite3 database with Express API
- Basic structure for future improvements (auth, admin-only routes)

## Tech Stack
- Frontend: Vue 3
- Backend: Express.js
- Database: SQLite3

## Getting Started

### Prerequisites
- Node.js (v20.19.0 or >=22.12.0 for frontend, any recent version for backend)
- npm

### Start the Backend (Node.js/Express)
```bash
cd feedback-board-backend
npm install  # if you haven't already
node server.js
```
The backend will run at `http://localhost:3001`

### Start the Backend (Go)
```bash
cd golang-backend
go run main.go
```
The backend will run at `http://localhost:8080`

### Start the Frontend
In a new terminal:
```bash
cd feedback-board-frontend
npm install  # if you haven't already
npm run dev
```
The frontend will run at `http://localhost:5173`

### Quick Start (Both at Once)
Choose your backend and run these commands in separate terminals:

**Option A: Using Node.js/Express Backend**

Terminal 1 (Backend):
```bash
cd feedback-board-backend && node server.js
```

Terminal 2 (Frontend):
```bash
cd feedback-board-frontend && npm run dev
```

**Option B: Using Go Backend**

Terminal 1 (Backend):
```bash
cd golang-backend && go run main.go
```

Terminal 2 (Frontend):
```bash
cd feedback-board-frontend && npm run dev
```

Then open `http://localhost:5173` in your browser.

**Note:** The frontend is already configured to connect to the backend at `http://localhost:3001` with CORS and cookie support enabled.
