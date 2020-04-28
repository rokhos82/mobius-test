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
      "effects": {
        defense: 0,
        ar: 0
      },
      "pools": [],
      "attacks": [],
      "crits": [1,2,3,4,5]
    };

    var componentObject = {
      name: "",
      crit: ""
    };

    var fleetObject = {
      name: "",
      units: []
    };

    var critObject = {};

    services.newUnit = function() {
      return _.cloneDeep(unitObject);
    };

    services.newComponent = function() {
      return _.cloneDeep(componentObject);
    };

    services.newFleet = function() {
      return _.cloneDeep(fleetObject);
    };

    services.newCrit = function() {
      return _.cloneDeep(critObject);
    };

    return services;
  }

  factoryCtrl.$inject = []

  angular.module("mobius.helper").factory("mobius.helper.objectFactory",factoryCtrl);
})();
