const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
app.post('/contact', (req, res) => {
  const { name, email, service, message } = req.body;

  // Log the contact submission (in production, you'd store in DB or send email)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📩  New Contact Submission');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Name:    ${name}`);
  console.log(`Email:   ${email}`);
  console.log(`Service: ${service}`);
  console.log(`Message: ${message}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  res.render('index', {
    title: 'Tana Music Fiji — Premium Island Studio',
    success: 'Your message has been received. We\'ll be in touch soon. 🤙'
  });
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
