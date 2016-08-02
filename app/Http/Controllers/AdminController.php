<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use File;

use Faker;

class AdminController extends Controller {
  protected $faker;
  protected $orgUsers = array();

  public function __construct() {
    $this->getOrgUsers();
  }

  /**
   *
   * Setup the UserController by loading in the JSON data, if it exists or
   * creating it using the Faker library.
   *
   */
  private function getOrgUsers() {
    if (File::exists(\base_path() . '/sandbox/clientserver/routes/orgUsers.json')) {
      $this->orgUsers = json_decode(\File::get(\base_path() . '/sandbox/clientserver/routes/orgUsers.json'), TRUE);
    }
    else {
      $this->faker = Faker\Factory::create();

      foreach (range(1, 30) as $index) {
        $user = array(
          "userId" => substr(str_replace("-", "", $this->faker->uuid), 0, 24),
          "email" => $this->faker->email,
          "isActive" => $this->faker->boolean(50),
          "firstName" => $this->faker->firstName,
          "lastName" => $this->faker->lastName,
          "permissionType" => "Admin"
        );

        array_push($this->orgUsers, $user);
      }
    }
  }


  /**
   * getUser
   * Returns a static JSON object when the user accesses /api/user
   *
   * If the user is logged in, then the user is retrieved from the session and returned,
   * otherwise an empty JSON object is returned.
   *
   * @param Request $request
   * @return JSON $user
   */
  public function getUser(Request $request) {
    $user = $request->session()->get('user') ?: NULL;

    return response()->json($user);
  }

  /**
   * getUsers
   * Returns a static JSON object containing a list of users the user accesses /api/users
   *
   * If the user is logged in, then the user is retrieved from the session and returned,
   * otherwise an empty JSON object is returned.
   *
   * @param Request $request
   * @return JSON LengthAwarePaginator $users
   */
  public function getAdmins(Request $request) {
    // grab query parameters
    $query = $request->input('query');
    $pageNumber = $request->input('page');
    $pageSize = $request->input('pageSize');

    if($query){
       return response()->json($this->orgUsers, 200);
    } else { // if no search query is passed
      // if page query params do not exist call with defaults
      if(!$pageNumber) {
        $pageNumber = 1;
      }

      if(!$pageSize) {
        $pageSize = 5;
      }

      $offset = ($pageNumber * $pageSize) - $pageSize;

      // slice full array data based on page number and page size
      $itemsForCurrentPage = array_slice($this->orgUsers, $offset, $pageSize, true);
      return new LengthAwarePaginator(array_values($itemsForCurrentPage), count($this->orgUsers), $pageSize, $pageNumber);
    }

    
  }

  public function addMemberToGrouping(Request $request) {
    if(!$request->input('userId')) {
      return response()->json([
        'developerMessage' => "Malformed API request.",
        'status' => 400
      ], 400);
    }

    // call to add member to admins

    return response()->json([
      'userId' => $request->input('userId'),
      'status' => 200
    ], 200);

  }

  public function deleteMemberFromGrouping(Request $request) {
    if(!$request->input('userId')) {
      return response()->json([
        'developerMessage' => "Malformed API request.",
        'status' => 400
      ], 400);
    }

    // call to delete member to admins

    return response()->json([
      'userId' => $request->input('userId'),
      'status' => 200
    ], 200);

  }

  public function showUserById($id) {
    return response()->json(array_filter($this->orgUsers, function($user) use ($id) {
      if($user['userId'] == $id) {
        return true;
      }
    }));
  }

  // fall back method on using api that is not supported
  public function notSupported() {
    return response()->json([
      'status' => 405,
      'developerMessage' => 'Method not allowed.'
    ], 405);
  }
}