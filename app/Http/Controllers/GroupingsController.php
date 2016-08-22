<?php
/**
 * User: Jeff Sittler
 * Date: 12/2/15
 * Time: 11:51 AM
 */

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Faker;
use File;
use Excel;

class GroupingsController extends Controller {
  protected $faker;
  protected $username = 'ckent';
  protected $password = 'root';
  protected $groupings;
  protected $orgUsers;
  protected $statusArray = array('active', 'inactive');

  public function __construct() {
    $this->faker = Faker\Factory::create();

    $this->getGroupings();

    $this->getOrgUsers();
  }


  /**
   * getGroupings
   * Check to see if the groupings.json file exists, if it does then load it,
   * otherwise create fake data using the Faker library.
   */
  private function getGroupings() {

    if (File::exists(\base_path() . '/sandbox/clientserver/routes/groupings.json')) {
      $this->groupings = json_decode(\File::get(\base_path() . '/sandbox/clientserver/routes/groupings.json'), TRUE);
    }
    else {
      $this->groupings = array(
        array(
          "id" => "groupings:faculty:facultyEditors",
          "displayId" => "Groupings:Faculty:FacultyEditors",
          "displayGroup" => "Faculty Editors",
          "description" => $this->faker->paragraph(3),
          "status" => $this->faker->randomElement($this->statusArray)
        ),
        array(
          "id" => "groupings:faculty:superUsers:facultyAdmin",
          "displayId" => "Groupings:Faculty:SuperUsers:FacultyAdmin",
          "displayGroup" => "Faculty Admin",
          "description" => $this->faker->paragraph(3),
          "status" => $this->faker->randomElement($this->statusArray)
        ),
        array(
          "id" => "groupings:faculty:general:facultyViewers",
          "displayId" => "Groupings:Faculty:General:FacultyViewers",
          "displayGroup" => "Faculty Viewers",
          "description" => $this->faker->paragraph(3),
          "status" => $this->faker->randomElement($this->statusArray)
        ),
        array(
          "id" => "groupings:faculty:facultyApprovers",
          "displayId" => "Groupings:Faculty:FacultyApprovers",
          "displayGroup" => "Faculty Approvers",
          "description" => $this->faker->paragraph(3),
          "status" => $this->faker->randomElement($this->statusArray)
        )
      );
    }
  }

