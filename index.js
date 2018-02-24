//express microweb server
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser'); //parsing data
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));

//setup handlebars
var exphbs = require('express-handlebars');
app.engine('.hbs', exphbs({ defaultLayout: '', extname: '.hbs' }));

//handling static resources
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, function () {
  console.log('web server started on port 3000...');
});

//get request
app.get("/", function (req, res) {
  getBucketList(req, res);
});

//get request
app.get("/images/:id", function (req, res){
  var params = {
    Bucket: req.params.id,
    Prefix: 'image'
  };
  s3.listObjectsV2(params, function (err, data) {
    if (err) console.log(Err);

    var imageList = data.Contents;
    var bucket = data.Name;
    res.render('images.hbs',
      {
        imageList: imageList,
        bucket: bucket
      });

  });
});

//post request
app.post("/", function (req, res) {
  uploadImage(req, res);
});

// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var fs = require('fs');

//create s3 client
var s3 = new AWS.S3();

//get all buckets
function getBucketList(req, res) {
  s3.listBuckets(function (err, data) {
    if (err) console.log(err);

    bucketList = data.Buckets;
    //render page
    res.render('index.hbs',
      {
        bucketList: bucketList
      });
  });
}

//upload image to s3 bucket
function uploadImage(req, res) {
  var str = String(req.body.my_image);
  buf = new Buffer(str.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  var params = {
    Key: 'image' + uuid.v4() + '.jpg',
    Body: buf,
    Bucket: req.body.my_bucket,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
    ACL: 'public-read'
  };

  s3.upload(params, function (err, data) {
    if (err) console.log(err); // an error occurred   
    res.redirect("/images/" + data.Bucket);
  });
}