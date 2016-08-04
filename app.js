var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var indexRoutes = require('./routes/index');
var logoutRoutes = require('./routes/logout');
var loginRoutes = require('./routes/login');
var settingsRoutes = require('./routes/settings');
var remindersRoutes = require('./routes/reminders');
var thoughtsRoutes = require('./routes/thoughts');
var usersRoutes = require('./routes/users');
var sessionsRoutes = require('./routes/sessions');
var client = require('twilio')('AC96c96b8e15e82b2df817ec6db352ffdb', '7e8aa5532ab8c8a0ffe8267ddf8b4861');
var models = require('./models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// database
mongoose.connect('mongodb://localhost/thunk');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRoutes);
app.use('/logout', logoutRoutes);
app.use('/login', loginRoutes);
app.use('/settings', settingsRoutes);
app.use('/reminders', remindersRoutes);
app.use('/thoughts', thoughtsRoutes);
app.use('/users', usersRoutes);
app.use('/sessions', sessionsRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      layout: 'no-javascript',
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    layout: 'no-javascript',
    message: err.message,
    error: {}
  });
});

app.get('/', function(req, res) {
})

// sms messaging
setInterval(function(){
  models.Users.find({}, function (error, userDocs) {
    userDocs.forEach(function (userDoc, index, userDocs) {
      models.Thoughts.find({ userId: userDoc._id }, function (error, thoughtDocs) {
        var randomInt = Math.round(Math.random() * thoughtDocs.length);
        console.log('thoughtDocs', thoughtDocs);
        console.log('int', randomInt);
        var thoughtDoc = thoughtDocs[randomInt];
        var recipientPhoneNumber = '+1' + userDoc.phoneNumber;

        // if user has no thoughts, prompt them to put some in
        if (thoughtDoc === undefined) {
          thoughtDoc = {};
          thoughtDoc.content = 'Record a great thought soon!';
        }

          client.sendMessage({
            to: recipientPhoneNumber, // Any number Twilio can deliver to
            from: '+15039856951', // A number you bought from Twilio and can use for outbound communication
            body: thoughtDoc.content // body of the SMS message
          }, function(err, responseData) {
            console.log('error', err);
            if (!err) {
            }
          });
      });
    });
  });
}, 7700000);

module.exports = app;
