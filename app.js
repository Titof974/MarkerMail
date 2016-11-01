/*
+
+ MARKER by Jean-Christophe Lan-Yan-Fock
+ Contact : lanyanfockchristophe@gmail.com
+
*/

// Load libraries
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var fs = require("fs");
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path');

// Allow cross origin request
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Test redirection
app.get('/', function(req,res,next){
	console.log("redirect...");
	res.redirect("/r/"+randomString(12));
});

// Static route
app.use(express.static('public'));
app.use(bodyParser.json()); 

// Multer disk storage settings
var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './upload/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
});

// Multer setting
var upload = multer({
                    storage: storage
}).single('file');

// Load index for random id
app.get('/r/:id', function(req, res){
	res.sendFile(path.join(__dirname + '/public/index.html'));
});


// upload route
app.post('/upload', function(req, res) {
		console.log("UPLOAD");
        upload(req,res,function(err){
            if(err){
            	console.log("Error ! ");
            	console.log(err);
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        });
});

// Server
var server = app.listen(21027, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})

// Utils

// Generate random string
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

/*// Connection a MongoDB
mongoose.connect('mongodb://nyu.moe/MarkerApp');

// Create schema
var EntrySchema = new mongoose.Schema({
  ip: String,
  date: { type: Date, default: Date.now },
});

// Create a model based on the schema
var Entry = mongoose.model('Test', EntrySchema);

function setEntry(ip) {
   var entry = new Entry({ip: ip});
   entry.save(function(err){
     if(err)
       console.log(err);
     else
       console.log(entry);
   });
}

function listEntry() {
   Entry.find(function (err, entries) {
     if (err) return console.error(err);
     console.log(entries)
   });
}

app.use(express.static('public'));

app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

app.get('/style.css', function (req, res) {
   res.sendFile( __dirname + "/" + "style.css" );
})

app.get('/signature.png', function (req, res) {
   res.sendFile( __dirname + "/" + "signature.png" );
})

app.get('/entries', function(req,res) {
   Entry.find(function (err, e) {
    if (err) return next(err);
    res.json(e);
  });
})

app.get('/signatureM.png', function (req, res) {
   // Get ip
   var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
   console.log("["+Date.now()+"]"+ip);
   setEntry(ip);
   res.sendFile( __dirname + "/" + "signature.png" );
})

var server = app.listen(21027, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)

})*/