  /**
   * getOrgUsers()
   * Check to see if the orgUsers.json file exists, if it does then load it,
   * otherwise create the fake data using the Faker library.
   */
  private function getOrgUsers() {
    /**
     * Check if file exists
     */
    if (File::exists(\base_path() . '/sandbox/clientserver/routes/orgUsers.json')) {
      $this->orgUsers = json_decode(\File::get(\base_path() . '/sandbox/clientserver/routes/orgUsers.json'), TRUE);
    }
    else {
      /**
       * Populate using Faker data
       */
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
   * search
   * Checked the request object for a query parameter called "query" and then
   * performs a pseudo-search and returns the object.  If the "query" value is
   * !zero, then an empty array is returned.
   *
   * GET /api/groupings?query={query}
   *
   * @param Request $request
   * @return JSON $grouping || empty array
   */
  public function search(Request $request) {
    if ($request->input('query')) {
      if ($request->input('query') == '!zero') {
        return response()->json([]);
      }
      else {
        return [
          'total' => count($this->groupings),
          'data' => $this->groupings
        ];
      }
    }
    else {
      return response()->json([]);
    }
  }

  /**
   * @method getGroup
   * Takes a passed in group id and returns that group from the collection. It
   * also appends some additional data such as users and options prior to
   * returning the data.
   *
   * GET /api/groupings/{id}
   *
   * @param $groupId
   * @return JSON $fakeGrouping
   */
  public function getGroup($groupId) {
    $fakeGrouping = NULL;

    if (!$groupId) {
      $error = array('message' => 'Unauthorized');
      return response()->json($error, 401);
    }
    else {
      foreach ($this->groupings as $group) {
        if ($group['id'] == $groupId) {
          $fakeGrouping = $group;
        }
      }

      $fakeGrouping['basisMemberIds'] = array_slice($this->orgUsers, 0, 16);
      $fakeGrouping['ownerMemberIds'] = array_slice($this->orgUsers, 5, 5);
      $fakeGrouping['includedMemberIds'] = array_slice($this->orgUsers, 16, 6);
      $fakeGrouping['excludedMemberIds'] = array_slice($this->orgUsers, 22, 8);

      $fakeGrouping['options'] = array(
        "canAddSelf" => FALSE,
        "canRemoveSelf" => TRUE,
        "includeInListServe" => TRUE
      );

      return response()->json($fakeGrouping);

    }
  }

  /**
   * getGroupingsOwned
   * This just returns the whole groupings object since we are not doing real
   * filtering in this mock-up
   *
   * GET /api/user/{user}/groupings/owned
   *
   * @param Request $request
   * @param String $id User ID
   * @return JSON LengthAwarePaginator
   */
  public function getGroupingsOwned(Request $request, $id) {
    // return response()->json($this->groupings); // old

    // grab query parameters
    $query = $request->input('query');
    $pageNumber = $request->input('page');
    $pageSize = $request->input('pageSize');

    if($query){
       return response()->json($this->groupings, 200);
    } else { // if no search query is passed
      // if page query params do not exist call with defaults
      if(!$pageNumber) {
        $pageNumber = 1;
      }

      if(!$pageSize) {
        $pageSize = 2;
      }

      $offset = ($pageNumber * $pageSize) - $pageSize;

      // slice full array data based on page number and page size
      $itemsForCurrentPage = array_slice($this->groupings, $offset, $pageSize, true);
      return new LengthAwarePaginator(array_values($itemsForCurrentPage), count($this->groupings), $pageSize, $pageNumber);
    }
  }

  /**
   * @method getGroupingsBelongedTo
   * This just returns the whole groupings object since we are not doing real
   * filtering in this mock-up
   *
   * GET /api/user/{user}/groupings
   *
   * @param Request $request
   * @param String $id User ID
   * @return JSON LengthAwarePaginator
   */
  public function getGroupingsBelongedTo(Request $request, $id) {
    // return response()->json($this->groupings); // old

    // grab query parameters
    $query = $request->input('query');
    $pageNumber = $request->input('page');
    $pageSize = $request->input('pageSize');

    if($query){
       return response()->json($this->groupings, 200);
    } else { // if no search query is passed
      // if page query params do not exist call with defaults
      if(!$pageNumber) {
        $pageNumber = 1;
      }

      if(!$pageSize) {
        $pageSize = 2;
      }

      $offset = ($pageNumber * $pageSize) - $pageSize;

      // slice full array data based on page number and page size
      $itemsForCurrentPage = array_slice($this->groupings, $offset, $pageSize, true);
      return new LengthAwarePaginator(array_values($itemsForCurrentPage), count($this->groupings), $pageSize, $pageNumber);
    }
  }

  /**
   * @method addMemberToGrouping
   * Add member to grouping
   *
   * POST /api/groupings/{id}/members
   *
   * @param Request $request
   * @return JSON $status
   */
  public function addMemberToGrouping(Request $request) {
    if(!$request->input('groupingId') && !$request->input('userId')) {
      return response()->json([
        'developerMessage' => "Malformed API request.",
        'status' => 400
      ], 400);
    }

    // call to add member to grouping

    return response()->json([
      'groupingId' => $request->input('groupingId'),
      'userId' => $request->input('userId'),
      'status' => 200
    ], 200);

  }

  /**
   * @method deleteMemberFromGrouping
   * Delete member to grouping
   *
   * DELETE /api/groupings/{id}/members
   *
   * @param Request $request
   * @return JSON $status
   */
  public function deleteMemberFromGrouping(Request $request) {
    if(!$request->input('groupingId') && !$request->input('userId')) {
      return response()->json([
        'developerMessage' => "Malformed API request.",
        'status' => 400
      ], 400);
    }

    // call to add member to grouping

    return response()->json([
      'groupingId' => $request->input('groupingId'),
      'userId' => $request->input('userId'),
      'status' => 200
    ], 200);

  }

  /**
   * @method exportToCSV
   * Export groupings data to CSV
   *
   * GET /api/groupings/{id}/export
   *
   * @param Request $request
   * @return CSV File
   */
  public function exportToCSV(Request $request) {
    $defaultMembers = $request->input('grouping.defaultMembers');
    $basisMembers = $request->input('grouping.basisMembers');
    $includedMembers = $request->input('grouping.includedMembers');
    $excludedMembers = $request->input('grouping.excludedMembers');
    $membersArray = array($defaultMembers, $basisMembers, $includedMembers, $excludedMembers);
    $merged = array();
    if (is_array($membersArray)) {
      foreach ($membersArray as $key => $value) {
        if (is_array($value)) {
          foreach ($value as $keyInner => $valueInner) {
            $pushArray = [$valueInner['firstName'], $valueInner['lastName'], $valueInner['email'], $valueInner['sourceGroup']];
            array_push($merged, $pushArray);
          }
        } else {
          array_push($merged, array('error', 'error', 'error'));
        }
      }
    } else {
      array_push($merged, array('error2', 'error2', 'error2'));
    }
    
    array_unshift($merged, array('First Name', 'Last Name', 'Email', 'Source Group'));
    Excel::create('testfile', function($excel) use ($merged) {
        // Set the title
        $excel->setTitle('no title');
        $excel->setCreator('no no creator')->setCompany('no company');
        $excel->setDescription('report file');

        $excel->sheet('sheet1', function($sheet) use ($merged) {
            $data = $merged;
            $sheet->fromArray($data);
        });
    })->download('csv');

  }

  /**
   * @method notSupported
   * Returns an error JSON object. Used for routes that are not supported.
   *
   * @param Request $request
   * @return JSON 405 error object
   */
  public function notSupported() {
    return response()->json([
      'status' => 405,
      'developerMessage' => 'Method not allowed.'
    ], 405);
  }
}