/* eslint-disable */

const withImages = require('next-images');

module.exports = withImages({
  images: {
    domains: ['firebasestorage.googleapis.com'], // Add your image domain(s) here
  }
});
