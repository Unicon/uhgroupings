angular.module('routes.grouping.GroupingController', [
    'stack.page-loader',
    'stack.i18n',
    'stack.authentication.AuthenticationService',
    'stack.location.LocationService',
    'components.groupingsServices.GroupingsService',
    'stack.pagination.GroupingPagination'
])

/**
 * The GroupingController manages view logic rendered to the
 * grouping.html template for the /grouping route.
 *
 * @class GroupingController
 * @constructor
 * @module routes.grouping.GroupingController
 **/
.controller('GroupingController', [
    '$timeout',
    'translate',
    'protect',
    'AuthenticationService',
    'LocationService',
    'GroupingsService',
    'GROUPING_PAGINATION',
    function ($timeout, translate, protect, AuthenticationService, LocationService, GroupingsService, GROUPING_PAGINATION) {
        'use strict';

        // Define.
        var groupingCtrl;

        /**
         * Property houses a reference to the grouping controller.
         *
         * @property groupingCtrl
         * @type {Object}
         */
        groupingCtrl = this;

        /**
         * Property houses flags indicating current state of the UI.
         *
         * @property uiState
         * @type {Object}
         */
        groupingCtrl.uiState = {
            isLoadingGroupings: true
        };

        /**
         * Property houses a reference to authenticated user object.
         *
         * @property groupingCtrl.user
         * @type {Object}
         */
        groupingCtrl.user = protect;

        /**
         * Method to handle managing edit-state of groupings.
         *
         * @method editGrouping
         * @param {Object} grouping Grouping object
         */
        groupingCtrl.editGrouping = function (grouping) {
            // console.log('GroupingController', grouping);
            LocationService.redirect({
                route: 'grouping-search',
                params: {
                    searchPhrase: null,
                    grouping: grouping
                }
            });
        };

        /**
         * Method to handle managing edit-state of groupings. This handler
         * is executed when the enter key is detected.
         *
         * @method editGrouping
         * @param {Object} Event Event object
         * @param {Object} grouping Grouping object
         */
        groupingCtrl.editGroupingOnKeyDown = function (e, grouping) {
            if (e.keyCode === 13) {
                groupingCtrl.editGrouping(grouping);
            }
        };

        /**
         * Property houses an object for pagination properties.
         *
         * @property groupingCtrl.pagination
         * @type {Object}
         */
        groupingCtrl.pagination = {};

        groupingCtrl.setPage = function (pageNumber) {
            console.log('setPage', pageNumber);
            groupingCtrl.pagination.currentPage = pageNumber;
        };

        /**
         * Method to handle changing pages.
         *
         * @method setPage
         * @param {Object} grouping Grouping object
         */
        groupingCtrl.pageChanged = function () {
            console.log('Page changed to: ' + groupingCtrl.pagination.currentPage);
            loadOwnedGroups();
        };

        /**
         * Method executes loading of owned groups.
         *
         * @method loadOwnedGroups
         * @private
         */
        function loadOwnedGroups() {
            // Implementation only depicts the happy path. Error handling was not implemented
            // due to time constraints.
            AuthenticationService.getUser().then(function (user) {
                GroupingsService.getOwnedGroups(user.username, groupingCtrl.pagination.currentPage).then(function (groups) {
                    groupingCtrl.pagination.totalItems = groups.total;
                    groupingCtrl.pagination.currentPage = groups.current_page;
                    groupingCtrl.pagination.itemsPerPage = GROUPING_PAGINATION.PAGE_SIZE;
                    groupingCtrl.ownedGroups = groups.data;
                    groupingCtrl.uiState.isLoadingGroupings = false;
                });
            });
        }

        /**
         * Method executes initialization process.
         *
         * @method initialize
         * @private
         */
        function initialize() {
            var t = $timeout(function () {
                loadOwnedGroups();
                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
