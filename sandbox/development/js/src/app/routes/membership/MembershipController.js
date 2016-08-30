angular.module('routes.membership.MembershipController', [
    'stack.page-loader',
    'stack.i18n',
    'stack.authentication.AuthenticationService',
    'stack.location.LocationService',
    'components.groupingsServices.GroupingsService',
    'stack.pagination.GroupingPagination'
])

/**
 * The MembershipController manages view logic rendered to the
 * membership.html template for the /membership route.
 *
 * @class MembershipController
 * @constructor
 * @module routes.membership.MembershipController
 **/
.controller('MembershipController', [
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
        var membershipCtrl;

        /**
         * Property houses a reference to the membership controller.
         *
         * @property membershipCtrl
         * @type {Object}
         */
        membershipCtrl = this;

        /**
         * Property houses flags indicating current state of the UI.
         *
         * @property uiState
         * @type {Object}
         */
        membershipCtrl.uiState = {
            isLoadingGroupings: true
        };

        /**
         * Property houses a reference to authenticated user object.
         *
         * @property membershipCtrl.user
         * @type {Object}
         */
        membershipCtrl.user = protect;

        /**
         * Method to handle managing edit-state of groupings.
         *
         * @method editGrouping
         * @param {Object} grouping Grouping object
         */
        membershipCtrl.editGrouping = function (grouping) {
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
         * @method editGroupingOnKeyDown
         * @param {Object} Event Event object
         * @param {Object} grouping Grouping object
         */
        membershipCtrl.editGroupingOnKeyDown = function (e, grouping) {
            if (e.keyCode === 13) {
                membershipCtrl.editGrouping(grouping);
            }
        };

        /**
         * Property houses an object for pagination properties.
         *
         * @property membershipCtrl.pagination
         * @type {Object}
         */
        membershipCtrl.pagination = {};

        membershipCtrl.setPage = function (pageNumber) {
            console.log('setPage', pageNumber);
            membershipCtrl.pagination.currentPage = pageNumber;
        };

        /**
         * Method to handle changing pages.
         *
         * @method setPage
         * @param {Object} grouping Grouping object
         */
        membershipCtrl.pageChanged = function () {
            console.log('Page changed to: ' + membershipCtrl.pagination.currentPage);
            loadGroupingMemberships();
        };

        /**
         * Method executes loading of owned groups.
         *
         * @method loadGroupingMemberships
         * @private
         */
        function loadGroupingMemberships() {
            // Implementation only depicts the happy path. Error handling was not implemented
            // due to time constraints.
            AuthenticationService.getUser().then(function (user) {
                GroupingsService.getGroupMemberships(user.username, membershipCtrl.pagination.currentPage).then(function (groups) {
                    membershipCtrl.pagination.totalItems = groups.total;
                    membershipCtrl.pagination.currentPage = groups.current_page;
                    membershipCtrl.pagination.itemsPerPage = GROUPING_PAGINATION.PAGE_SIZE;
                    membershipCtrl.groupingMemberships = groups.data;
                    membershipCtrl.uiState.isLoadingGroupings = false;
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
                // We may want to load different data depending on
                // the role.
                if (membershipCtrl.user.role === 'owner') {
                    loadGroupingMemberships();
                }

                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
