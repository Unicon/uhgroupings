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
         * Method executes initialization process.
         *
         * @method initialize
         * @private
         */
        function initialize() {
            var t = $timeout(function () {
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
