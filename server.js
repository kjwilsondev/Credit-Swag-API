require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

app.use(cors());

// Database connection
mongoose.connect('mongodb://localhost/credit-swag-db', { useNewUrlParser: true });
require('./data/credit-swag-db');

app.use(methodOverride('_method')) // override with POST having ?_method=DELETE or ?_method=PUT

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', (req, res) => {
  res.json('Welcome to the Credit Swag API')
});

// controllers
const auth = require('./controllers/auth');
// const checkAuth = require('./middleware/checkAuth')
// checkAuth();
auth(app);

app.listen(process.env.PORT || 5000)
// app.listen(port); // for heroku
module.exports = { app }
