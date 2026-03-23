# Seniorly Backend API

Node.js + Express + MongoDB backend for the Seniorly learning platform.

## Quick Start

```bash
# 1. Install
npm install

# 2. Setup env
cp .env.example .env
# Edit .env — fill MongoDB URI + email creds

# 3. Seed database
npm run seed

# 4. Run
npm run dev      # development (nodemon, hot reload)
npm start        # production
```

## Docker (Recommended)
```bash
cp .env.example .env   # fill values
docker-compose up -d
```

---

## API Reference

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/users/register` | — | Register |
| POST | `/api/users/login` | — | Login → JWT |
| GET | `/api/users/profile` | ✅ | Get own profile |
| PUT | `/api/users/profile` | ✅ | Update profile |
| POST | `/api/users/forgot-password` | — | Send reset email |
| POST | `/api/users/reset-password/:token` | — | Reset password |
| GET | `/api/users/verify-email/:token` | — | Verify email |
| GET | `/api/users` | Admin | List all users |

### Webinars (Free content)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/webinars` | — | List published webinars |
| GET | `/api/webinars/:id` | — | Single webinar |
| POST | `/api/webinars` | Instructor/Admin | Create webinar |
| PUT | `/api/webinars/:id` | Instructor/Admin | Update webinar |
| DELETE | `/api/webinars/:id` | Admin | Delete |
| POST | `/api/webinars/:id/enroll` | — | Enroll (guest ok) |

### Sessions (Upcoming paid)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/sessions` | — | List sessions |
| GET | `/api/sessions/:id` | — | Single session |
| POST | `/api/sessions` | Instructor/Admin | Create session |
| PUT | `/api/sessions/:id` | Instructor/Admin | Update |
| DELETE | `/api/sessions/:id` | Admin | Delete |
| POST | `/api/sessions/:id/notify` | — | "Notify Me" — saves email |
| POST | `/api/sessions/:id/launch` | Admin | Go live + fire emails |
| GET | `/api/sessions/:id/notify-count` | Admin | How many waiting |

### Enrollments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/enrollments/my-courses` | ✅ | My enrolled webinars |
| PUT | `/api/enrollments/:id/progress` | ✅ | Update lesson progress |
| POST | `/api/enrollments/:id/review` | ✅ | Submit review |

### Email / Newsletter
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/emails/subscribe` | — | Newsletter subscribe |
| GET | `/api/emails/confirm/:token` | — | Confirm email |
| POST | `/api/emails/unsubscribe` | — | Unsubscribe |
| POST | `/api/emails/course-notifications` | — | Notify for any session |
| POST | `/api/emails/send-course-alert` | Admin | Blast launch emails |
| GET | `/api/emails/subscribers` | Admin | List subscribers |

---

## Seed Credentials (after `npm run seed`)
```
Admin:       admin@seniorly.com    /  Admin@123456
Instructor:  mukul@seniorly.com    /  Instructor@123
Student:     aman@example.com      /  Student@123
```

## Project Structure
```
seniorly-backend/
├── server.js                  ← Entry point
├── config/db.js               ← MongoDB connection
├── middleware/auth.js         ← JWT protect + role guard
├── models/
│   ├── User.js
│   ├── Webinar.js             ← Free published webinars
│   ├── Session.js             ← Upcoming paid sessions
│   ├── Enrollment.js          ← Webinar + Session enrollments
│   ├── EmailSubscription.js   ← Newsletter subscribers
│   └── CourseNotification.js  ← Notify Me requests
├── routes/
│   ├── userRoutes.js
│   ├── webinarRoutes.js
│   ├── sessionRoutes.js
│   ├── enrollmentRoutes.js
│   └── emailRoutes.js
├── utils/emailService.js      ← Nodemailer HTML email templates
├── scripts/seedData.js        ← Seed DB with sample data
├── .env.example
├── Dockerfile
└── docker-compose.yml
```
