/* Mock Groupings API.
 --------------------------------------*/

// Export.
module.exports = function (environment) {
    'use strict';

    var fakeGroupingsData = require('./groupings.json'),
        fakeGroupingsPaginated1 = require('./groupingsPaginated.json'),
        // fakeGroupingsPaginated2 = require('./groupingsPaginated2.json'),
        fakeOrgUsersData = require('./orgUsers.json');

    /**
     * Method for querying the groupings list
     */
    environment.express.route('/api/groupings?:query')
        .get(function (req, res, next) {
            if (req.session && req.session.user) {
                //inspect 'query' param, and if not forcing zero-state return mock data
                if (req.query.query !== '!zero') {
                    res.status(200).send({'data': fakeGroupingsData, 'total': fakeGroupingsData.length});
                } else {
                    res.status(200).send([]);
                }
            } else {
                res.status(401);
            }
        });

    /**
     * Method for getting detailed grouping info on a single grouping whose id matches the parameter
     */
    environment.express.route('/api/groupings/:groupingId')
        .get(function (req, res, next) {
            var fakeGrouping = fakeGroupingsData.filter(function (g) {
                return g.id === req.params.groupingId;
            }).slice()[0];

            if (!fakeGrouping) {
                res.status(404);
            } else {
                fakeGrouping.basisMemberIds = fakeOrgUsersData.slice(0, 16);
                fakeGrouping.ownerMemberIds = fakeOrgUsersData.slice(5, 10);
                fakeGrouping.includedMemberIds = fakeOrgUsersData.slice(16, 22);
                fakeGrouping.excludedMemberIds = fakeOrgUsersData.slice(22, 30);

                fakeGrouping.options = {
                    canAddSelf: false,
                    canRemoveSelf: true,
                    includeInListServe: true
                };

                res.status(200).send(fakeGrouping);
            }
        });

    environment.express.route('/api/groupings/:groupingId/members/add')
        .post(function (req, res, next) {
            if (req.session && req.session.user) {
                res.status(200).send({'groupingId': req.body.groupingId, 'userId': req.body.userId, 'status': 200});
            } else {
                res.status(200).send({});
            }
        });

    environment.express.route('/api/groupings/:groupingId/members/delete')
        .post(function (req, res, next) {
            console.log();
            if (req.session && req.session.user) {
                res.status(200).send({'groupingId': req.body.groupingId, 'userId': req.body.userId, 'status': 200});
            } else {
                res.status(200).send({});
            }
        });
    return environment;
};

