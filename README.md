mean-shadow
===========

This module goes hand in hand with the mean.io stack and allows any mean app to have endpoints to add/remove entities from any third party app.

MEAN is a fullstack javascript platform for modern web applications.
MEAN stands for MongoDB, ExpressJS, AngularJS and Node.js.
You can find it and all the details regarding it in:
http://www.mean.io/

After installing this module you should require it by doing:
```JavaScript
var options = {
  disableAuth: false,
  authMiddleware: auth.myNewAuthMiddleware
};
var meanShadow = require('../node_modules/mean-shadow')(app, options);
```
The options object should include "authMiddleware" which is a new middleware you should create inside of the app/routes/middlewares/authorization.js file.
If you need to disable the authorization which is a BAD IDEA, just pass "disableAuth: true".

Then in order to add your own logic you can catch a shadow event by doing:
```JavaScript
meanShadow.events.on('insert', function(data) {
  // Do some cool and MEAN stuff
});
```

Thanks to the author Orit Persik for creating this.
