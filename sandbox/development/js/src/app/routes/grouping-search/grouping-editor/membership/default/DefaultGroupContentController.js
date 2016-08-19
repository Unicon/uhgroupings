angular.module('routes.groupingSearch.DefaultGroupContentController', [
    'stack.i18n',
    'stack.pagination.UserPagination'
])

/**
 * The DefaultGroupContentController manages view logic rendered to the
 * defaultGroupContent.html template.
 *
 * @class DefaultGroupContentController
 * @constructor
 * @module routes.groupingSearch.DefaultGroupContentController
 */
.controller('DefaultGroupContentController', [
    '$timeout',
    '$scope',
    'USER_PAGINATION',
    function ($timeout, $scope, USER_PAGINATION) {
        // Define.
        var defaultGroupContentController;

        /**
         * Property houses a reference to the controller.
         *
         * @property defaultGroupContentController
         * @type {Object}
         */
        defaultGroupContentController = this;

        /**
         * Property to track the sort field for our table of grouping owners.
         *
         * @property defaultGroupContentController.sortField
         * @type {String}
         */
        defaultGroupContentController.sortField = '+firstName';

        /**
         * Property houses grouping collection.
         *
         * @property defaultGroupContentController.grouping
         * @type {Object}
         */
        defaultGroupContentController.grouping = $scope.groupingEditorCtrl.grouping;

        /**
         * Property houses an object for pagination properties.
         *
         * @property defaultGroupContentController.pagination
         * @type {Object}
         */
        defaultGroupContentController.pagination = {};

        /**
         * Method slicing defaultMembers array into pages.
         *
         * @method sliceForPagination
         * @private
         */
        function sliceForPagination() {
            var offset = (defaultGroupContentController.pagination.currentPage * defaultGroupContentController.pagination.itemsPerPage) - defaultGroupContentController.pagination.itemsPerPage;
            defaultGroupContentController.grouping.defaultMembersPaginated = defaultGroupContentController.grouping.defaultMembers.slice(
                offset, offset + defaultGroupContentController.pagination.itemsPerPage
            );
        }

        /**
         * Method to handle changing pages.
         *
         * @method pageChanged
         */
        defaultGroupContentController.pageChanged = function () {
            console.log('Page changed to: ' + defaultGroupContentController.pagination.currentPage);
            sliceForPagination();
        };

        /**
         * Method to easily control adjusting the sort of the owners table.
         *
         * @method changeSort
         * @param {String} newSort Field name
         */
        defaultGroupContentController.changeSort = function (newSort) {
            // If current sort minus sign equals new sort, then we're just swapping direction.
            if (defaultGroupContentController.sortField.substr(1) === newSort) {
                defaultGroupContentController.sortField = (defaultGroupContentController.sortField[0] === '+' ? '-' : '+') + newSort;
            } else {
                defaultGroupContentController.sortField = '+' + newSort;
            }
        };

        /**
         * Method executes initialization process.
         *
         * @method initialize
         * @private
         */
        function initialize() {
            // default members = ((basisMembers + includedMembers) - excludedMembers)
            // NOTE: This implementation assumes no overlap between basis and included.
            // NOTE: We specify the sourceGroup attribute so that we know the source
            // of each group.
            //
            // TODO: move this code into a service.
            var t = $timeout(function () {
                defaultGroupContentController.grouping.defaultMembers = defaultGroupContentController.grouping.basisMembers.map(function (m) {
                        m.sourceGroup = 'Basis';
                        return m;
                    })
                    .concat(defaultGroupContentController.grouping.includedMembers.map(function (m) {
                        m.sourceGroup = 'Include';
                        return m;
                    }))
                    .filter(function (m) {
                        return defaultGroupContentController.grouping.excludedMemberIds.indexOf(m.userId) === -1;
                    }
                );

                defaultGroupContentController.pagination.totalItems = defaultGroupContentController.grouping.defaultMembers.length;
                defaultGroupContentController.pagination.itemsPerPage = USER_PAGINATION.PAGE_SIZE;
                defaultGroupContentController.pagination.currentPage = USER_PAGINATION.PAGE_NUMBER;
                sliceForPagination();
                // Call implementations here. Timeout is needed in order
                // for all potentially nested directives to execute.
                $timeout.cancel(t);
            }, 0);
        }
        initialize();
    }
]);
