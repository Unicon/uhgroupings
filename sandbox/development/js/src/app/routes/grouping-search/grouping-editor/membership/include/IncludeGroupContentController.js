angular.module('routes.groupingSearch.IncludeGroupContentController', [
    'stack.i18n',
    'stack.pagination.UserPagination'
])

/**
 * The IncludeGroupContentController manages view logic rendered to the
 * includeGroupContent.html template.
 *
 * @class IncludeGroupContentController
 * @constructor
 * @module routes.groupingSearch.IncludeGroupContentController
 */
.controller('IncludeGroupContentController', [
    '$timeout',
    '$scope',
    'USER_PAGINATION',
    function ($timeout, $scope, USER_PAGINATION) {
        // Define.
        var includeGroupContentController;

        /**
         * Property houses a reference to the controller.
         *
         * @property includeGroupContentController
         * @type {Object}
         */
        includeGroupContentController = this;

        /**
         * Property to track the sort field for our table of grouping owners.
         *
         * @property includeGroupContentController.sortField
         * @type {String}
         */
        includeGroupContentController.sortField = '+firstName';

        /**
         * Property houses grouping collection.
         *
         * @property includeGroupContentController.grouping
         * @type {Object}
         */
        includeGroupContentController.grouping = $scope.groupingEditorCtrl.grouping;

        /**
         * Property houses an object for pagination properties.
         *
         * @property includeGroupContentController.pagination
         * @type {Object}
         */
        includeGroupContentController.pagination = {};

        /**
         * Property houses a boolean to track the state of searching.
         *
         * @property includeGroupContentController.isSearching
         * @type {Bool}
         */
        includeGroupContentController.isSearching = false;

        /**
         * Property a search phrase for user searching.
         *
         * @property includeGroupContentController.searchPhrase
         * @type {String}
         */
        includeGroupContentController.searchPhrase = '';

        /**
         * Method slicing includedMembers array into pages.
         *
         * @method sliceForPagination
         * @private
         */
        function sliceForPagination() {
            var offset = (includeGroupContentController.pagination.currentPage * includeGroupContentController.pagination.itemsPerPage) - includeGroupContentController.pagination.itemsPerPage;
            includeGroupContentController.grouping.includedMembersPaginated = includeGroupContentController.grouping.includedMembers.slice(
                offset, offset + includeGroupContentController.pagination.itemsPerPage
            );
        }

        /**
         * Method to handle changing pages.
         *
         * @method pageChanged
         */
        includeGroupContentController.pageChanged = function () {
            console.log('Page changed to: ' + includeGroupContentController.pagination.currentPage);
            sliceForPagination();
        };

        /**
         * Method to easily control adjusting the sort of the owners table.
         *
         * @method includeGroupContentController.changeSort
         * @param {String} newSort Field name
         */
        includeGroupContentController.changeSort = function (newSort) {
            // If current sort minus sign equals new sort, then we're just swapping direction.
            if (includeGroupContentController.sortField.substr(1) === newSort) {
                includeGroupContentController.sortField = (includeGroupContentController.sortField[0] === '+' ? '-' : '+') + newSort;
            } else {
                includeGroupContentController.sortField = '+' + newSort;
            }
        };

        /**
         * Method to filter out users in the current view.
         *
         * @method userSearch
         * @param {String} searchPhrase
         */
        includeGroupContentController.userSearch = function (searchPhrase) {
            console.log('userSearch!', searchPhrase);
            includeGroupContentController.searchPhrase = searchPhrase;

            // If search term is at least 3 characters long,
            // filter out users based on search term.
            if (includeGroupContentController.searchPhrase.length > 2) {
                includeGroupContentController.isSearching = true;
                var filteredUsers = _.filter(includeGroupContentController.grouping.includedMembers, function (obj) {
                    var user = angular.copy(obj);
                    delete user.userId; // do not include userId as part of search
                    return _.values(user).filter(function (x) {
                        return typeof x === 'string'; // only compare strings to query
                    }).some(function (el) {
                        return el.indexOf(includeGroupContentController.searchPhrase) > -1;
                    });
                });
                includeGroupContentController.grouping.includedMembersPaginated = filteredUsers;
            }

            // If search term is deleted go back to paginated view.
            if (includeGroupContentController.searchPhrase.length === 0) {
                includeGroupContentController.isSearching = false;
                sliceForPagination();
            }
        };

        /**
         * Method to handle excluding a user by removing them from the include group and adding to the exclude group.
         *
         * @method includeGroupContentController.excludeUser
         * @param {Object} user User object
         */
        includeGroupContentController.excludeUser = function (user) {
            var includedMemberIdx = includeGroupContentController.grouping.includedMembers.indexOf(user),
                includedMemberIdIdx = includeGroupContentController.grouping.includedMemberIds.indexOf(user.userId),
                excludeMemberIdx = includeGroupContentController.grouping.excludedMembers.indexOf(user),
                excludeMemberIdIdx = includeGroupContentController.grouping.excludedMemberIds.indexOf(user.userId);

            // Really shouldn't happen - if it's in the list its index should be obtained.
            if (includedMemberIdx !== -1) {
                includeGroupContentController.grouping.includedMembers.splice(includedMemberIdx, 1);
            }

            if (includedMemberIdIdx !== -1) {
                includeGroupContentController.grouping.includedMemberIds.splice(includedMemberIdIdx, 1);
            }

            // This also should always happen, but best not to have duplicates in the exclude list.
            if (excludeMemberIdx === -1) {
                includeGroupContentController.grouping.excludedMembers.push(user);
            }

            if (excludeMemberIdIdx === -1) {
                includeGroupContentController.grouping.excludedMemberIds.push(user.userId);
            }

            // Update pagination
            if (excludeMemberIdx === -1 || excludeMemberIdIdx === -1) {
                // change total item count when removing member
                includeGroupContentController.pagination.totalItems = includeGroupContentController.pagination.totalItems - 1;
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
                includeGroupContentController.isSearching = false;
                includeGroupContentController.searchPhrase = '';
                includeGroupContentController.pagination.totalItems = includeGroupContentController.grouping.includedMembers.length;
                includeGroupContentController.pagination.itemsPerPage = USER_PAGINATION.PAGE_SIZE;
                includeGroupContentController.pagination.currentPage = USER_PAGINATION.PAGE_NUMBER;

                sliceForPagination();
                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
