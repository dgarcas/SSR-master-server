var express = require('express');
var router = express.Router();
var fs = require('fs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ejemplo servidor SSR' });
});

router.get('/record', function(req, res, next) {
	var now = new Date();
var logfile_name = __dirname+'/../public/logs/' + now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate() +'.csv'
fs.appendFile(logfile_name, req.query.id+';'+now.getTime()+";"+req.query.data+"\r\n", function (err) {
    if (err) throw err;
    console.log("Saving: "+req.query.id+';'+now.getTime()+";"+req.query.data+" in: "+logfile_name);
});

  //res.render('index', { title: 'Express' });
  res.send("Saving: "+req.query.id+';'+now.getTime()+";"+req.query.data+" in: "+logfile_name);
});


module.exports = router;
