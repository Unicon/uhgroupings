angular.module('routes.groupingSearch.uhgGroupingEditor', [
    'routes.groupingSearch.GroupingEditorController',
    'routes.groupingSearch.MembershipContentController',
    'routes.groupingSearch.OwnershipContentController',
    'routes.groupingSearch.ModalInstanceController',
    'routes.groupingSearch.PreferencesContentController',
    'components.orgUsersServices.OrgUsersService',
    'stack.i18n.stackLocalize',
    'stack.i18n.localize'
])

/**
 * The GroupingEditor directive houses the group editing mechanism used within grouping search view.
 *
 * @class GroupingEditor
 * @constructor
 * @module routes.groupingSearch.uhgGroupingEditor
 * @example
 *     <uhg-grouping-editor
 *         grouping="viewController.grouping"       // specify grouping object to be modified
 *     </uhg-grouping-editor>
 */
.directive('uhgGroupingEditor', [
    function () {
        'use strict';

        return {
            restrict: 'EA',
            scope: {
                groupingId: '='
            },
            controller: 'GroupingEditorController',
            controllerAs: 'groupingEditorCtrl',
            bindToController: true,
            templateUrl: 'js/src/app/routes/grouping-search/grouping-editor/groupingEditor.html'
        };
    }
]);
