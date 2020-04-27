(function() {
  /*  unitFactory
   *
   */
  function factoryCtrl() {
    var services = {};

    var unitObject = {
      "name": "",
      "size": 0,
      "type": "",
      "components": [],
      "effects": {},
      "pools": []
    };

    var componentObject = {
      name: "",
      crit: ""
    };

    services.new = function() {
      return _.cloneDeep(unitObject);
    };

    services.newComponent = function() {
      return _.cloneDeep(componentObject);
    };

    return services;
  }

  factoryCtrl.$inject = []

  angular.module("mobius.helper").factory("mobius.helper.unitFactory",factoryCtrl);
})();
