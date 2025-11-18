// server.js
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- DB pool ---
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'clients',
  waitForConnections: true,
  connectionLimit: 10,
});

// --- Nodemailer transporter ---
// Use proper SMTP credentials or service (Gmail app password, SendGrid, Mailgun, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465,
  secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
  auth: {
    user: process.env.SMTP_USER, // e.g. your-email@gmail.com
    pass: process.env.SMTP_PASS, // app password or SMTP password
  }
});

// Helper: hash token for storing in DB
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ---------- Endpoints ----------

// Admin login (your existing)
app.post('/auth/adminlogin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM admin WHERE email = ?', [email]);
    if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    // create session or JWT here — placeholder:
    return res.json({ message: 'Login success', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 1) Forgot password - request reset link
app.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const [rows] = await pool.query('SELECT id, email FROM admin WHERE email = ?', [email]);
    if (!rows.length) {
      // For security, respond with success even if email not found
      return res.json({ message: 'If the email exists, a reset link has been sent.' });
    }
    const user = rows[0];

    // generate token
    const tokenRaw = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(tokenRaw);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // remove old tokens for this user (optional)
    await pool.query('DELETE FROM password_resets WHERE user_id = ?', [user.id]);

    // insert hashed token
    await pool.query(
      'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, tokenHash, expiresAt]
    );

    // prepare reset link (frontend route)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${tokenRaw}&email=${encodeURIComponent(user.email)}`;

    // send email
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 1 hour.`,
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <p><a href="${resetLink}">Reset Password</a></p>
             <p>This link will expire in 1 hour.</p>`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: 'If the email exists, a reset link has been sent.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// 2) Validate token (optional endpoint used by frontend to check token)
app.post('/auth/validate-token', async (req, res) => {
  const { token, email } = req.body;
  try {
    if (!token || !email) return res.status(400).json({ valid: false });

    // find user id by email
    const [users] = await pool.query('SELECT id FROM admin WHERE email = ?', [email]);
    if (!users.length) return res.status(400).json({ valid: false });
    const userId = users[0].id;

    const tokenHash = hashToken(token);
    const [rows] = await pool.query(
      'SELECT * FROM password_resets WHERE user_id = ? AND token_hash = ? AND expires_at > NOW()',
      [userId, tokenHash]
    );
    if (!rows.length) return res.json({ valid: false });

    return res.json({ valid: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ valid: false });
  }
});

// 3) Reset password (submit new password)
app.post('/auth/reset-password', async (req, res) => {
  const { token, email, newPassword } = req.body;
  try {
    if (!token || !email || !newPassword) return res.status(400).json({ message: 'Invalid data' });

    // find user
    const [users] = await pool.query('SELECT id FROM admin WHERE email = ?', [email]);
    if (!users.length) return res.status(400).json({ message: 'Invalid token or user' });
    const userId = users[0].id;

    const tokenHash = hashToken(token);
    const [rows] = await pool.query(
      'SELECT * FROM password_resets WHERE user_id = ? AND token_hash = ? AND expires_at > NOW()',
      [userId, tokenHash]
    );
    if (!rows.length) return res.status(400).json({ message: 'Invalid or expired token' });

    // hash new password and update
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE admin SET password = ? WHERE id = ?', [passwordHash, userId]);

    // delete used token(s)
    await pool.query('DELETE FROM password_resets WHERE user_id = ?', [userId]);

    return res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
