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

/*
+++++++++++++++++
+    MONGODB    +
+++++++++++++++++
*/

// Connection a MongoDB
mongoose.connect('mongodb://localhost/MarkerApp');

var entrySchema = new mongoose.Schema({
	rid : String, // random id
	img : String, // Name of the marker
	createDate : { type: Date, default: Date.now }, // Creation date
	ips : [{
		ip: String,
		date : { type: Date, default: Date.now },
		mail : String
	}], // List of IPs
	userMail : String // User Mail
});

// Modele
var Entry = mongoose.model('marker', entrySchema);

// Create a new entry
function setEntry(rid, img, userMail) {
	var userMail = userMail || "";
	var entry = new Entry({rid : rid, img : img, ips : [], userMail : userMail });
	entry.save(function(err){
		if(err){
			console.log(err);
		}
		else{
			console.log(entry);
		}
	});
}

// Add ip to an entry
function addIpEntry(rid) {
  Entry.findOneAndUpdate({rid : rid}, { $addToSet : {ips : { ip : "0.0.0.0"}}}, function(err,doc) {
    if (err) { console.log("Error update"); }
    console.log(doc);
  });
}

// Set img to an entry
function setImgEntry(rid,img) {
  Entry.findOneAndUpdate({rid : rid}, { $set : {img : img} }, function(err, doc) {
    if (err) { console.log("Error update"); }
    console.log(doc);
  });
}

// Set userMail to an entry
function setUMEntry(rid, UM) {
  Entry.findOneAndUpdate({rid : rid}, { $set : {userMail : UM} }, function(err, doc) {
    if (err) { console.log("Error update"); }
    console.log(doc);
  });
}



// Select an entry
function getEntry(rid,field) {
  Entry.findOne({rid : rid}, function (err, e) {
    if (err) return handleError(err);
    console.log(e[field]); // Space Ghost is a talk show host.
  });
}



/*
+     TEST     +
*/


getEntry("test","img");
setImgEntry("test","yolo2");
getEntry("test","img");
//addIpEntry("test");
//getEntry("test");

//setEntry("test","img1");

/*
+++++++++++++++++
+      WEB      +
+++++++++++++++++
*/

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

// marker route
app.get('/i/:img', function(req, res) {
	try {
 	 res.sendFile(path.join(__dirname + '/upload/'+req.params.img));
	} catch (e) {
	  res.send(req.params.img+"doesn't exist !");
	}
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

function checkIfFile(file, cb) {
  fs.stat(file, function fsStat(err, stats) {
    if (err) {
      if (err.code === 'ENOENT') {
        return cb(null, false);
      } else {
        return cb(err);
      }
    }
    return cb(null, stats.isFile());
  });
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