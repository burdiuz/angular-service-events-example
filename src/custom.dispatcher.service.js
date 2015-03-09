/**
 * Created by Oleg Galaburda on 08.03.2015.
 * @export CustomServiceDispatcher
 */
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