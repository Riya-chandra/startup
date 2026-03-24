# Production Deployment Guide for Seniorly

## Frontend (Vercel)
1. Go to Vercel project settings
2. Environment Variables section
3. Add:
   - Key: REACT_APP_API_URL
   - Value: https://your-render-backend-url.onrender.com (without trailing slash)
4. Redeploy

## Admin Panel (Vercel - if separate)
Same as frontend, different project.

## Backend (Render)
1. Go to Render service settings
2. Environment section
3. Add:
   - CLIENT_URL: https://your-frontend.vercel.app
   - ADMIN_CLIENT_URL: https://your-admin.vercel.app (if separate)
   - NODE_ENV: production
   - MONGODB_URI: your mongodb connection string
   - JWT_SECRET: strong random string
   - JWT_EXPIRE: 7d
   - EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS (for email notifications)
   - ADMIN_EMAIL: admin@seniorly.com
   - ADMIN_PASSWORD: Admin@123456
4. Redeploy

## Important URLs
- Frontend: https://startup-ten-kappa.vercel.app
- Backend URL to use in Frontend: https://your-render-service.onrender.com (find this in Render dashboard)
- Admin: https://admin-app.vercel.app (if separate)

## Verification
1. Open deployed frontend in browser
2. Open DevTools (F12) > Network tab
3. Try login
4. Check request URL - should show render backend URL, NOT localhost:5000
5. If still showing localhost, env variable not applied - redeploy frontend

## Common Issues
- "Is backend running on port 5000?" = REACT_APP_API_URL not set in Vercel
- CORS errors = CLIENT_URL/ADMIN_CLIENT_URL mismatch in backend env
- Mixed content error = using http instead of https (use https only)
