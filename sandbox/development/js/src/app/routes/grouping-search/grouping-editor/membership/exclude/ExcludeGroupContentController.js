angular.module('routes.groupingSearch.ExcludeGroupContentController', [
    'stack.i18n',
    'stack.pagination.UserPagination'
])

/**
 * The ExcludeGroupContentController manages view logic rendered to the
 * excludeGroupContent.html template.
 *
 * @class ExcludeGroupContentController
 * @constructor
 * @module routes.groupingSearch.ExcludeGroupContentController
 */
.controller('ExcludeGroupContentController', [
    '$timeout',
    '$scope',
    'USER_PAGINATION',
    function ($timeout, $scope, USER_PAGINATION) {
        // Define.
        var excludeGroupContentController;

        /**
         * Property houses a reference to the controller.
         *
         * @property excludeGroupContentController
         * @type {Object}
         */
        excludeGroupContentController = this;

        /**
         * Property to track the sort field for our table of grouping owners.
         *
         * @property excludeGroupContentController.sortField
         * @type {String}
         */
        excludeGroupContentController.sortField = '+firstName';

        /**
         * Property houses grouping collection.
         *
         * @property excludeGroupContentController.grouping
         * @type {Object}
         */
        excludeGroupContentController.grouping = $scope.groupingEditorCtrl.grouping;

        /**
         * Property houses an object for pagination properties.
         *
         * @property excludeGroupContentController.pagination
         * @type {Object}
         */
        excludeGroupContentController.pagination = {};

        /**
         * Method slicing excludedMembers array into pages.
         *
         * @method sliceForPagination
         * @private
         */
        function sliceForPagination() {
            var offset = (excludeGroupContentController.pagination.currentPage * excludeGroupContentController.pagination.itemsPerPage) - excludeGroupContentController.pagination.itemsPerPage;
            excludeGroupContentController.grouping.excludedMembersPaginated = excludeGroupContentController.grouping.excludedMembers.slice(
                offset, offset + excludeGroupContentController.pagination.itemsPerPage
            );
        }

        /**
         * Method to handle changing pages.
         *
         * @method pageChanged
         */
        excludeGroupContentController.pageChanged = function () {
            console.log('Page changed to: ' + excludeGroupContentController.pagination.currentPage);
            sliceForPagination();
        };

        /**
         * Method to easily control adjusting the sort of the owners table.
         *
         * @method excludeGroupContentController.changeSort
         * @param {String} newSort Field name
         */
        excludeGroupContentController.changeSort = function (newSort) {
            // If current sort minus sign equals new sort, then we're just swapping direction.
            if (excludeGroupContentController.sortField.substr(1) === newSort) {
                excludeGroupContentController.sortField = (excludeGroupContentController.sortField[0] === '+' ? '-' : '+') + newSort;
            } else {
                excludeGroupContentController.sortField = '+' + newSort;
            }
        };

        /**
         * Method to handle including a user by removing them from the exclude group and adding to the include group.
         *
         * @method excludeGroupContentController.includeUser
         * @param {Object} user User object
         */
        excludeGroupContentController.includeUser = function (user) {
            var includedMemberIdx = excludeGroupContentController.grouping.includedMembers.indexOf(user),
                includedMemberIdIdx = excludeGroupContentController.grouping.includedMemberIds.indexOf(user.userId),
                excludeMemberIdx = excludeGroupContentController.grouping.excludedMembers.indexOf(user),
                excludeMemberIdIdx = excludeGroupContentController.grouping.excludedMemberIds.indexOf(user.userId);

            // Really shouldn't happen - if it's in the list its index should be obtained.
            if (excludeMemberIdx !== -1) {
                excludeGroupContentController.grouping.excludedMembers.splice(excludeMemberIdx, 1);
            }

            if (excludeMemberIdIdx !== -1) {
                excludeGroupContentController.grouping.excludedMemberIds.splice(excludeMemberIdIdx, 1);
            }

            // This also should always happen, but best not to have duplicates in the exclude list.
            if (includedMemberIdx === -1) {
                excludeGroupContentController.grouping.includedMembers.push(user);
            }

            if (includedMemberIdIdx === -1) {
                excludeGroupContentController.grouping.includedMemberIds.push(user.userId);
            }

            // Update pagination
            if (includedMemberIdx === -1 || includedMemberIdIdx === -1) {
                // change total item count when removing member
                excludeGroupContentController.pagination.totalItems = excludeGroupContentController.pagination.totalItems - 1;
                sliceForPagination();
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
                excludeGroupContentController.pagination.totalItems = excludeGroupContentController.grouping.excludedMembers.length;
                excludeGroupContentController.pagination.itemsPerPage = USER_PAGINATION.PAGE_SIZE;
                excludeGroupContentController.pagination.currentPage = USER_PAGINATION.PAGE_NUMBER;

                sliceForPagination();
                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
