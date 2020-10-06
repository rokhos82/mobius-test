(function() {
  /** Technology definition factory
  */

  var factoryCtrl = function(__mechanic) {
    var __services = {};

    return __services;
  };

  factoryCtrl.$inject = ["mobius.tech-library.mechanic"];

  angular.module("mobius.tech-library").factory("mobius.tech-library.tech",factoryCtrl);
})();
