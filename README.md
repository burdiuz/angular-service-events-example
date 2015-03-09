# angular-service-events-example

Angular service can notify about changes in different ways, most common are:
###### Use promises
This is best solution if you can handle notification in same place where they requested.
```javascript
$http.get('/url').then(...
```

###### Use events
Events can be used to globally notify about changes in service current state. Easiest way to emit event from $rootScope, so it will not be propagated deeply and can be captured from $rootScope.
```javascript
$rootScope.$emit('event-name', ...
```

Using events developer usually faces some problems and decisions, like decide how
to propagate events and how to name them and keep unique. So naming conventions and
namespaces are coming along with long strings to remember and typos. The biggest
problem is silence you get if event didn't reach destination.

# Proposal
For services which should notify about state changes globally use separate, dependent
services which will provide API for listening such events.
For example, if you have customService, add two more customDispatcherService and customListenerService.
 * customService - main service that should notify about its state
 * customDispatcherService - private service that provides API for customService to fire its events.
 * customListenerService - public service that provides API for any other angular entity(controller or service) to listen for such events.

Benefits:
 * With defining such API you will have limited places where strings for event names are used.
 * With using methods instead on strings you will get errors on typos and context help from IDE.
 * With scope-per-dispatcher approach you can forget about naming conventions.
 * Having method to send and method to receive specific event connection will stronger, no need to test it every time its used.

Download this repo for an example. 
--------------
We have events to fire
```javascript
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
```
Dispatcher class used as adapter for $scope
```javascript
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
```
Dispatcher needs $scope object to work, so create new scope for each Dispatcher instance.
Save Dispatcher instance as constant #dispatcher.
```javascript
  // define service internal dispatcher
  (function () {
    var dispatcher = new Dispatcher();
    module.constant('#dispatcher', dispatcher);
    module.run([
      '$rootScope',
      function config($rootScope) {
        // create new scope for each dispatcher instead of thinking about event namespaces and naming conventions
        dispatcher.setScope($rootScope.$new(true));
        console.log('Dispatcher available');
      }
    ]);
  })();
```
Create service to fire events using #dispatcher
```javascript
(function(module){

  /**
   * Private Dispatcher service, its only purpose to give API for sending events for CustomService
   * @param {Dispatcher} dispatcher
   * @constructor
   */
  function CustomServiceDispatcher(dispatcher){

    /**
     * Send update event
     * @param [data]
     */
    this.updateNotify = function(data){
      dispatcher.dispatch(UPDATE_EVENT, data);
    };

    /**
     * @param [data]
     */
    this.resetNotify = function(data){
      dispatcher.dispatch(RESET_EVENT, data);
    };
  }

  // private service got prefixed name
  module.service('#customServiceDispatcher', [
    '#dispatcher',
    CustomServiceDispatcher
  ]);

})(angular.module('aw.servicevents.private', []));
```
And service to listen for fired events
```javascript
(function(module){

  /**
   * Listeners service, its only purpose to give public API for listening main service events
   * @param {Dispatcher} dispatcher
   * @constructor
   */
  function CustomServiceListeners(dispatcher){

    //TODO add logic to cleanup listeners? per dispatcher/event/handler cleanup?

    /**
     * @param {Function} handler
     * @returns {Function}
     */
    this.onUpdate = function (handler){
      return dispatcher.subscribe(UPDATE_EVENT, handler, true);
    };
    /**
     * @param {Function} handler
     * @returns {Function}
     */
    this.onReset = function (handler){
      return dispatcher.subscribe(RESET_EVENT, handler, true);
    };
  }

  module.service('customServiceListeners', [
    '#dispatcher',
    CustomServiceListeners
  ]);
})(angular.module('aw.servicevents'));
```
After this you can use dispatcher service in main CustomService to fire events.
```javascript
  /**
   * @param $interval
   * @param {CustomServiceDispatcher} dispatcher
   * @constructor
   */
  function CustomService($interval, dispatcher) {
    this.start = function () {
      $interval(
        function (param) {
          dispatcher.updateNotify(param + ' ' + String(Date.now()));
        },
        1000
      );
    };
    /**
     * @param {string} param
     */
    this.reset = function (param) {
      dispatcher.resetNotify(param);
    }
  }

  module.service('customService', [
    '$interval',
    '#customServiceDispatcher',
    CustomService
  ]);
```
And listener service to capture these events.
```javascript
/**
   * Custom directive to listen for service events
   * @param {CustomServiceListeners} listeners
   * @constructor
   * @private
   */
  function CustomDirective(listeners) {

    /**
     * @type {CustomDirective}
     */
    var custom = this;
    /**
     * data received with update event
     * @type {string}
     */
    this.updateData = "";
    /**
     * data received with reset event
     * @type {string}
     */
    this.resetData = "";

    // listen for events sent from service

    listeners.onUpdate(function(data){
      custom.updateData = data;
    });

    listeners.onReset(function(data){
      custom.resetData = data;
    });

    console.log('CustomDirective created');
  }

  module.directive("custom", function CustomDirectiveFactory(){
    return {
      restrict: "AE",
      controller: [
        "customServiceListeners",
        CustomDirective
      ],
      controllerAs: "custom",
      template: '<div class="update">UPDATE: {{custom.updateData}}</div><div class="reset">RESET: {{custom.resetData}}</div>'
    };
  });
```