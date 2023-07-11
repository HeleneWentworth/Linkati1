var express = require('express');
var app = express();

// Add CORS headers
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Rest of your server code

app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
