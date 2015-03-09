/**
 * Created by Oleg Galaburda on 08.03.2015.
 */
(function (module) {

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

})(angular.module("application"));