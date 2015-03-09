/**
 * Created by Oleg Galaburda on 08.03.2015.
 * @export Dispatcher
 * @export UPDATE_EVENT
 * @export SHARED_EVENT
 */
/**
 * Update event name
 * @type {string}
 */
var UPDATE_EVENT = "update";

/**
 * Reset event name
 * @type {string}
 */
var RESET_EVENT = "reset";
/**
 * Adapter for $scope
 * @constructor
 */
function Dispatcher(){
  var $scope;
  this.setScope = function (value){
    if($scope) throw new Error('Dispatcher $scope object already set.');
    if(!value) throw new Error('Dispatcher $scope object cannot be null.');
    $scope = value;
  };
  this.dispatch = function (event, data){
    // send event down so it will be "locked" by this scope
    $scope.$broadcast(event, data);
  };

  //should handler receive event related information it didn't ask about?
  this.subscribe = function (event, handler, dataOnly){
    var unsubscribeHandler;
    if(dataOnly){
      unsubscribeHandler = $scope.$on(event, function(event, data){
        handler(data);
      });
    }else{
      $scope.$on(event, handler);
    }
    return unsubscribeHandler;
  };
}
