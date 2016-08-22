<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/**
 * API ROUTES
 * These routes are handled via Laravel
 * ==================================
 */

// TODO: version api
Route::group(['prefix' => 'api'], function () {
  Route::post('login', 'MockAuthController@login');

  Route::match(['get', 'post'], 'logout', 'MockAuthController@logout');

  Route::get('session', 'MockAuthController@getSession');


  /**
   * Groupings Routes
   */
  Route::get('groupings/{id}', 'GroupingsController@getGroup');
  Route::post('groupings/{id}',   'GroupingsController@notSupported');
  Route::put('groupings/{id}',    'GroupingsController@notSupported');
  Route::delete('groupings/{id}', 'GroupingsController@notSupported');

  Route::get('groupings', 'GroupingsController@search');
  Route::post('groupings',   'GroupingsController@notSupported');
  Route::put('groupings',    'GroupingsController@notSupported');
  Route::delete('groupings', 'GroupingsController@notSupported');

  Route::get('groupings/{id}/export', 'GroupingsController@notSupported');
  Route::post('groupings/{id}/export',   'GroupingsController@exportToCSV');
  Route::put('groupings/{id}/export',    'GroupingsController@notSupported');
  Route::delete('groupings/{id}/export', 'GroupingsController@notSupported');

  Route::get('groupings/{id}/members', 'GroupingsController@notSupported');
  Route::post('groupings/{id}/members/add',   'GroupingsController@addMemberToGrouping');
  Route::put('groupings/{id}/members',    'GroupingsController@notSupported');
  Route::post('groupings/{id}/members/delete', 'GroupingsController@deleteMemberFromGrouping');

  Route::get('user/{user}/groupings', 'GroupingsController@getGroupingsBelongedTo');
  Route::post('user/{user}/groupings',   'GroupingsController@notSupported');
  Route::put('user/{user}/groupings',    'GroupingsController@notSupported');
  Route::delete('user/{user}/groupings', 'GroupingsController@notSupported');

  Route::get('user/{user}/groupings/owned', 'GroupingsController@getGroupingsOwned');
  Route::post('user/{user}/groupings/owned',   'GroupingsController@notSupported');
  Route::put('user/{user}/groupings/owned',    'GroupingsController@notSupported');
  Route::delete('user/{user}/groupings/owned', 'GroupingsController@notSupported');
  /**
   * User API Routes
   */
  Route::get('user',    'UserController@getUser');
  Route::post('user',   'UserController@notSupported');
  Route::put('user',    'UserController@notSupported');
  Route::delete('user', 'UserController@notSupported');

  Route::get('users',     'UserController@getUsers');
  Route::post('users',    'UserController@notSupported');
  Route::put('users',     'UserController@notSupported');
  Route::delete('users',  'UserController@notSupported');

  Route::get('users/{id}',    'UserController@showUserById');
  Route::post('users/{id}',   'UserController@notSupported');
  Route::put('users/{id}',    'UserController@notSupported');
  Route::delete('users/{id}', 'UserController@notSupported');
  /**
   * Admin API Routes
   */
  Route::get('admins',    'AdminController@getAdmins');
  Route::post('admins',   'AdminController@addAdmin');
  Route::put('admins',    'AdminController@notSupported');
  Route::delete('admins', 'AdminController@deleteAdmin');

});

Route::get('/', [
  'as' => 'root',
  function () {
    /**
     * Check to see if there is an index.html file, meaning they have setup
     * the Angular app, and return it.  Otherwise display a welcome page.
     */
    if (File::exists(\public_path() . '/index.html')) {
      return \File::get(public_path() . '/index.html');
    }
    else {
      return View::make('welcome');
    }
  }
]);

Route::any('{catchall}', function () {
  return redirect()->route('root');
})->where('catchall', '(.*)');
