var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var serveIndex = require('serve-index');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cluster = require('cluster');

var app = express();

const ipfilter = require('express-ipfilter').IpFilter
const ips = ['::ffff:127.0.0.1/24']
app.use(ipfilter(ips, { mode: 'allow' }))

//const numCPUs = require('os').cpus().length;
const numCPUs = 2

console.log("numCPUs: ", numCPUs)

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) { cluster.fork(); }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {


  // view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');


  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  app.use('/logs', serveIndex(path.join(__dirname, 'public/logs'))); // shows you the file list
  app.use('/logs', express.static(path.join(__dirname, 'public/logs'))); // serve the actual files

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  app.listen(3000, () => {
    console.log(`Server is running`);
  });

  module.exports = app;
}