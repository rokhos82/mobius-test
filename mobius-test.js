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
    $ctrl.combatLog = {};

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

    $ctrl.blueExample = `{"name":"Blue Two","units":[{"name": "Blue Two 1","size": 6,"type": "starship","components": [{"name": "hull","crit": "unitBase","health": {"pool": 9,"priority": 1},"presence": {"magnitude": 6,"channel": 1}},{"name": "shield","crit": "shield","health": {"pool": 2,"priority": 2,"transfer": false},"energy": {"draw": 2}},{"name": "beam 1","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "beam 2","crit": "battery","attack": {"volley": 7,"target": 350},"energy": {"draw": 7}},{"name": "stl","crit": "engine","effects": {"defense": 150}},{"name": "lrs","crit": "sensor","sensor": {"strength": 1,"channel": 1,"resolution": 1},"energy": {"draw": 1}},{"name": "reactor","crit": "powerPlant","energy": {"capacity": 72}}]}]}`;

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
      $ctrl.combatLog.turns = doCombat(environment);
      console.log($ctrl.combatLog);

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
        initializeUnit({
          unit: unit,
          team: "blue",
          targets: targets.red,
          units: targets.master
        });
      });

      settings.groups.blue.targets = targets.blue;

      // Get a list of targets for the blue team
      _.forEach(settings.groups.red.units,function(unit) {
        $ctrl.output.push(log(`Adding unit ${unit.name} to target list`,"log-entry-action"));
        initializeUnit({
          unit: unit,
          team: "red",
          targets: targets.blue,
          units: targets.master
        });
      });

      settings.groups.red.targets = targets.red;

      return targets;
    }

    /*
     *  initializeUnit() - this function prepares a unit object for use by the
     * combat engine.  THis includes additional linking between groups
     * and target lists, setting defaults in components, etc.
     */
    function initializeUnit(data) {
      var unit = data.unit;
      var team = data.team;

      unit.team = team;

      data.targets.push(unit.name);
      data.units[unit.name] = unit;

      _.forEach(unit.components,function(c) {
        if(_.has(c,'attack')) {
          c.attack.target = _.isNumber(c.attack.target) ? c.attack.target : 0;
        }
      });
    }

    function setupCombatBoard(settings) {
      $ctrl.output.push(log("Building game board"));
    }

    function doCombat(environment) {
      $ctrl.output.push(log("Begin Combat!","log-entry-important"));

      environment.log = [];
      environment.attacks = [];

      var done = false;
      var count = 0;
      var limit = 10;
      var state = _.cloneDeep(environment);
      var combatLog = [];

      // Main combat loop
      while(!done) {
        count++;
        if(count >= limit) {
          done = true;
        }
        $ctrl.output.push(log(`Begin Turn ${count}`,"log-entry-important"));

        _.forEach(state.targets.master,function(unit) {
          var msg = `Planning turn for ${unit.name}`;
          $ctrl.output.push(log(msg,"log-entry-purple"));
          state.log.push(log(msg,"log-entry-purple"));
          // Need to make this a permanent entry into a combat action log

          // Get the list of attacks a unit can make
          var actions = _.filter(unit.components,'attack');

          // Choose a target or targets
          var attacks = [];
          _.forEach(actions,function(a) {
            var target = _.sample(state.targets[unit.team]);
            attacks.push({
              actor: unit.name,
              target: target,
              action: a.name
            });
            var msg = log(`${unit.name} is targeting ${target}`,"log-entry-action")
            $ctrl.output.push(msg);
            state.log.push(msg);
          });

          state.attacks[unit.name] = attacks;

          // Attack said target(s)
          _.forEach(attacks,function(a) {
            // Roll for to hit and then damage
            var hit = _.random(1,1000,false);
            var def = _.random(1,1000,false);

            var actor = state.targets.master[a.actor];
            var target = state.targets.master[a.target];
            var attack = _.filter(actor.components,['name',a.action])[0].attack;
            console.info(attack);

            var msg = log(`${a.actor} is attacking ${a.target} with ${a.action}`,"log-entry-green");
            $ctrl.output.push(msg);
            state.log.push(msg);

            hit = hit + attack.target;
            var msg = log(`${actor.name} rolled a hit roll of ${hit} (${attack.target})`);
            $ctrl.output.push(msg);
            state.log.push(msg);

            var dmg = _.random(1,attack.volley,false);
            a.damage = dmg;
            var msg = log(`${a.actor} did ${dmg} damage`,"log-entry-green");
            $ctrl.output.push(msg);
            state.log.push(msg);
          });
        });

        // Do turn cleanup
        _.forEach(state.attacks,function(set) {
          // Apply damage as necessary
        });

        combatLog.push(state);
        state = _.cloneDeep(state);
        state.log = [];
        state.attacks = [];
      }

      $ctrl.output.push(log("End Combat!","log-entry-important"));
      return combatLog;
    }
  }
})();
