var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload')
var db = require('./config/connection')
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var session = require('express-session')
const fs = require("fs");


var app = express();

var hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials'
}))



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:'key',cookie:{maxAge:600000}}))


db.connect(() => { console.log('driver connected'); })

app.use('/admin', adminRouter);

app.use('/', usersRouter);

module.exports = app;
