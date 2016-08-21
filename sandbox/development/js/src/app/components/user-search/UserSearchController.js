angular.module('components.userSearch.UserSearchController', [
    'stack.location.LocationService'
])

/**
 * The UserSearchController houses state and view logic
 * for the uhg-user-search directive.
 *
 * @class UserSearchController
 * @constructor
 * @module components.userSearch.UserSearchController
 **/
.controller('UserSearchController', [
    '$attrs',
    '$scope',
    '$state',
    'LocationService',
    function ($attrs, $scope, $state, LocationService) {
        'use strict';

        // Define.
        var userSearchCtrl;

        /**
         * Property to reference controller instance.
         *
         * @property userSearchCtrl
         * @type {Object}
         */
        userSearchCtrl = this;

        /**
         * Property to contain the search phrase used in the query.
         *
         * @property userSearchCtrl.userSearchPhrase
         * @type {String}
         */
        userSearchCtrl.userSearchPhrase = userSearchCtrl.userSearchPhrase || '';

        /**
         * Method to allow executing the search when pressing enter key from within search box.
         *
         * @method userSearchCtrl.onKeyUp
         * @param {Object} event Event object
         */
        userSearchCtrl.onKeyUp = function (event) {
            var keycode = event.keyCode || event.which;

            if (keycode === 13) {
                userSearchCtrl.search();
            }
        };

        /**
         * Method performs the search with the provided search phrase.
         * If an 'onSearch' handler has been provided, it is used,
         * otherwise it defaults to navigating to the userSearch state.
         *
         * @method search
         */
        userSearchCtrl.search = function () {

            // Directive can get reference to a function passed in as an event handler.
            // When a function is defined, use it.

            if ($attrs.onSearch && angular.isFunction(userSearchCtrl.onSearch)) {
                // Pass in the search phrase via named parameter argument.
                // this.onSearch is always defined - it's a proxy to the scope of the passed in function reference.
                userSearchCtrl.onSearch({searchPhrase: userSearchCtrl.userSearchPhrase});
            }
        };
    }
]);
