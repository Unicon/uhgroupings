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
         * Property houses a reference to authenticated user object.
         *
         * @property designateCtrl.user
         * @type {Object}
         */
        designateCtrl.user = protect;

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
                });
                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
