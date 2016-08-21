angular.module('components.userSearch.uhgUserSearch', [
        'components.userSearch.UserSearchController',
        'stack.i18n.stackLocalize',
        'stack.i18n.localize'
    ])

    /**
     * The UserSearch directive houses the application-wide group search mechanism.
     *
     * @class UserSearch
     * @constructor
     * @module components.userSearch.uhgUseringSearch
     * @example
     *     <uhg-user-search
     *         search-phrase="optional initial search phrase"       // specify initial search phrase to use
     *         on-search="someCtrl.someFunction(searchPhrase)">     // specify search handler - searchPhrase is param
     *     </uhg-user-search>
     */
    .directive('uhgUserSearch', [
        function () {
            'use strict';

            return {
                restrict: 'EA',
                scope: {
                    onSearch: '&',
                    userSearchPhrase: '@searchPhrase'
                },
                controller: 'UserSearchController',
                controllerAs: 'userSearchDirCtrl',
                bindToController: true,
                templateUrl: 'js/src/app/components/user-search/userSearch.html'
            };
        }
    ]);
