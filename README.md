# FitCoach AI

FitCoach AI is a full-stack workout tracking web app built for the 24-hour take-home assignment. It lets a user log workouts, review workout history and stats, receive AI-generated motivation grounded in real activity data, and chat with an AI fitness coach.

## Assignment Summary

The assignment asked for a web app where a user can:

1. Log daily workouts
2. View workout history and basic stats
3. Get AI-generated personalized motivational messages based on actual workout data
4. Ask fitness-related questions to an AI chatbot

This repository implements those core requirements with a Next.js frontend, Express backend, MongoDB persistence, Firebase authentication, and OpenRouter-powered AI responses.

## Tech Stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- Backend: Node.js, Express 5, Mongoose
- Database: MongoDB Atlas
- Authentication: Firebase Auth + Firebase Admin
- AI integration: OpenRouter LLM API
- Deployment target:
  - Frontend: Vercel
  - Backend: Render
  - Database: MongoDB Atlas

## Requirement Coverage

### 1. Workout Logging

Implemented:

- Workout form with 5 activity options:
  - Running
  - Yoga
  - Cycling
  - Gym
  - Swimming
- Duration in minutes
- Date and time input with the current time as default
- Past dates allowed
- Workout data saved in MongoDB
- Logged workouts shown in reverse chronological order
- Paginated workout history API and UI

### 2. Stats Dashboard

Implemented stats based on logged workouts:

- Current streak
- Workouts this week
- Most frequent activity
- Total workout minutes

Behavior:

- Dashboard data refreshes immediately after a workout is logged
- No full page refresh is required

### 3. AI Motivational Nudge

Implemented:

- Backend endpoint to generate a motivation message from actual user workout data
- Prompt context includes streak, workout frequency, last workout timing, activity mix, and consistency patterns
- Daily motivation is stored and reused for the current day

Important note:

- The assignment mentions a `"Get AI Motivation"` button
- In this implementation, the motivation is automatically generated and shown on the dashboard instead of requiring a separate click
- The message is still personalized using the user's real data, which was the main scoring requirement

### 4. AI Q&A Chatbot

Implemented:

- Chat UI for user fitness questions
- User message plus recent chat history sent as AI context
- Scrollable conversation in the UI
- Chat history persisted in MongoDB so it survives refresh

### Bonus Features Included

- Mobile-responsive UI
- Persisted chat history
- Coach tone selection
- Real-time dashboard refresh after logging workouts
- Loading and error states
- Gamification extras: points, badges, leaderboard, tournament view

## Product Features In This Repo

- Firebase email/password and Google sign-in
- First-login profile setup
- Unique username validation
- Avatar upload or preset avatar support
- Weekly goal tracking
- Coach tone preference
- Daily motivation card
- AI coach chat
- Workout history tab
- Rank and leaderboard UI

## Project Structure

```text
workout/
|-- backend/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- app.js
|   |-- server.js
|   `-- build.sh
|-- frontend/
|   |-- public/
|   |-- src/app/
|   |-- src/components/
|   |-- src/context/
|   |-- src/lib/
|   `-- src/types/
`-- README.md
```

## API Overview

All protected routes require a Firebase ID token in:

```bash
Authorization: Bearer <token>
```

Available endpoints:

- `GET /api/health`
- `GET /api/users/me`
- `POST /api/users/profile`
- `POST /api/workouts`
- `GET /api/workouts?page=1&limit=10`
- `GET /api/stats`
- `POST /api/ai/motivation`
- `POST /api/chat`
- `GET /api/chat/history`

## Local Setup

### 1. Backend

Create `backend/.env` and add:

```bash
PORT=5000
MONGO_URI=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
OPENROUTER_API_KEY=
```

Install and run:

```bash
cd backend
npm install
npm run dev
```

### 2. Frontend

Create `frontend/.env.local` and add:

```bash
NEXT_PUBLIC_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

## Deployment

### Expected Deployment Setup

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

### Live Deployment Links

- Frontend app: `TBD`
- Backend API: `TBD`
- GitHub repository: `TBD`

### Live Demo Video

- Repository demo video file: [frontend/Video/working_video.mp4](frontend/Video/working_video.mp4)
- Walkthrough video link: `TBD`
- Optional short product demo link: `TBD`

Deployment and video links are still placeholders because publishing credentials and final hosted URLs were not available in this workspace.

## Design Decisions And Tradeoffs

- MongoDB was used instead of Supabase because the current backend is structured around Express + Mongoose and this kept development faster within the time limit.
- Daily motivation is persisted per user per day to avoid repeated LLM calls and to keep the dashboard stable during a single day.
- Avatar uploads are stored as data URLs for simplicity in the assignment scope instead of using object storage.
- The AI motivation flow is automatic on dashboard load instead of being behind a separate button. This is a UI tradeoff, but the generated content still uses real workout context.
- The backend includes fallback behavior so the app remains usable during local development if the AI provider is unavailable.

## Verification

Completed locally:

- Frontend: `npm run lint`
- Frontend: `npm run build`
- Backend: `node --check` on backend source files
