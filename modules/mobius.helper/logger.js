(function() {
  //////////////////////////////////////////////////////////////////////////////
  // Logging levels:
  // 1) error
  // 2) warning
  // 3) log
  // 4) info
  // 5) detail
  //////////////////////////////////////////////////////////////////////////////

  function factoryCtrl() {
    var services = {};
    var settings = {};

    /* This function takes a dictionary of logging levels mapped to
     * one or more CSS classes.  These classes are used by the logger
     * component.
    */
    services.setLevelCSSClasses = function(data) {
      settings.levelClassMap = data;
    };

    return services;
  }

  factoryCtrl.$inject = [];

  angular.module("mobius.helper").factory("mobius.helper.logger",factoryCtrl);
})();
