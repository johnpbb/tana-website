require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Gmail SMTP Transporter ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('⚠️  SMTP connection failed:', error.message);
  } else {
    console.log('✅  Gmail SMTP connected — ready to send emails');
  }
});

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Tana Music Fiji — Premium Island Studio',
    success: null
  });
});

// Contact form POST route
app.post('/contact', async (req, res) => {
  const { name, email, service, message } = req.body;

  // Log to console
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📩  New Contact Submission');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Service: ${service}`);
  console.log(`Message: ${message}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Build the HTML email
  const serviceLabels = {
    production: 'Full Production',
    vocals: 'Vocal Sessions',
    mastering: 'Final Mastering',
    mixing: 'Mixing',
    liveband: 'Live Band',
    other: 'Other / Custom Package'
  };

  const htmlEmail = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #09090b; color: #fafafa; border-radius: 16px; overflow: hidden;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #18181b 0%, #09090b 100%); padding: 32px; text-align: center; border-bottom: 2px solid #ef4444;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">🎵 TANA MUSIC</h1>
        <p style="margin: 8px 0 0; font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.1em;">New Contact Form Submission</p>
      </div>

      <!-- Body -->
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; width: 120px; vertical-align: top;">Name</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #fafafa; font-size: 15px; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Email</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #fafafa; font-size: 15px;"><a href="mailto:${email}" style="color: #ef4444; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Service</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #27272a; color: #fafafa; font-size: 15px;">
              <span style="display: inline-block; background: rgba(239,68,68,0.15); color: #ef4444; padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 600;">${serviceLabels[service] || service}</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #71717a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; color: #e4e4e7; font-size: 15px; line-height: 1.7;">${message.replace(/\n/g, '<br>')}</td>
          </tr>
        </table>

        <!-- Reply Button -->
        <div style="margin-top: 28px; text-align: center;">
          <a href="mailto:${email}?subject=Re: Tana Music — ${serviceLabels[service] || service}" style="display: inline-block; background: #ef4444; color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #18181b; padding: 20px 32px; text-align: center; border-top: 1px solid #27272a;">
        <p style="margin: 0; font-size: 12px; color: #52525b;">Sent from Tana Music website contact form</p>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Tana Music Website" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: `🎵 New Enquiry: ${serviceLabels[service] || service} — ${name}`,
      html: htmlEmail,
      text: `New contact from ${name} (${email})\nService: ${serviceLabels[service] || service}\nMessage: ${message}`
    });

    console.log('✅  Email sent successfully to', process.env.ADMIN_EMAIL);

    res.render('index', {
      title: 'Tana Music Fiji — Premium Island Studio',
      success: 'Your message has been sent! We\'ll be in touch soon. 🤙'
    });
  } catch (err) {
    console.error('❌  Failed to send email:', err.message);

    res.render('index', {
      title: 'Tana Music Fiji — Premium Island Studio',
      success: 'Something went wrong sending your message. Please email us directly at tanamusicfiji@gmail.com'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('index', {
    title: 'Tana Music Fiji — Page Not Found',
    success: null
  });
});

app.listen(PORT, () => {
  console.log(`\n🎵  Tana Music Fiji is live at http://localhost:${PORT}\n`);
});
