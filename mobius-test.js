(function() {
  var app = angular.module("mobius-test",["mobius.helper","ce.service.uuid"]);

  app.controller("mtCtrl",["$scope","mobius.helper.udlParser","mobius.helper.fleetParser","UuidService",controller]);

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

  function controller($scope,udlParser,fleetParser,uuid) {
    var $ctrl = this;

    $ctrl.critTable = initializeCritTable();

    $ctrl.title = "Mobius Testbed - CombatEngine Main Loop";
    $ctrl.output = [];
    $ctrl.combatLog = {
      turns: []
    };
    $ctrl.displayResults = false;

    $ctrl.udl = "Red One 1,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][7 target 35] DEFENSE 15";
    $ctrl.parsedExample = udlParser.parseFots($ctrl.udl);

    $ctrl.fleetUdl = `The Big Ones,1,2,3,4
Red One 1,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][7 target 35] DEFENSE 15
Red One 2,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][7 target 35] DEFENSE 15
Red One 3,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][7 target 35] DEFENSE 15`;
    //$ctrl.parseFleet = fleetParser.parseFots($ctrl.fleetUdl);

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

    $ctrl.redFleetUdl = `Red 1,1,2,3,4
Red One 1,7,7,2,2,0,0,9,9,0,0,0,[7 target 35] DEFENSE 15
Red One 2,7,7,2,2,0,0,9,9,0,0,0,[7 target 35] DEFENSE 15
Red One 3,7,7,2,2,0,0,9,9,0,0,0,[7 target 35] DEFENSE 15`;

    $ctrl.blueFleetUdl = `Blue 2,1,2,3,4
Blue One 1,14,14,4,4,0,0,15,15,0,0,0,[7 target 35][7 target 35] DEFENSE 15 AR 2`;

    $ctrl.$onInit = function() {
      $ctrl.groups = {
        //blue: angular.fromJson($ctrl.blueExample),
        //blue: fleetParser.parseFots($ctrl.blueFleetUdl),
        //red: angular.fromJson($ctrl.redExample)
        //red: fleetParser.parseFots($ctrl.redFleetUdl)
      };
    };

    $ctrl.parseFleet = function(team,str) {
      $ctrl.groups[team] = fleetParser.parseFots(str);
    };

    /* startCombat - this function is the onclick event for the start
     * combat button on the UI.
    */
    $ctrl.startCombat = function() {
      $ctrl.displayResults = false;
      $ctrl.output = [];
      $ctrl.output.push(log("Starting combat simulation"));
      $ctrl.combatLog = {};

      // Pre combat prep
      var environment = setupCombat($ctrl.groups,$ctrl.critTable);

      // Start the main combat loop
      $ctrl.combatLog.turns = doCombat(environment);
      console.log($ctrl.combatLog);

      // Finish up combat logs
      $ctrl.displayResults = true;
    };

    /* setupCombat - this function sets up the initial state object
     * that the combat loop runs on
    */
    function setupCombat(groups,crits) {
      $ctrl.output.push(log("Setting up combat"));

      var settings = {};
      settings.groups = _.cloneDeep(groups);
      settings.crits = crits;

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
        master: {},
        active: []
      };

      // Get a list of targets for the red team
      _.forEach(settings.groups.blue.units,function(unit) {
        //$ctrl.output.push(log(`Adding unit ${unit.name} to target list`,"log-entry-action"));
        initializeUnit({
          unit: unit,
          team: "blue",
          targets: targets.red,
          units: targets.master
        });
        targets.active.push(unit.uuid);

        var stats = unitStats(unit);
        //var msg = log(`${unit.name} has ${stats.hull} hull and ${stats.shield} shields`);
        //$ctrl.output.push(msg);
      });

      settings.groups.blue.targets = targets.blue;

      // Get a list of targets for the blue team
      _.forEach(settings.groups.red.units,function(unit) {
        //$ctrl.output.push(log(`Adding unit ${unit.name} to target list`,"log-entry-action"));
        initializeUnit({
          unit: unit,
          team: "red",
          targets: targets.blue,
          units: targets.master
        });
        targets.active.push(unit.uuid);

        var stats = unitStats(unit);
        //var msg = log(`${unit.name} has ${stats.hull} hull and ${stats.shield} shields`);
        //$ctrl.output.push(msg);
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

      // Set the team for the unit
      unit.team = team;
      unit.uuid = uuid.generate();

      // Add the team to the correct target list and the master unit list
      data.targets.push(unit.uuid);
      data.units[unit.uuid] = unit;

      // Assign defaults to components that need them
      // Also compute aggregate values for some tags like DEFENSE
      _.forEach(unit.components,function(c) {
        if(_.has(c,'attack')) {
          c.attack.target = _.isNumber(c.attack.target) ? c.attack.target : 0;
          c.attack.yield = _.isNumber(c.attack.yield) ? c.attack.yield : 0;
          unit.attacks.push(c);
        }
        if(_.has(c,'effects.defense')) {
          unit.effects.defense += c.effects.defense;
        }
        if(_.has(c,'effects.ar')) {
          unit.effects.ar += c.effects.ar;
        }
        if(_.has(c,'health') && c.health.pool != 0) {
          c.health.remaining = c.health.pool;
          c.health.deflect = _.has(c,'effects.deflect') ? c.effects.deflect : 0;
          unit.pools.push(c.health);
        }
      });

      // Sort by priority then pool size.  Then reverse the order so that
      // higher priority pools are listed first.
      unit.pools = _.reverse(_.sortBy(unit.pools,['priority','pool']));

      // Setup the crit array with hull values
      // use the lowest priority pool as it should be the hull for FOTS.
      var pool = _.last(unit.pools);
      unit.crits = [
        _.round(pool.remaining * .8),
        _.round(pool.remaining * .6),
        _.round(pool.remaining * .4),
        _.round(pool.remaining * .2),
        0
      ];
    }

    function setupCombatBoard(settings) {
      $ctrl.output.push(log("Building game board"));
    }

    ////////////////////////////////////////////////////////////////////////////
    //  MAIN COMBAT LOOP  //////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    function doCombat(environment) {
      $ctrl.output.push(log("Begin Combat!","log-entry-important"));

      environment.log = [];
      environment.attacks = [];

      var done = false;
      var count = 0;
      var limit = 1000;
      var state = _.cloneDeep(environment);
      var prevState = _.cloneDeep(environment);
      var combatLog = [];

      // Check to see if there are any long range weapons in the combat
      if(longCheck(state)) {
        var msg = log(`Long range units detected`);
        $ctrl.output.push(msg);

        var active = state.targets.active;
        state.targets.active = state.targets.long;
        combatTurn(state);
        state.targets.active = active;

        prevState = state;
        state = _.cloneDeep(state);
        state.log = [];
        state.attacks = [];
      }

      // Main combat loop
      while(!done) {
        count++;
        if(count >= limit) {
          done = true;
        }
        $ctrl.output.push(log(`Begin Turn ${count}`,"log-entry-important"));

        // Do combat turn
        combatTurn(state,prevState);

        // Get ready for the next turn
        combatLog.push(state);
        if(gameOver(state)) {
          done = true;
        }
        else {
          prevState = state;
          state = _.cloneDeep(state);
          state.log = [];
          state.attacks = [];
        }
      }

      $ctrl.output.push(log("End Combat!","log-entry-important"));
      return combatLog;
    }

    function unitStats(unit) {
      var stats = {};

      var hp = _.filter(unit.components,'health');
      _.forEach(hp,function(h) {
        stats[h.name] = _.has(stats,h.name) ? stats[h.name] + h.health.remaining : h.health.remaining;
      });

      return stats;
    }

    function deathCheck(unit) {
      var ded = false;

      if(_.last(unit.pools).remaining <= 0) {
        ded = true;
      }

      return ded;
    }

    /* critCheck - this function determines if a unit has had a critical hit.
     * Standard FOTS rules say that a unit suffers a crit every 20% of it's hull.
    */
    function doCrit(state,unit) {
      var crit = [];
      var remaining = _.last(unit.pools).remaining;

      if(_.isNumber(unit.crits[0]) && remaining <= unit.crits[0]) {
        // Crit #1
        unit.crits[0] = rollCrit(state.crits);
        crit.push(unit.crits[0]);
      }
      if(_.isNumber(unit.crits[1]) && remaining <= unit.crits[1]) {
        // Crit #2
        unit.crits[1] = rollCrit(state.crits);
        crit.push(unit.crits[1]);
      }
      if(_.isNumber(unit.crits[2]) && remaining <= unit.crits[2]) {
        // Crit #3
        unit.crits[2] = rollCrit(state.crits);
        crit.push(unit.crits[2]);
      }
      if(_.isNumber(unit.crits[3]) && remaining <= unit.crits[3]) {
        // Crit #4
        unit.crits[3] = rollCrit(state.crits);
        crit.push(unit.crits[3]);
      }
      if(_.isNumber(unit.crits[4]) && remaining <= unit.crits[4]) {
        // Crit #5
        unit.crits[4] = rollCrit(state.crits);
        crit.push(unit.crits[4]);
      }

      return crit;
    }

    /* rollCrit - select an event at random from table
    */
    function rollCrit(table) {
      var roll = _.random(0,table.maxRoll);
      return table.results[roll];
    }

    /* gameOver - determines if the simulation is done running
    */
    function gameOver(state) {
      var done = false;

      if(state.targets.red.length == 0 || state.targets.blue.length == 0) {
        done = true;
      }

      return done;
    }

    /* longCheck - checks to see if there are any long range capable units
     * involved in the combat
     */
    function longCheck(state) {
      var long = false;
      state.targets.long = [];

      _.forEach(state.targets.master,function(unit) {
        var l = false;
        _.forEach(unit.attacks,function(attack) {
          if(_.has(attack,'attack.long')) {
            long = true;
            l = true;
          }
        });
        if(l) {
          state.targets.long.push(unit.uuid);
        }
      });

      return long;
    }

    function combatTurn(state,prevState) {
      _.forEach(state.targets.active,function(u) {
        var unit = state.targets.master[u];
        var msg = `Planning turn for ${unit.name}`;
        //$ctrl.output.push(log(msg,"log-entry-purple"));
        state.log.push(log(msg,"log-entry-purple"));
        // Need to make this a permanent entry into a combat action log

        // Get the list of attacks a unit can make
        var actions = _.filter(unit.components,'attack');

        // Choose a target or targets
        var attacks = [];
        _.forEach(actions,function(a) {
          var t = _.sample(state.targets[unit.team]);
          var target = state.targets.master[t];
          attacks.push({
            actor: unit.uuid,
            target: t,
            action: a.name
          });
          var msg = log(`${unit.name} is targeting ${target.name}`,"log-entry-action")
          //$ctrl.output.push(msg);
          state.log.push(msg);
        });

        state.attacks = _.concat(state.attacks,attacks);

        // Attack said target(s)
        _.forEach(attacks,function(a) {
          // Roll for to hit and then damage
          var hit = _.random(1,1000,false);
          var def = _.random(1,1000,false);

          var actor = state.targets.master[a.actor];
          var target = state.targets.master[a.target];
          var attack = _.filter(actor.components,['name',a.action])[0].attack;

          // I should determine target here not earlier....the earlier loop is unnecessary!
          var msg = log(`${actor.name} is attacking ${target.name} with ${a.action}`,"log-entry-green");
          //$ctrl.output.push(msg);
          state.log.push(msg);

          hit = hit + attack.target;
          a.hit = hit;
          var msg = log(`${actor.name} rolled a hit roll of ${hit} (${attack.target})`);
          //$ctrl.output.push(msg);
          state.log.push(msg);

          def = def + target.effects.defense;
          a.def = def;
          var msg = log(`${actor.name} rolled a def roll of ${def} (${target.effects.defense})`);
          //$ctrl.output.push(msg);
          state.log.push(msg);

          if(hit > def) {
            // Yay a hit!
            msg = log(`${actor.name} successfully hit ${target.name}`);
            //$ctrl.output.push(msg);
            state.log.push(msg);

            // Roll damage
            var dmgRoll = _.random(1,1000,false) + attack.yield;
            dmgRoll = dmgRoll > 1000 ? 1000 : dmgRoll;
            dmgRoll = dmgRoll < 0 ? 0 : dmgRoll;
            var dmg = _.round(attack.volley * dmgRoll / 1000);
            a.damage = dmg;
            var msg = log(`${actor.name} did ${dmg} damage to ${target.name}`,"log-entry-green");
            //$ctrl.output.push(msg);
            state.log.push(msg);
          }
          else {
            // Slippery little devil
            msg = log(`${actor.name} did not hit ${target.name}`,"log-entry-warn");
            //$ctrl.output.push(msg);
            state.log.push(msg);
          }
        });
      });

      // Do turn cleanup
      _.forEach(state.attacks,function(attack) {
        // Apply damage as necessary
        if(attack.damage) {
          var target = state.targets.master[attack.target];
          // Get all health pools
          var pools = target.pools;
          var remainder = attack.damage;
          // If there are any hitpoints left in a pool, apply damage
          _.forEach(pools,function(p) {
            var deflect = p.deflect;
            if(deflect > 0) {
              remainder = ((remainder - deflect) > 0) ? (remainder - deflect) : 0;
              var msg = log(`${target.name} deflects ${deflect} damage leaving ${remainder} damage`,"log-entry-warn");
              //$ctrl.output.push(msg);
              state.log.push(msg);
            }
            if(remainder > 0 && p.remaining > 0) {
              // There is damage left and the pool has hitpoints apply it
              if(p.remaining > remainder) {
                p.remaining -= remainder;
                remainder = 0;
              }
              else {
                remainder -= p.remaining;
                p.remaining = 0;
              }

              // If the pool allows for transfer, reset the remainder value
              if(!p.transfer) {
                remainder = 0;
              }
            }
          });
        }
      });

      // Decide who is now dead
      var removal = [];
      _.forEach(state.targets.master,function(unit) {
        //var unit = state.targets.master[u];
        var stats = unitStats(unit);
        var msg = log(`${unit.name} has ${stats.hull} hull and ${stats.shield} shields`);
        //$ctrl.output.push(msg);
        state.log.push(msg);

        var crits = doCrit(state,unit);
        _.forEach(crits,function(crit) {
          var msg = log(`${unit.name} has suffered a critical hit: ${crit.text}`);
          //$ctrl.output.push(msg);
          state.log.push(msg);
        });

        if(deathCheck(unit)) {
          var msg = log(`${unit.name} has been destroyed`,"log-entry-important");
          //$ctrl.output.push(msg);
          state.log.push(msg);

          //state.targets.active = _.pull(state.targets.active,unit.uuid);
          removal.push(unit.uuid);

          // Remove the unit from the target lists
          if(unit.team === "blue") {
            state.targets.red = _.pull(state.targets.red,unit.uuid);
          }
          else if(unit.team === "red") {
            state.targets.blue = _.pull(state.targets.blue,unit.uuid);
          }
          else {
            console.error("Well shit");
          }
        }
      });
      _.pullAll(state.targets.active,removal);
    }

    function initializeCritTable() {
      var ct = {
        maxRoll: 0,
        results: [
          _.fill([1],{text:`Reactor Core Breach (Ship explodes)`,action:"death"}),
          _.fill([2,3],{text:`Structural Collapse (+15% damage)`,action:"dmgAmp",mod:0.15}),
          _.fill([4,5],{text:`Explosion Amidships (+10% damage)`,action:"dmgAmp",mod:0.1}),
          _.fill([6,7],{text:`Superstructure Hit (+5% damage)`,action:"dmgAmp",mod:0.05}),
          _.fill([8,9,10,11,12,13,14,15,16,17,18,19,20],{text:`Generic non-lethal crit`,action:"none"})
        ]
      };

      ct.results = _.flatten(ct.results);
      ct.maxRoll = ct.results.length - 1;

      return ct;
    }
  }
})();
