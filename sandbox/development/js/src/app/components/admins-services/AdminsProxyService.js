angular.module('components.AdminsServices.AdminsProxy', [
    'stack.authentication.AuthenticationConfig',
    'stack.develop.DevelopConfig'
])

/**
 * The AdminsProxy houses CRUD-based methods for admin user interactions.
 *
 * @class AdminsProxy
 * @constructor
 * @module components.AdminsServices.AdminsProxy
 */
.factory('AdminsProxy', [
    '$http',
    'DevelopConfig',
    'AuthenticationConfig',
    function ($http, DevelopConfig, AuthenticationConfig) {

        // Define.
        var proxy, baseEndpoint, adminsEndpoint;

        /**
         * Property houses the base endpoint for all REST calls.
         *
         * @property baseEndpoint
         * @type {String}
         * @private
         */
        baseEndpoint = DevelopConfig().develop ? AuthenticationConfig().developmentAPIBase : AuthenticationConfig.productionAPIBase;

        /**
         * Property houses the endpoint for REST calls used in admins screen.
         *
         * @property adminsEndpoint
         * @type {String}
         * @private
         */
        adminsEndpoint = [baseEndpoint, 'admins'].join('/');

        /**
         * Property houses the service proxy for communicating with the backend.
         *
         * @property proxy
         * @type {Object}
         * @private
         */
        proxy = {
            /**
             * Method returns a list of all admins in an organization.
             *
             * Note: Method does not handle error condition.
             *
             * @method list
             * @return {Object} Promise
             */
            list: function () {
                return $http.get(adminsEndpoint);
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
                return $http.post([adminsEndpoint, 'add'].join('/'), userId);
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
                return $http.post([adminsEndpoint, 'delete'].join('/'), userId);
            }
        };

        return proxy;
    }
]);
