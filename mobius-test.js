(function() {
  var app = angular.module("mobius-test",[]);

  app.controller("mtCtrl",["$scope",controller]);

  var outputItem = {
    klass: "log-entry-info",
    text: "Test"
  };

  function log(text,klass) {
    var entry = _.clone(outputItem);
    entry.text = text;
    entry.klass = _.isString(klass) ? klass : "log-entry-info";
    return entry;
  }

  function controller() {
    var $ctrl = this;

    $ctrl.title = "Mobius Testbed - CombatEngine Main Loop";
    $ctrl.output = [];

    $ctrl.exampleUnit = {
      "name": "Red One 1",
      "size": 6,
      "type": "starship",
      "components": [
        {"name": "hull","crit": "unitBase","health": {"pool": 9,"priority": 1},"presence": {"magnitude": 6,"channel": 1}},
        {"name": "shield","crit": "shield","health": {"pool": 2,"priority": 2,"transfer": false},"energy": {"draw": 2}},
        {"name": "beam","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},
        {"name": "stl","crit": "engine","effects": {"defense": 150}},
        {"name": "lrs","crit": "sensor","sensor": {"strength": 1,"channel": 1,"resolution": 1},"energy": {"draw": 1}},
        {"name": "reactor","crit": "powerPlant","energy": {"capacity": 72}}
      ]
    };

    $ctrl.redExample = `{"name":"Red One","units": [{"name": "Red One 1","size": 6,"type": "starship","components": [{"name": "hull","crit": "unitBase","health": {"pool": 9,"priority": 1},"presence": {"magnitude": 6,"channel": 1}},{"name": "shield","crit": "shield","health": {"pool": 2,"priority": 2,"transfer": false},"energy": {"draw": 2}},{"name": "beam","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "stl","crit": "engine","effects": {"defense": 150}},{"name": "lrs","crit": "sensor","sensor": {"strength": 1,"channel": 1,"resolution": 1},"energy": {"draw": 1}},{"name": "reactor","crit": "powerPlant","energy": {"capacity": 72}}]},{"name": "Red One 2","size": 6,"type": "starship","components": [{"name": "hull","crit": "unitBase","health": {"pool": 9,"priority": 1},"presence": {"magnitude": 6,"channel": 1}},{"name": "shield","crit": "shield","health": {"pool": 2,"priority": 2,"transfer": false},"energy": {"draw": 2}},{"name": "beam","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "stl","crit": "engine","effects": {"defense": 150}},{"name": "lrs","crit": "sensor","sensor": {"strength": 1,"channel": 1,"resolution": 1},"energy": {"draw": 1}},{"name": "reactor","crit": "powerPlant","energy": {"capacity": 72}}]},{"name": "Red One 3","size": 6,"type": "starship","components": [{"name": "hull","crit": "unitBase","health": {"pool": 9,"priority": 1},"presence": {"magnitude": 6,"channel": 1}},{"name": "shield","crit": "shield","health": {"pool": 2,"priority": 2,"transfer": false},"energy": {"draw": 2}},{"name": "beam","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "stl","crit": "engine","effects": {"defense": 150}},{"name": "lrs","crit": "sensor","sensor": {"strength": 1,"channel": 1,"resolution": 1},"energy": {"draw": 1}},{"name": "reactor","crit": "powerPlant","energy": {"capacity": 72}}]}]}`;

    $ctrl.blueExample = `{"name":"Blue Two","units":[{"name": "Blue Two 1","size": 6,"type": "starship","components": [{"name": "hull","crit": "unitBase","health": {"pool": 9,"priority": 1},"presence": {"magnitude": 6,"channel": 1}},{"name": "shield","crit": "shield","health": {"pool": 2,"priority": 2,"transfer": false},"energy": {"draw": 2}},{"name": "beam","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "beam","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "stl","crit": "engine","effects": {"defense": 150}},{"name": "lrs","crit": "sensor","sensor": {"strength": 1,"channel": 1,"resolution": 1},"energy": {"draw": 1}},{"name": "reactor","crit": "powerPlant","energy": {"capacity": 72}}]}]}`;

    $ctrl.$onInit = function() {
      $ctrl.groups = {
        blue: angular.fromJson($ctrl.blueExample),
        red: angular.fromJson($ctrl.redExample)
      };
    };

    $ctrl.startCombat = function() {
      $ctrl.output.push(log("Starting combat"));
      $ctrl.output.push(log("Another line","log-entry-warn"))
    };
  }
})();
