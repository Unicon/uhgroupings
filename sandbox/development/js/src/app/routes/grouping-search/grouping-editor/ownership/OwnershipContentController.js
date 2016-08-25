angular.module('routes.groupingSearch.OwnershipContentController', [
    'stack.i18n',
    'components.orgUsersServices.OrgUsersService',
    'stack.pagination.UserPagination'
])

/**
 * The OwnershipContentController manages view logic rendered to the
 * ownershipContent.html template.
 *
 * @class OwnershipContentController
 * @constructor
 * @module routes.groupingSearch.OwnershipContentController
 */
.controller('OwnershipContentController', [
    '$timeout',
    '$scope',
    '$modal',
    'OrgUsersService',
    'USER_PAGINATION',
    function ($timeout, $scope, $modal, OrgUsersService, USER_PAGINATION) {
        // Define.
        var ownershipContentController;

        /**
         * Property houses a reference to the controller.
         *
         * @property ownershipContentController
         * @type {Object}
         */
        ownershipContentController = this;

        /**
         * Property to track the sort field for our table of grouping owners.
         *
         * @property ownershipContentController.sortField
         * @type {String}
         */
        ownershipContentController.sortField = '+firstName';

        /**
         * Property to house the users that can be added as owners.
         *
         * @property ownershipContentController.nonOwnerUsers
         * @type {Array}
         */
        ownershipContentController.nonOwnerUsers = [];

        /**
         * Property houses grouping collection.
         *
         * @property ownershipContentController.grouping
         * @type {Object}
         */
        ownershipContentController.grouping = angular.copy($scope.groupingEditorCtrl.grouping);

        /**
         * Property houses an object for pagination properties.
         *
         * @property ownershipContentController.pagination
         * @type {Object}
         */
        ownershipContentController.pagination = {};

        /**
         * Property houses a boolean to track the state of searching.
         *
         * @property ownershipContentController.isSearching
         * @type {Bool}
         */
        ownershipContentController.isSearching = false;

        /**
         * Property a search phrase for user searching.
         *
         * @property ownershipContentController.searchPhrase
         * @type {String}
         */
        ownershipContentController.searchPhrase = '';

        /**
         * Method slicing owners array into pages.
         *
         * @method sliceForPagination
         * @private
         */
        function sliceForPagination() {
            var offset = (ownershipContentController.pagination.currentPage * ownershipContentController.pagination.itemsPerPage) - ownershipContentController.pagination.itemsPerPage;
            ownershipContentController.grouping.ownersPaginated = ownershipContentController.grouping.owners.slice(
                offset, offset + ownershipContentController.pagination.itemsPerPage
            );
        }

        /**
         * Method to handle changing pages.
         *
         * @method pageChanged
         */
        ownershipContentController.pageChanged = function () {
            console.log('Page changed to: ' + ownershipContentController.pagination.currentPage);
            sliceForPagination();
        };

        /**
         * Method to easily control adjusting the sort of the owners table.
         *
         * @method ownershipContentController.changeSort
         * @param {String} newSort Field name
         */
        ownershipContentController.changeSort = function (newSort) {
            // If current sort minus sign equals new sort, then we're just swapping direction.
            if (ownershipContentController.sortField.substr(1) === newSort) {
                ownershipContentController.sortField = (ownershipContentController.sortField[0] === '+' ? '-' : '+') + newSort;
            } else {
                ownershipContentController.sortField = '+' + newSort;
            }
        };

        /**
         * Method to filter out users in the current view.
         *
         * @method userSearch
         * @param {String} searchPhrase
         */
        ownershipContentController.userSearch = function (searchPhrase) {
            ownershipContentController.searchPhrase = searchPhrase;

            // If search term is at least 3 characters long,
            // filter out users based on search term.
            if (ownershipContentController.searchPhrase.length > 2) {
                ownershipContentController.isSearching = true;
                var filteredUsers = _.filter(ownershipContentController.grouping.owners, function (obj) {
                    var user = angular.copy(obj);
                    delete user.userId; // do not include userId as part of search
                    return _.values(user).filter(function (x) {
                        return typeof x === 'string'; // only compare strings to query
                    }).some(function (el) {
                        return el.indexOf(ownershipContentController.searchPhrase) > -1;
                    });
                });
                ownershipContentController.grouping.ownersPaginated = filteredUsers;
            }

            // If search term is deleted go back to paginated view.
            if (ownershipContentController.searchPhrase.length === 0) {
                ownershipContentController.isSearching = false;
                sliceForPagination();
            }
        };

        /**
         * Method handler to add a user.
         *
         * @method ownershipContentController.addUser
         */
        ownershipContentController.addUser = function (size) {
            // Open modal
            var modalInstance = $modal.open({
                animation: ownershipContentController.animationsEnabled,
                templateUrl: 'js/src/app/routes/grouping-search/grouping-editor/ownership/addUser.html',
                controller: 'ModalInstanceController',
                size: size,
                resolve: {
                    owners: function () {
                        return ownershipContentController.grouping.owners;
                    }
                }
            });

            // Handle confirming user selection from typeahead
            modalInstance.result.then(function (selectedItem) {
                ownershipContentController.grouping.owners.push(selectedItem);
                sliceForPagination();
            }, function () {
                console.info('Modal dismissed at: ' + new Date());
            });
        };

        /**
         * Method executes initialization process.
         *
         * @method initialize
         * @private
         */
        function initialize() {
            var t = $timeout(function () {
                // Populate array of non-owner users.
                // Only accounts for the happy path and does not address
                // error conditions.
                OrgUsersService.list().then(function (users) {
                    ownershipContentController.nonOwnerUsers = users.filter(function (user) {
                        return ownershipContentController.grouping.ownerMemberIds.indexOf(user.userId) === -1;
                    });
                });
                ownershipContentController.isSearching = false;
                ownershipContentController.searchPhrase = '';
                ownershipContentController.pagination.totalItems = ownershipContentController.grouping.owners.length;
                ownershipContentController.pagination.itemsPerPage = USER_PAGINATION.PAGE_SIZE;
                ownershipContentController.pagination.currentPage = USER_PAGINATION.PAGE_NUMBER;
                sliceForPagination();
                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
