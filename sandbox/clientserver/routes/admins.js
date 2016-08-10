/* Mock Admins API.
--------------------------------------*/

// Export.
module.exports = function (environment) {
    'use strict';

    var fakeOrganizationUsersPaginated = require('./orgUsersPaginated.json');

    /**
     * Method for getting a list of admins
     */
    environment.express.route('/api/admins')
        .get(function (req, res, next) {
            if (req.session && req.session.user) {
                res.status(200).send(fakeOrganizationUsersPaginated);
            } else {
                res.status(200).send({});
            }
        });

    environment.express.route('/api/admins')
        .post(function (req, res, next) {
            if (req.session && req.session.user) {
                res.status(200).send({'status': 200});
            } else {
                res.status(200).send({});
            }
        });

    environment.express.route('/api/admins')
        .delete(function (req, res, next) {
            if (req.session && req.session.user) {
                res.status(200).send({'status': 200});
            } else {
                res.status(200).send({});
            }
        });

    return environment;
};
