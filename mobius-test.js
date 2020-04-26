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

  var combat = {};

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

    $ctrl.$on = function() {};

    $ctrl.startCombat = function() {
      $ctrl.output.push(log("Starting combat simulation"));

      // Pre combat prep
      var environment = setupCombat($ctrl.groups);

      // Start the main combat loop
      doCombat(environment);

      // Finish up combat logs
    };

    function setupCombat(groups) {
      $ctrl.output.push(log("Setting up combat"));

      var settings = {};
      settings.groups = groups;

      // Prebuilt target lists
      var targets = buildTargetLists(settings);
      settings.targets = targets;

      // Setup combat board - and how to handle long range units?
      setupCombatBoard(settings);

      return settings;
    }

    function buildTargetLists(settings) {
      $ctrl.output.push(log("Building target lists"));

      var targets = {
        red: [],
        blue: [],
        master: {}
      };

      /*
       *   DO I NEED TO GENERATE A UUID for each unit during each combat?
       *   I am thinking the answer is yes!
       *
       */

      // Get a list of targets for the red team
      _.forEach(settings.groups.blue.units,function(unit) {
        $ctrl.output.push(log(`Adding unit ${unit.name} to target list`,"log-entry-action"));
        targets.red.push(unit.name);
        targets.master[unit.name] = unit;
      });

      settings.groups.blue.targets = targets.blue;

      // Get a list of targets for the blue team
      _.forEach(settings.groups.red.units,function(unit) {
        $ctrl.output.push(log(`Adding unit ${unit.name} to target list`,"log-entry-action"));
        targets.blue.push(unit.name);
        targets.master[unit.name] = unit;
      });

      settings.groups.red.targets = targets.red;

      return targets;
    }

    function setupCombatBoard(settings) {
      $ctrl.output.push(log("Building game board"));
    }

    function doCombat(settings) {
      $ctrl.output.push(log("Begin Combat!","log-entry-important"));

      var done = false;
      var count = 0;
      var limit = 10;

      // Main combat loop
      while(!done) {
        count++;
        if(count >= limit) {
          done = true;
        }
        $ctrl.output.push(log(`Begin Turn ${count}`,"log-entry-important"));

        _.forEach(settings.targets.master,function(unit) {
          $ctrl.output.push(log(`Doing something for ${unit.name}`,"log-entry-action"));
        });
      }

      $ctrl.output.push(log("End Combat!","log-entry-important"));
    }
  }
})();
