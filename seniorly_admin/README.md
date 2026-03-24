# Seniorly Admin Panel

Standalone admin app for Seniorly.

## Features

- Admin login (role must be admin)
- Dashboard stats
- Create new live/upcoming session
- Change session status
- Delete session
- Change webinar status
- Delete webinar
- User role control (student/instructor/admin)
- User active/deactive control

## Run

1. Start backend API first (from seniorly_backend).
2. Open this folder and install dependencies:

npm install

3. Start admin app:

npm start

By default admin app runs on localhost:3000. If your main frontend already uses 3000, run:

set PORT=3001 && npm start

## API URL

Set REACT_APP_API_URL if backend runs on different host:

set REACT_APP_API_URL=http://localhost:5000
npm start
