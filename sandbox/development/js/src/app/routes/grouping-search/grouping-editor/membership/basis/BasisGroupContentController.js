angular.module('routes.groupingSearch.BasisGroupContentController', [
    'stack.i18n',
    'stack.pagination.UserPagination'
])

/**
 * The BasisGroupContentController manages view logic rendered to the
 * basisGroupContent.html template.
 *
 * @class BasisGroupContentController
 * @constructor
 * @module routes.groupingSearch.BasisGroupContentController
 */
.controller('BasisGroupContentController', [
    '$timeout',
    '$scope',
    'USER_PAGINATION',
    function ($timeout, $scope, USER_PAGINATION) {
        // Define.
        var basisGroupContentController;

        /**
         * Property houses a reference to the controller.
         *
         * @property basisGroupContentController
         * @type {Object}
         */
        basisGroupContentController = this;

        /**
         * Property to track the sort field for our table of grouping owners.
         *
         * @property basisGroupContentController.sortField
         * @type {String}
         */
        basisGroupContentController.sortField = '+firstName';

        /**
         * Property houses grouping collection.
         *
         * @property basisGroupContentController.grouping
         * @type {Object}
         */
        basisGroupContentController.grouping = $scope.groupingEditorCtrl.grouping;

        /**
         * Property houses an object for pagination properties.
         *
         * @property basisGroupContentController.pagination
         * @type {Object}
         */
        basisGroupContentController.pagination = {};

        /**
         * Property houses a boolean to track the state of searching.
         *
         * @property basisGroupContentController.isSearching
         * @type {Bool}
         */
        basisGroupContentController.isSearching = false;

        /**
         * Property a search phrase for user searching.
         *
         * @property basisGroupContentController.searchPhrase
         * @type {String}
         */
        basisGroupContentController.searchPhrase = '';

        /**
         * Method slicing basisMembers array into pages.
         *
         * @method sliceForPagination
         * @private
         */
        function sliceForPagination() {
            var offset = (basisGroupContentController.pagination.currentPage * basisGroupContentController.pagination.itemsPerPage) - basisGroupContentController.pagination.itemsPerPage;
            basisGroupContentController.grouping.basisMembersPaginated = basisGroupContentController.grouping.basisMembers.slice(
                offset, offset + basisGroupContentController.pagination.itemsPerPage
            );
        }

        /**
         * Method to handle changing pages.
         *
         * @method pageChanged
         */
        basisGroupContentController.pageChanged = function () {
            console.log('Page changed to: ' + basisGroupContentController.pagination.currentPage);
            sliceForPagination();
        };

        /**
         * Method to easily control adjusting the sort of the owners table.
         *
         * @method changeSort
         * @param {String} newSort Field name
         */
        basisGroupContentController.changeSort = function (newSort) {
            // If current sort minus sign equals new sort, then we're just swapping direction.
            if (basisGroupContentController.sortField.substr(1) === newSort) {
                basisGroupContentController.sortField = (basisGroupContentController.sortField[0] === '+' ? '-' : '+') + newSort;
            } else {
                basisGroupContentController.sortField = '+' + newSort;
            }
        };

        /**
         * Method to filter out users in the current view.
         *
         * @method userSearch
         * @param {String} searchPhrase
         */
        basisGroupContentController.userSearch = function (searchPhrase) {
            basisGroupContentController.searchPhrase = searchPhrase;

            // If search term is at least 3 characters long,
            // filter out users based on search term.
            if (basisGroupContentController.searchPhrase.length > 2) {
                basisGroupContentController.isSearching = true;
                var filteredUsers = _.filter(basisGroupContentController.grouping.basisMembers, function (obj) {
                    var user = angular.copy(obj);
                    delete user.userId; // do not include userId as part of search
                    return _.values(user).filter(function (x) {
                        return typeof x === 'string'; // only compare strings to query
                    }).some(function (el) {
                        return el.indexOf(basisGroupContentController.searchPhrase) > -1;
                    });
                });
                basisGroupContentController.grouping.basisMembersPaginated = filteredUsers;
            }

            // If search term is deleted go back to paginated view.
            if (basisGroupContentController.searchPhrase.length === 0) {
                basisGroupContentController.isSearching = false;
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
                basisGroupContentController.isSearching = false;
                basisGroupContentController.searchPhrase = '';
                basisGroupContentController.pagination.totalItems = basisGroupContentController.grouping.basisMembers.length;
                basisGroupContentController.pagination.itemsPerPage = USER_PAGINATION.PAGE_SIZE;
                basisGroupContentController.pagination.currentPage = USER_PAGINATION.PAGE_NUMBER;

                sliceForPagination();
                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
