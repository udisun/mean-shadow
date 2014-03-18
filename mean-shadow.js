var mongoose = require('mongoose'),
    _ = require('lodash'),
    db = mongoose.connections[0].db,
    EventEmitter = require('events').EventEmitter,
    shadowEvents = new EventEmitter();

var collections = {};

module.exports = function (app, options) {
    var meanShadow = {
        events: shadowEvents,
        insert: function (req, res) {
            var name = req.params.type;
            var query = {};
            query[req.params.id] = req.params.val;

            var Collection = getCollection(name);

            Collection.findOne(query, function (err, doc) {
                if (err) {
                    res.send(err);
                }
                else if (doc) {
                    compare(doc, req.body, function (equals) {
                        if (!equals) {
                            doc = _.assign(doc, req.body);
                            Collection.save(doc, function (err, doc) {
                                shadowEvents.emit('update', {
                                    data: req.body,
                                    error: err
                                });

                                res.send({
                                    err: err,
                                    doc: doc
                                });
                            });
                        } else {
                            shadowEvents.emit('update', {
                                data: req.body,
                                error: "exists"
                            });

                            res.send("equals");
                        }
                    });
                } else {
                    Collection.save(req.body, function (err, doc) {
                        shadowEvents.emit('insert', {
                            data: req.body,
                            error: err
                        });

                        res.send({
                            err: err,
                            doc: doc
                        });
                    });
                }
            });
        },

        remove: function (req, res) {
            var name = req.params.type;
            var query = {};
            query[req.params.id] = req.params.val;

            var Collection = getCollection(name);
            Collection.remove(query, function (err) {
                if (err) {
                    res.send(err);
                }

                shadowEvents.emit('remove', {
                    data: query
                });
            });
        }
    };

    if (options) {
      if (options.disableAuth) {
        app.post('/insert/:type/:id/:val', meanShadow.insert);
        app.del('/delete/:type/:id/:val', meanShadow.remove);
      }
      else if (options.authMiddleware) {
        app.post('/insert/:type/:id/:val', options.authMiddleware, meanShadow.insert);
        app.del('/delete/:type/:id/:val', options.authMiddleware, meanShadow.remove);
      }
      else {
	console.log("****************************************");
        console.log("**                                    **");
        console.log("**              WARNING               **");
        console.log("**      Authorization is disabled     **");
        console.log("** Make sure to pass auth middleware  **");
        console.log("**     When you require mean-shadow   **");
        console.log("**                                    **");
        console.log("****************************************");
      }
    }

    return meanShadow;
};

function compare(a, b, callback) {
    var temp = {
        a: {},
        b: {}
    };

    temp.a._id = a._id;
    temp.a._v = a._v;
    temp.b._id = b._id;
    temp.b._v = b._v;

    delete a._id;
    delete a._v;

    delete b._id;
    delete b._v;

    var equals = _.isEqual(a, b);

    if (temp.a._id) {
        a._id = temp.a._id;
    }
    if (temp.a._v !== 'undefined') {
        a._v = temp.a._v;
    }
    if (temp.b._id) {
        b._id = temp.b._id;
    }
    if (temp.b._v !== 'undefined') {
        b._v = temp.b._v;
    }

    if (!callback) {
        return equals;
    }

    return callback(equals);
}

function getCollection(name) {
    if (!collections[name]) {
        collections[name] = db.collection(name);
    }

    return collections[name];
}
