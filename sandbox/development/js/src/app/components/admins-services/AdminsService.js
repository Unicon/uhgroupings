angular.module('components.AdminsServices.AdminsService', [
    'components.AdminsServices.AdminsProxy'
])

/**
 * The AdminsService leverages the AdminsProxyService for server requests. This
 * service is responsible for transforming data returned by AdminsProxyService requests.
 *
 * @class AdminsService
 * @constructor
 * @module components.AdminsServices.AdminsService
 */
.factory('AdminsService', [
    'AdminsProxy',
    function (Proxy) {
        /**
         * Property houses service methods that wrap the AdminsProxyService methods,
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
             * Method adds an admin to an organization.
             *
             * Note: Method does not handle error condition.
             *
             * @method addAdmin
             * @param userId
             * @return {Object} Promise
             */
            addAdmin: function (userId) {
                var promise = Proxy.addAdmin({'userId': userId}).then(function (response) {
                    return response.data;
                });

                return promise;
            },

            /**
             * Method removes an admin from an organization.
             *
             * Note: Method does not handle error condition.
             *
             * @method removeAdmin
             * @param userId
             * @return {Object} Promise
             */
            removeAdmin: function (userId) {
                var promise = Proxy.removeAdmin({'userId': userId}).then(function (response) {
                    return response.data;
                });

                return promise;
            }
        };

        return service;
    }
]);
