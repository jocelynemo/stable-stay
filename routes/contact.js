import { Router } from 'express';
import nodemailer from 'nodemailer';
import { dbConnection } from '../config/mongoConnection.js';

const router = Router();

// Reuse a single transporter for the lifetime of the process
let _transporter = null;

function getTransporter() {
  if (_transporter) {
    return _transporter;
  }
  _transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  return _transporter;
}

router.post('/', async (req, res) => {
  const { firstName, lastName, email, subject, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
  }

  // Save to MongoDB (best-effort — never blocks the response)
  try {
    const db = await dbConnection();
    await db.collection('contacts').insertOne({
      firstName: String(firstName).trim(),
      lastName:  String(lastName).trim(),
      email:     String(email).trim(),
      subject:   String(subject || '').trim(),
      message:   String(message).trim(),
      createdAt: new Date()
    });
  } catch (_) {
    console.log(`[Contact] DB save failed — ${firstName} ${lastName} <${email}>`);
  }

  // Send email to support inbox
  const credentialsConfigured =
    process.env.MAIL_USER &&
    process.env.MAIL_PASS &&
    process.env.MAIL_PASS !== 'your_app_password_here';

  if (credentialsConfigured) {
    try {
      const transporter = getTransporter();
      await transporter.sendMail({
        from:     `"StableStay Contact" <${process.env.MAIL_USER}>`,
        to:       process.env.MAIL_USER,
        replyTo:  email,
        subject:  subject ? `[Contact] ${subject}` : '[Contact] New message from website',
        text: [
          `Name:    ${firstName} ${lastName}`,
          `Email:   ${email}`,
          `Subject: ${subject || '(none)'}`,
          '',
          message
        ].join('\n'),
        html: `
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject || '(none)'}</p>
          <hr/>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      });
    } catch (mailErr) {
      console.error('[Contact] Email send failed:', mailErr.message);
    }
  } else {
    console.log(`[Contact] Email not sent — MAIL_PASS not configured. Message from ${firstName} ${lastName} <${email}>: ${message}`);
  }

  res.json({ success: true });
});

export default router;
