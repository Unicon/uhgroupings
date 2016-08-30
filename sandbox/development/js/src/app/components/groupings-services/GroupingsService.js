angular.module('components.groupingsServices.GroupingsService', [
    'components.groupingsServices.GroupingsProxy',
    'stack.pagination.GroupingPagination'
])
/**
 * The GroupingsService leverages the GroupingsProxyService for server requests. This
 * service is responsible for transforming data returned by GroupingsProxyService requests.
 *
 * @class GroupingsService
 * @constructor
 * @module components.groupingsServices.GroupingsService
 */
.factory('GroupingsService', [
    'GroupingsProxy',
    'GROUPING_PAGINATION',
    function (Proxy, GROUPING_PAGINATION) {
        // Define.
        var service;

        /**
         * Method parses out a grouping based upon the grouping identifier.
         *
         * @param {Object} grouping Grouping object
         * @returns {Object}
         * @private
         */
        function transformGrouping(grouping) {
            var groupSegments = grouping.id.split(':');

            grouping.rootFolder = groupSegments.shift();
            grouping.group = groupSegments.pop();
            grouping.folder = groupSegments.join('/');

            return grouping;
        }

        /**
         * Method to transform backend responses as needed for frontend consumption.
         *
         * @param {Object} response Response object
         * @returns {Array[group]}
         * @private
         */
        function transformGroupResponse(response) {
            var groupings = response.data;

            if (angular.isArray(groupings.data)) {
                groupings.data.forEach(transformGrouping);
            } else {
                groupings = transformGrouping(groupings);
            }

            return groupings;
        }

        /**
         * Property houses service methods that wrap the GroupingProxyService methods,
         * which communicate with the backend. All transformations to data should be
         * made within the context of the below service methods.
         *
         * @property service
         * @type {Object}
         * @private
         */
        service = {
            /**
             * Method returns groups matching a searchPhrase.
             *
             * Note: Method does not handle error condition.
             *
             * @method query
             * @param {String} searchPhrase Phrase to search groups by
             * @return {Object} Promise
             */
            query: function (searchPhrase) {
                var promise = Proxy.query(searchPhrase).then(transformGroupResponse);
                return promise;
            },

            /**
             * Method returns complete data set for a single grouping
             * given the passed grouping identifier.
             *
             * Note: Method does not handle error condition.
             *
             * @method getGroup
             * @param {String} groupingId Group identifier
             * @return {Object} Promise
             */
            getGroup: function (groupingId) {
                var promise = Proxy.getGroup(groupingId).then(transformGroupResponse);
                return promise;
            },

            /**
             * Method returns groups owned by a specific user.
             *
             * Note: Method does not handle error condition.
             *
             * @method getOwnedGroups
             * @param {String|Number} userId User identifier who is the owner of groups
             * @param {Number} pageNumber
             * @param {Number} pageSize
             * @return {Object} Promise
             */
            getOwnedGroups: function (userId, pageNumber, pageSize) {
                pageNumber = pageNumber || GROUPING_PAGINATION.PAGE_NUMBER;
                pageSize = pageSize || GROUPING_PAGINATION.PAGE_SIZE;
                var promise = Proxy.getOwnedGroups(userId, pageNumber, pageSize).then(transformGroupResponse);
                return promise;
            },

            /**
             * Method returns groups with a specific user as a member.
             *
             * Note: Method does not handle error condition.
             *
             * @method getGroupMemberships
             * @param {String|Number} userId Id of the user who is member of groups
             * @param {Number} pageNumber
             * @param {Number} pageSize
             * @return {Object} Promise
             */
            getGroupMemberships: function (userId, pageNumber, pageSize) {
                pageNumber = pageNumber || GROUPING_PAGINATION.PAGE_NUMBER;
                pageSize = pageSize || GROUPING_PAGINATION.PAGE_SIZE;
                var promise = Proxy.getGroupMemberships(userId, pageNumber, pageSize).then(transformGroupResponse);
                return promise;
            },

            /**
             * Method adds a user to a grouping.
             *
             * Note: Method does not handle error condition.
             *
             * @method addMemberToGroup
             * @param groupingId
             * @param userId
             * @return {Object} Promise
             */
            addMemberToGroup: function (groupingId, userId) {
                var promise = Proxy.addMemberToGroup(groupingId, userId).then(function (response) {
                    return response.data;
                });
                return promise;
            },

            /**
             * Method removes a user from a grouping.
             *
             * Note: Method does not handle error condition.
             *
             * @method deleteMemberFromGroup
             * @param groupingId
             * @param userId
             * @return {Object} Promise
             */
            deleteMemberFromGroup: function (groupingId, userId) {
                var promise = Proxy.deleteMemberFromGroup(groupingId, userId).then(function (response) {
                    return response.data;
                });
                return promise;
            },

            /**
             * Method exports grouping to a CSV file.
             *
             * Note: Method does not handle error condition.
             *
             * @method exportToCSV
             * @param groupingId
             * @param dataToExport grouping's members
             */
            exportToCSV: function (groupingId, dataToExport) {
                var defaultMembers = dataToExport.defaultMembers,
                    basisMembers = dataToExport.basisMembers,
                    excludedMembers = dataToExport.excludedMembers,
                    includedMembers = dataToExport.includedMembers,
                    payloadData = {
                        'defaultMembers': defaultMembers,
                        'basisMembers': basisMembers,
                        'excludedMembers': excludedMembers,
                        'includedMembers': includedMembers
                    };

                payloadData.excludedMembers = payloadData.excludedMembers.map(function (obj) {
                    obj.sourceGroup = 'Exclude';
                    return obj;
                });

                Proxy.exportToCSV(groupingId, {'grouping': payloadData});
            }
        };

        return service;
    }
]);
