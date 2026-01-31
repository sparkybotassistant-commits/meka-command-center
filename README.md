# MEKA Command Center

Personal task and project management dashboard for MEKA (Jared Beguelin).

## Features

- **Task Management**: "Want to Do" vs "Have to Do" task organization
- **Habit Tracking**: Track daily habits with streak counters
- **Sparky Dashboard**: See what Sparky (your AI assistant) is working on
- **Analytics**: View completion rates and productivity metrics
- **Real-time Sync**: Firebase backend for live updates across devices
- **Mobile Responsive**: Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Firebase (Authentication + Firestore)
- **Hosting**: Vercel

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project" and name it "meka-command-center"
3. Enable Google Analytics (optional)
4. Click "Continue" and wait for project creation

### 2. Enable Authentication

1. In Firebase Console, go to "Build" → "Authentication"
2. Click "Get Started"
3. Enable "Google" sign-in method
4. Configure OAuth consent screen (use your Gmail)
5. Save

### 3. Enable Firestore Database

1. Go to "Build" → "Firestore Database"
2. Click "Create Database"
3. Choose "Start in test mode" (you can add security rules later)
4. Select a location (us-east1 for East Coast)
5. Click "Enable"

### 4. Get Firebase Config

1. Go to Project Settings (gear icon)
2. Under "Your apps", click the web icon (</>)
3. Register app with nickname "MEKA Command Center"
4. Copy the firebaseConfig values

### 5. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase config values in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 6. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 7. Deploy to Vercel

#### Option A: Via Vercel CLI

```bash
npm i -g vercel
vercel
```

#### Option B: Via GitHub Integration

1. Push this repo to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard
5. Deploy

## Database Structure

### Tasks Collection
```
tasks/{taskId}
  - userId: string
  - title: string
  - category: 'want' | 'have'
  - status: 'pending' | 'in-progress' | 'completed'
  - project?: string
  - dueDate?: timestamp
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Habits Collection
```
habits/{habitId}
  - userId: string
  - name: string
  - streak: number
  - lastCompleted?: timestamp
  - createdAt: timestamp
```

### Sparky Tasks Collection
```
sparkyTasks/{taskId}
  - userId: string
  - description: string
  - status: 'pending' | 'in-progress' | 'completed' | 'error'
  - priority: 'low' | 'medium' | 'high'
  - notes?: string
  - createdAt: timestamp
  - updatedAt: timestamp
```

## Future Enhancements

- [ ] Calendar integration (Google Calendar)
- [ ] Voice input for quick task adding
- [ ] Push notifications for reminders
- [ ] Project categorization beyond want/have
- [ ] Time tracking per task
- [ ] Data export/import

## License

Private - For personal use only.
# Deployed: 2026-01-31 07:10:28 UTC
