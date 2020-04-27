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

    var fleetObject = {
      name: "",
      units: []
    };

    services.newUnit = function() {
      return _.cloneDeep(unitObject);
    };

    services.newComponent = function() {
      return _.cloneDeep(componentObject);
    };

    services.newFleet = function() {
      return _.cloneDeep(fleetObject);
    };

    return services;
  }

  factoryCtrl.$inject = []

  angular.module("mobius.helper").factory("mobius.helper.objectFactory",factoryCtrl);
})();
