angular.module('components.orgUsersServices.OrgUsersService', [
    'components.orgUsersServices.OrgUsersProxy'
])

/**
 * The OrgUsersService leverages the OrgUsersProxyService for server requests. This
 * service is responsible for transforming data returned by OrgUsersProxyService requests.
 *
 * @class OrgUsersService
 * @constructor
 * @module components.orgUsersServices.OrgUsersService
 */
.factory('OrgUsersService', [
    'OrgUsersProxy',
    function (Proxy) {
        /**
         * Property houses service methods that wrap the OrgUsersProxyService methods,
         * which communicate with the backend. All transformations to data should be
         * made within the context of the below service methods.
         *
         * @property service
         * @type {Object}
         * @private
         */
        var service = {
            /**
             * Method returns a list of all users in an organization.
             *
             * Note: Method does not handle error condition.
             *
             * @method list
             * @return {Object} Promise
             */
            list: function () {
                var promise = Proxy.list().then(function (response) {
                    return response.data;
                });

                return promise;
            },

            /**
             * Method returns a list of all users in an organization.
             *
             * Note: Method does not handle error condition.
             *
             * @method list
             * @return {Object} Promise
             */
            query: function (query) {
                var promise = Proxy.list().then(function (response) {
                    // filter out user list for mock purposes
                    var filteredUsers = _.filter(response.data, function (obj) {
                        var user = angular.copy(obj);
                        delete user.userId; // do not include userId as part of search
                        return _.values(user).filter(function (x) {
                            return typeof x === 'string'; // skip bools
                        }).some(function (el) {
                            return el.indexOf(query) > -1;
                        });
                    });

                    return filteredUsers;
                });

                return promise;
            },

            /**
             * Method returns a list of all *active* users in an organization.
             *
             * Note: Method does not handle error condition.
             *
             * @method listActive
             * @return {Object} Promise
             */
            listActive: function () {
                var promise = Proxy.list().then(function onlyActive(user) {
                    return !!user.isActive;
                });

                return promise;
            },

            /**
             * Method returns a list of all *inactive* users in an organization.
             *
             * Note: Method does not handle error condition.
             *
             * @method listInactive
             * @return {Object} Promise
             */
            listInactive: function () {
                var promise = Proxy.list().then(function onlyInactive(user) {
                    return !user.isActive;
                });

                return promise;
            }
        };

        return service;
    }
]);
