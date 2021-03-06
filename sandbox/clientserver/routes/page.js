/* Page routes.
--------------------------------------*/
module.exports = function (environment) {
    'use strict';

    var initialize = function (req, res) {
        res.render(environment.express.get('ID'), {
            id: environment.express.get('ID'),
            title: environment.express.get('TITLE'),
            description: environment.express.get('DESCRIPTION'),
            dev: environment.DEVELOPMENT,
            environment: environment.ENVIRONMENT,
            environmentId: environment.ENVIRONMENT_ID,
            namespace: ''
        });
    };

    environment.express.route('/').get(initialize);
    environment.express.route('/about').get(initialize);
    environment.express.route('/grouping').get(initialize);
    environment.express.route('/membership').get(initialize);
    environment.express.route('/grouping-search').get(initialize);
    environment.express.route('/grouping-opt-in').get(initialize);
    environment.express.route('/designate').get(initialize);

    return environment;
};
