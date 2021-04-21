const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('../middlewares/cors');
const posts = require('../routes/post.route');
const { base_url } = require('../../keys');

module.exports = app => {

  // Middlewares
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use('/images', express.static(path.join(__dirname, '../images')));

  if ( process.env.NODE_ENV === 'development' ) {
    app.use(morgan('tiny'));
  }

  // Routes
  app.use(`/${base_url}/posts`, [ cors ], posts);

  return app;
}
