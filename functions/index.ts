

const { https } = require('firebase-functions');
const { next } = require('next');

const isDev = process.env.NODE_ENV !== 'production';
const app = next({ dev: isDev, conf: { distDir: 'next' } });
const handle = app.getRequestHandler();

// Prepare the Next app and then export the function
app.prepare().then(() => {
  exports.nextApp = https.onRequest((req, res) => handle(req, res));
});
