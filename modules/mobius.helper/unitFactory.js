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
      "crits": [1,2,3,4,5],
      "state": {
        active: true,
        flee: false,
        effects: {},
        pools: [],
        attacks: [],
        crits: [1,2,3,4,5]
      }
    };

    var unitObject2 = {
      "info": {
        "name": "",
        "type": "",
        "size": 0
      },
      "components": [],
      "channels": {}
      "state": {
        active: true,
        flee: false,
        effects: {},
        pools: [],
        actions: []
      }
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

    var unitLog = {
      uuid: "",
      actions: [], // Things the unit did
      effects: [] // Things done to the unit
    };

    // Valid verbs: attack, flee
    var unitAction = {
      actor: "", // UUID of the actor
      target: "", // UUID of the target
      verb: "",
      data: {} // specifics vary depending on the verb
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

    services.newCrit = function() {
      return _.cloneDeep(critObject);
    };

    services.newUnitLog = function() {
      return _.cloneDeep(unitLog);
    }

    services.newUnitAction = function() {
      return _.cloneDeep(unitAction);
    }

    return services;
  }

  factoryCtrl.$inject = []

  angular.module("mobius.helper").factory("mobius.helper.objectFactory",factoryCtrl);
})();
