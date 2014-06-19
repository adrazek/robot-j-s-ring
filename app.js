/*
console.log("                 ___.           __       ___      ____. ___             ");
console.log("    _______  ____\_ |__   _____/  |_    /  /     |    | \  \     ______ ");
console.log("    \_  __ \/  _ \| __ \ /  _ \   __\  /  /      |    |  \  \   /  ___/ ");
console.log("     |  | \(  <_> ) \_\ (  <_> )  |   (  (   /\__|    |   )  )  \___ \  ");
console.log("     |__|   \____/|___  /\____/|__|    \  \  \________|  /  /  /____  > ");
console.log("	                   \/                \__\            /__/        \/ ");
*/
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

var moment = require('moment');

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
 * Robot(J)s library initializing
 **/
dispLoading('Robot(J)s library');

var robotlibz = require('Robot(J)s');
var io = robotlibz.listen(server);

var robotService = robotlibz.getRobotService();
var ringService = robotlibz.getRingService();
var teamService = robotlibz.getTeamService();

var bots = {};

var teams = {};
var teamBots = {};

var rings = {};
//rings.push(ringService.create({name: 'first', width: 100, height: 100}));

io.sockets.on('connection', function (socket) {

	socket.emit('info', { msg: '\n\n 	Ok you are connected to Robot(J)s' });

	var moment = require('moment');
	console.log('[' + moment().format() + '] ' + 'new connection');

	var team = teamService.create({id: socket.id});
	teams[socket.id] = team;
	teamBots[team.getId()] = {};
	
	console.log('[' + moment().format() + '] ' + 'team ' + team.getId().yellow + ' created');

	socket.on('info', function(data, fn){
		
	});

	socket.on('team info', function(data, fn){

	});

	socket.on('ring list', function(data, fn){
		console.log(data);
		console.log('[' + moment().format() + '] ' + 'ring list'.green);
		fn({rings: rings});
	});

	socket.on('ring create', function(data, fn){
		var ring = ringService.create(data);
		ring.setTeamOwner(team);
		rings[ring.getName()] = ring;
		console.log('[' + moment().format() + '] ' + 'ring ' + ring.getName().yellow + '[' + ring.getWidth() + ', ' + ring.getHeight() + ']' + ' created');
		fn({ring: ring});
	});

	socket.on('ring join', function(data, fn){
		var bot = teamBots[team.getId()][data.bot];
		rings[data.ring].addBot(bot);
		console.log('[' + moment().format() + '] ' + 'robot ' + bot.getName().yellow + ' has joined the ring ' + data.ring.blue + ' !'); 
		fn({bot: bot, ring: rings[data.ring]});
	});

	socket.on('ring launch', function(data, fn){
		var ring = rings[data.ring];
		var sockets = {};
		for(var i in ring.getBots())
			sockets[i] = {bot: ring.getBots()[i], socket: bots[i].socket};
		ringService.launch(ring, sockets);
		console.log('[' + moment().format() + '] ' + 'ring ' + ring.getName().yellow + ' has been launched !'); 
		fn({ring: ring});
	});

	socket.on('robot create', function(data, fn){
		var bot = robotService.create(data);
		bot.setTeamOwner(team);
		bots[bot.getName()] = {bot: bot, socket: socket};
		teamBots[team.getId()][bot.getName()] = bot;

		console.log('[' + moment().format() + '] ' + 'robot ' + bot.getName().yellow + ' from team ' + team.id.yellow + ' created');
		fn({bot: bot});

	});
});

/**
 * End
 **/
console.log('\n\n < Robot(J)s server listening on port 3000 >\n\n');
console.log('\t- now let the application speak : \n'.blue);

function dispLoading(package){
	console.log(' 	* Package ' + package.green + ' loading');
}

function dispTsLog(log){
	console.log('[' + moment().format() + '] ' + log.yellow);
}
