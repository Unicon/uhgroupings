angular.module('routes.designate.DesignateController', [
    'stack.page-loader',
    'stack.i18n',
    'components.AdminsServices.AdminsService',
    'components.orgUsersServices.OrgUsersService'
])

/**
 * The DesignateController manages view logic rendered to the
 * designate.html template for the /designate route.
 *
 * @class DesignateController
 * @constructor
 * @module routes.designate.DesignateController
 **/
.controller('DesignateController', [
    '$timeout',
    'translate',
    'protect',
    'AdminsService',
    'OrgUsersService',
    function ($timeout, translate, protect, AdminsService, OrgUsersService) {
        'use strict';

        // Define.
        var designateCtrl;

        /**
         * Property houses a reference to the designate controller.
         *
         * @property designateCtrl
         * @type {Object}
         */
        designateCtrl = this;

        /**
         * Property houses flags indicating current state of the UI.
         *
         * @property uiState
         * @type {Object}
         */
        designateCtrl.uiState = {
            isLoadingAdmins: true
        };

        /**
         * Property houses a reference to authenticated user object.
         *
         * @property designateCtrl.user
         * @type {Object}
         */
        designateCtrl.user = protect;

        /**
         * Property to track the sort field for our table of grouping owners.
         *
         * @property designateCtrl.sortField
         * @type {String}
         */
        designateCtrl.sortField = '+firstName';

        designateCtrl.users = [];

        /**
         * Method to easily control adjusting the sort of the owners table.
         *
         * @method changeSort
         * @param {String} newSort Field name
         */
        designateCtrl.changeSort = function (newSort) {
            // If current sort minus sign equals new sort, then we're just swapping direction.
            if (designateCtrl.sortField.substr(1) === newSort) {
                designateCtrl.sortField = (designateCtrl.sortField[0] === '+' ? '-' : '+') + newSort;
            } else {
                designateCtrl.sortField = '+' + newSort;
            }
        };

        /**
         * Method to handle removing an admin.
         *
         * @method removeAdmin
         * @param {Object} user
         */
        designateCtrl.removeAdmin = function (user) {
            console.log('removeAdmin', user.userId);
            designateCtrl.admins = _.reject(designateCtrl.admins, function (admin) {
                return user.userId === admin.userId;
            });
            AdminsService.removeAdmin(user.userId).then(function (response) {
                console.log(response);
            });
        };

        /**
         * Method to handle removing an admin. This handler
         * is executed when the enter key is detected.
         *
         * @method removeAdmin
         * @param {Object} Event Event object
         * @param {Object} user
         */
        designateCtrl.removeAdminOnKeyDown = function (e, userId) {
            if (e.keyCode === 13) {
                designateCtrl.removeAdmin(userId);
            }
        };

        /**
         * Method to handle removing an admin.
         *
         * @method addAdmin
         * @param {Object} user
         */
        designateCtrl.addAdmin = function (user) {
            console.log('addAdmin', user.userId);
            designateCtrl.users = _.reject(designateCtrl.users, function (obj) {
                return user.userId === obj.userId;
            });
            designateCtrl.admins.push(user);
            designateCtrl.userSearchPhrase = '';
            AdminsService.addAdmin(user.userId).then(function (response) {
                console.log(response);
            });
        };

        /**
         * Method to handle removing an admin. This handler
         * is executed when the enter key is detected.
         *
         * @method addAdmin
         * @param {Object} Event Event object
         * @param {Object} user
         */
        designateCtrl.addAdminOnKeyDown = function (e, user) {
            if (e.keyCode === 13) {
                designateCtrl.addAdmin(user);
            }
        };

        designateCtrl.onChange = function () {
            if (designateCtrl.userSearchPhrase === '') {
                designateCtrl.users = [];
            } else if (designateCtrl.userSearchPhrase.length > 2) {
                OrgUsersService.query(designateCtrl.userSearchPhrase).then(function (data) {
                    designateCtrl.users = data;
                });
            }
        };

        /**
         * Method executes initialization process.
         *
         * @method initialize
         * @private
         */
        function initialize() {
            var t = $timeout(function () {
                AdminsService.list().then(function (admins) {
                    designateCtrl.admins = admins.data;
                    designateCtrl.uiState.isLoadingAdmins = false;
                });
                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
