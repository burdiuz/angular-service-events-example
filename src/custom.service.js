/**
 * Created by Oleg Galaburda on 08.03.2015.
 * @exports CustomService
 */
(function (module) {

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

  // define service internal dispatcher
  (function () {
    var dispatcher = new Dispatcher();
    module.constant('#dispatcher', dispatcher);
    module.run([
      '$rootScope',
      function config($rootScope) {
        // create new scope for each dispatcher instead of thinking about event namespaces and naming conventions
        dispatcher.setScope($rootScope.$new());
        console.log('Dispatcher available');
      }
    ]);
  })();

})(angular.module('aw.servicevents', ['aw.servicevents.private']));