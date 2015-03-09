/**
 * Created by Oleg Galaburda on 08.03.2015.
 */
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