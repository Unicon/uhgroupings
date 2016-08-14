/**
 * Module definition houses collection of stack assets.
 * Stack assets consist of implementations that are
 * generic in nature and can be used across multiple
 * applications.
 *
 * @module stack
 */
angular.module('stack', [
    'stack.i18n',
    'stack.page-loader',
    'stack.location',
    'stack.reveal',
    'stack.authentication',
    'stack.develop',
    'stack.defaults'
]);
