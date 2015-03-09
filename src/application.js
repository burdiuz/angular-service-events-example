/**
 * Created by Oleg Galaburda on 08.03.2015.
 */
(function (module) {
  /**
   * Main application which uses main service
   * @param {CustomService} customService
   * @constructor
   */
  function ApplicationController(customService) {

    // ask service to send events

    customService.start();

    this.inputData = "Data for RESET event";

    this.reset = function(){
      customService.reset(this.inputData);
      console.log('Sent event "reset" with data:', this.inputData);
    };

    console.log('ApplicationController created');
  }
  module.controller("Application", [
    "customService",
    ApplicationController
  ]);
})(angular.module("application", ["aw.servicevents"]));