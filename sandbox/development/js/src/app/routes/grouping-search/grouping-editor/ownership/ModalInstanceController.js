angular.module('routes.groupingSearch.ModalInstanceController', [
    'stack.i18n',
    'components.orgUsersServices.OrgUsersService',
    'stack.pagination.UserPagination',
    'ui.bootstrap.typeahead'
])

/**
 * The ModalInstanceController manages view logic rendered to the
 * addUser.html modal template.
 *
 * @class ModalInstanceController
 * @constructor
 * @module routes.groupingSearch.ModalInstanceController
 */
.controller('ModalInstanceController', [
    '$timeout',
    '$scope',
    '$modalInstance',
    'OrgUsersService',
    'USER_PAGINATION',
    'owners',
    function ($timeout, $scope, $modalInstance, OrgUsersService, USER_PAGINATION, owners) {
        // Define.
        var modalInstanceController,
            users = [];

        /**
         * Property houses a reference to the controller.
         *
         * @property modalInstanceController
         * @type {Object}
         */
        modalInstanceController = this;
        /**
         * Method to parse email out of selected item string.
         *
         * @method parseEmail
         * @private
         * @param {String} itemString selected user
         * @return {String} email
         */
        function parseEmail(itemString) {
            var subStringStart,
                email = '';

            subStringStart = $scope.selected.lastIndexOf(' ');
            if (subStringStart > -1) {
                // Do not include substring search character
                subStringStart = subStringStart + 1;
                email = itemString.substring(subStringStart);
            }

            return email;
        }

        /**
         * Method to get differences of two arrays
         *
         * @method arrayDifference
         * @private
         * @param {Array} res searchUsers result
         * @param {Array} own groupings owners
         * @return {Array} difference array difference
         */
        function arrayDifference(res, own) {
            var difference = [];

            difference = res.filter(function (x) {
                return own.filter(function (y) {
                    return x.firstName === y.firstName && x.lastName === y.lastName && x.email === y.email;
                }).length === 0;
            });

            return difference;
        }

        /**
         * Method to search users in modal's typeahead.
         *
         * @method searchUsers
         * @param {String} val search query
         */
        $scope.searchUsers = function (val) {
            return OrgUsersService.query(val).then(function (response) {
                // Filter out users that DO NOT show up in owners array
                response = arrayDifference(response, owners);
                // Set users to pull user object on confirming selection
                users = response;
                return response.map(function (item) {
                    return item.firstName + ' ' + item.lastName + ' - ' + item.email;
                });
            });
        };

        /**
         * Method to confirm addition of user.
         * Takes selected item and parses out email address
         * for filtering a specific user. It returns
         * the selectedUser to the parent controller
         * that called this modal.
         *
         * @method ok
         */
        $scope.ok = function () {
            var selectedUser,
                email = parseEmail($scope.selected);

            selectedUser = users.filter(function (user) {
                return user.email === email;
            });

            $modalInstance.close(selectedUser[0]);
        };

        /**
         * Method to close modal.
         *
         * @method cancel
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
