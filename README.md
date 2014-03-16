mean-shadow
===========

This module goes hand in hand with the mean.io stack and allows any mean app to have endpoints to add/remove entities from any third party app.

MEAN is a fullstack javascript platform for modern web applications.
MEAN stands for MongoDB, ExpressJS, AngularJS and Node.js.
You can find it and all the details regarding it in:
http://www.mean.io/

After installing this module you should require it by doing:
var meanShadow = require('../node_modules/mean-shadow')(app, auth);

Then in order to add your own logic you can catch a shadow event by doing:
meanShadow.events.on('insert', function(data) {
  // Do some cool and MEAN stuff
});
