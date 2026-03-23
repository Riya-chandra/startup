const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body { margin:0; padding:0; background:#f3f2ef; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; color:#0f0f0f; }
  .wrap { max-width:560px; margin:40px auto; background:#fafaf8; border:1px solid #e2e1dd; border-radius:16px; overflow:hidden; }
  .header { background:#0f0f0f; padding:28px 36px; }
  .header-logo { font-size:20px; color:#fafaf8; font-weight:700; letter-spacing:-0.3px; }
  .header-logo span { font-style:italic; }
  .body { padding:36px; }
  .footer { padding:20px 36px; border-top:1px solid #e2e1dd; font-size:12px; color:#9a9a9a; }
  h1 { font-size:22px; font-weight:700; margin:0 0 12px; letter-spacing:-0.02em; }
  p  { font-size:14px; line-height:1.7; color:#6b6b6b; margin:0 0 16px; }
  .btn { display:inline-block; padding:11px 24px; background:#0f0f0f; color:#fafaf8 !important; border-radius:50px; font-size:14px; font-weight:500; text-decoration:none; margin:8px 0 20px; }
  .divider { height:1px; background:#e2e1dd; margin:20px 0; }
  .badge { display:inline-block; padding:3px 12px; border-radius:50px; font-size:11px; font-weight:600; letter-spacing:0.05em; text-transform:uppercase; }
  .badge-green { background:#eaf4ee; color:#2d6a4f; border:1px solid #b7dfca; }
  .badge-amber { background:#fdf3dc; color:#c8820a; border:1px solid #f0d090; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="header-logo"><span>S</span>eniorly</div></div>
  <div class="body">${content}</div>
  <div class="footer">
    © 2026 Seniorly · <a href="{{CLIENT_URL}}/unsubscribe" style="color:#9a9a9a">Unsubscribe</a>
  </div>
</div>
</body>
</html>
`;

// ── Individual email senders ────────────────────────────────────────────────

exports.sendWelcomeEmail = async ({ email, firstName }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Seniorly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to Seniorly, ${firstName}!`,
    html: baseTemplate(`
      <h1>Welcome, ${firstName} 👋</h1>
      <p>You're now part of a community of 50,000+ learners building real-world skills.</p>
      <a href="${process.env.CLIENT_URL}/courses" class="btn">Browse courses →</a>
      <div class="divider"></div>
      <p style="font-size:13px;">Need help getting started? Reply to this email — we read every one.</p>
    `),
  });
};

exports.sendVerificationEmail = async ({ email, firstName, verifyUrl }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Seniorly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your Seniorly account',
    html: baseTemplate(`
      <h1>Verify your email</h1>
      <p>Hi ${firstName}, click below to verify your account. This link expires in 24 hours.</p>
      <a href="${verifyUrl}" class="btn">Verify email →</a>
      <div class="divider"></div>
      <p style="font-size:12px;color:#9a9a9a;">If you didn't create an account, you can safely ignore this email.</p>
    `),
  });
};

exports.sendPasswordResetEmail = async ({ email, firstName, resetUrl }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Seniorly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your Seniorly password',
    html: baseTemplate(`
      <h1>Reset your password</h1>
      <p>Hi ${firstName}, you requested a password reset. This link expires in 1 hour.</p>
      <a href="${resetUrl}" class="btn">Reset password →</a>
      <div class="divider"></div>
      <p style="font-size:12px;color:#9a9a9a;">If you didn't request this, ignore this email — your password won't change.</p>
    `),
  });
};

exports.sendEnrollmentConfirmation = async ({ email, firstName, courseTitle, courseUrl }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Seniorly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `You're enrolled: ${courseTitle}`,
    html: baseTemplate(`
      <h1>You're in! 🎓</h1>
      <p>Hi ${firstName}, your enrollment in <strong>${courseTitle}</strong> is confirmed.</p>
      <a href="${courseUrl}" class="btn">Start learning →</a>
      <div class="divider"></div>
      <p style="font-size:13px;">Access your course any time from your dashboard. Your progress is saved automatically.</p>
    `),
  });
};

exports.sendCertificateEmail = async ({ email, firstName, courseTitle, certificateUrl }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Seniorly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your certificate is ready — ${courseTitle}`,
    html: baseTemplate(`
      <h1>Course complete! 🏆</h1>
      <p>Congratulations ${firstName}. You've completed <strong>${courseTitle}</strong>.</p>
      <a href="${certificateUrl}" class="btn">Download certificate →</a>
      <div class="divider"></div>
      <p style="font-size:13px;">Share your achievement on LinkedIn to let the world know about your new skills.</p>
    `),
  });
};

exports.sendNewsletterConfirmation = async ({ email, confirmUrl }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Seniorly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Confirm your Seniorly newsletter subscription',
    html: baseTemplate(`
      <h1>One more step</h1>
      <p>Click below to confirm your subscription. You'll get new courses, free resources, and early-bird offers.</p>
      <a href="${confirmUrl}" class="btn">Confirm subscription →</a>
      <div class="divider"></div>
      <p style="font-size:12px;color:#9a9a9a;">No spam, ever. Unsubscribe any time.</p>
    `),
  });
};

exports.sendCourseNotificationAlert = async ({ email, courseTitle, courseUrl, launchDate }) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Seniorly" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Just launched: ${courseTitle}`,
    html: baseTemplate(`
      <h1>It's live! 🚀</h1>
      <p>You asked to be notified — <strong>${courseTitle}</strong> is now available.</p>
      ${launchDate ? `<p style="font-size:13px;">Launched: ${launchDate}</p>` : ''}
      <a href="${courseUrl}" class="btn">View course →</a>
    `),
  });
};
