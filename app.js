console.log('\n');
console.log(' - Robot(J)s application -');
console.log('\n');

/**
 * Global vars initializing
 **/
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var colors = require('colors');

var app = express();

/**
 * view engine setup
 **/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

/**
 * catch 404 and forward to error handler
 **/
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* ERROR HANDLERS  */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * production error handler
 * no stacktraces leaked to user
 **/
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


/* END ERROR HANDLERS  */

module.exports = app;
var server = app.listen(3000);

/**
 * Socket.io initializing
 **/
dispLoading('Socket.io');

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
	console.log('A new user connected!');
	socket.emit('info', { msg: 'The world is round, there is no up or down.' });
	socket.broadcast.emit('new user', { msg: 'A new player is coming.' });
});

/**
 * Robot(J)s library initializing
 **/
dispLoading('Robot(J)s library');

var robotlibz = require('Robot(J)s'),
	test = robotlibz.test;

/**
 * End
 **/
console.log('\n\n < Robot(J)s server listening on port 3000 >\n\n');

function dispLoading(package){
	console.log(' 	* Package ' + package.green + ' loading');
}
