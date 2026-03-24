# Seniorly Full Stack

Complete LMS platform with admin panel. Main site + Admin + Backend APIs.

## Folder Structure

```
startup/
├── seniorly_backend/       # Express API server
├── seniorly_frontend/      # Main React website
├── seniorly_admin/         # Admin React panel (separate)
└── DEPLOYMENT.md           # Production deployment guide
```

## Local Development

### Backend

```bash
cd seniorly_backend
npm install
npm run dev
```

API runs on `http://localhost:5000`

### Frontend

```bash
cd seniorly_frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000` by default

### Admin Panel

```bash
cd seniorly_admin
npm install
npm start
```

Admin runs on `http://localhost:3001` by default (if 3000 is taken)

## Database

MongoDB Atlas is used. Connection string in `.env`

To seed initial data:
```bash
cd seniorly_backend
npm run seed
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
ADMIN_CLIENT_URL=http://localhost:3001
ADMIN_EMAIL=admin@seniorly.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

### Admin (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Features

### Frontend (Main Website)
- Browse webinars and sessions
- Student enrollment
- Email notifications
- Public pages

### Admin Panel
- Login with admin credentials
- Create live/upcoming sessions
- Delete sessions/webinars
- Change session/webinar status
- Manage user roles
- View dashboard stats

### Backend API
- User authentication (JWT)
- Session management
- Webinar management
- Enrollment tracking
- Email notifications
- Admin-only routes

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step guide:
1. Deploy frontend to Vercel
2. Deploy admin panel to Vercel (separate project)
3. Deploy backend to Render

Key: Set `REACT_APP_API_URL` in Vercel project env to point to deployed backend URL.

## Default Admin Credentials

After seed:
- Email: `admin@seniorly.com`
- Password: `Admin@123456`

⚠️ Change these in production!

## Troubleshooting

**"Cannot connect to server" in deployed frontend:**
- Check Vercel env: `REACT_APP_API_URL` should be set to Render backend URL (https, no trailing slash)
- Redeploy frontend after env change
- Open DevTools > Network > check request URL

**CORS errors:**
- Backend env: `CLIENT_URL` and `ADMIN_CLIENT_URL` must match deployed URLs
- Must use https in production

**Seed fails:**
- Check MongoDB URI
- Ensure backend started first with `connectDB()`

## Tech Stack

- **Frontend**: React 18, CSS
- **Admin**: React 18, CSS
- **Backend**: Express.js, MongoDB, JWT
- **Deployment**: Vercel (frontend), Render (backend)
