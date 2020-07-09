(function() {
  var app = angular.module("mobius-test",["mobius.helper","ce.service.uuid"]);

  app.controller("mtCtrl",["$scope","mobius.helper.udlParser","mobius.helper.fleetParser","UuidService","mobius.helper.combat",controller]);

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

  function logErrors(errors) {
    var entries = [];
    _.forEach(errors,function(e) {
      entries.push(log(e,"log-entry-important"));
    });
    return entries;
  }

  var combat = {};

  function controller($scope,udlParser,fleetParser,uuid,combat) {
    var $ctrl = this;

    $ctrl.critTable = initializeCritTable();

    $ctrl.title = "Mobius Testbed - CombatEngine Main Loop - v 0.2.3";
    $ctrl.output = [];
    $ctrl.combatLog = {
      turns: []
    };
    $ctrl.displayResults = false;

    $ctrl.udl = "Red One 1,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][7 target 35] DEFENSE 15";
    $ctrl.parsedExample = udlParser.parseFots($ctrl.udl).unit;

    $ctrl.fleetUdl = `The Big Ones,1,2,3,4
Red One 1,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][7 target 35] DEFENSE 15
Red One 2,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][7 target 35] DEFENSE 15
Red One 3,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][7 target 35] DEFENSE 15`;

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

    $ctrl.redFleetUdl = `Red 1,75,4,36
Red 1-1,7,7,2,2,0,0,9,9,0,0,0,[7 target 35][1 mis00A1 target 100 ammo 1] DEFENSE 15
Red 1-2,7,7,2,2,0,0,9,9,0,0,0,[7 target 35] DEFENSE 15
Red 1-3,7,7,2,2,0,0,9,9,0,0,0,[7 target 35] DEFENSE 15
Red 1-4,7,7,2,2,0,0,9,9,0,0,0,[7 target 35] DEFENSE 15`;

    $ctrl.blueFleetUdl = `Blue 2,75,4,60
Blue 1-1,14,14,4,4,0,0,15,15,0,0,0,[14 multi 7 target 35 long] DEFENSE 15 AR 2
Blue 1-2,14,14,4,4,0,0,15,15,0,0,0,[14 multi 7 target 35 long] DEFENSE 15 AR 2
Blue 1-3,14,14,4,4,0,0,15,15,0,0,0,[14 multi 7 target 35 long] DEFENSE 15 AR 2
Blue 1-4,14,14,4,4,0,0,15,15,0,0,0,[14 multi 7 target 35 long] DEFENSE 15 AR 2`;

    $ctrl.$onInit = function() {
      $ctrl.groups = {};
    };

    $ctrl.parseFleet = function(team,str) {
      $ctrl.output.push(log(`Importing ${team} fleet file`));
      var data = fleetParser.parseFots(str);
      $ctrl.output = _.concat($ctrl.output,logErrors(data.errors));
      $ctrl.groups[team] = data.group;
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
      //console.log($ctrl.combatLog);

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
        //$ctrl.output.push(log(`Adding unit ${unit.info.name} to target list`,"log-entry-action"));
        initializeUnit({
          unit: unit,
          team: "blue",
          targets: targets.red,
          units: targets.master
        });
        targets.active.push(unit.uuid);

        var stats = unitStats(unit);
      });

      settings.groups.blue.targets = targets.blue;

      // Get a list of targets for the blue team
      _.forEach(settings.groups.red.units,function(unit) {
        //$ctrl.output.push(log(`Adding unit ${unit.info.name} to target list`,"log-entry-action"));
        initializeUnit({
          unit: unit,
          team: "red",
          targets: targets.blue,
          units: targets.master
        });
        targets.active.push(unit.uuid);

        var stats = unitStats(unit);
      });

      settings.groups.red.targets = targets.red;

      return targets;
    }

    /* initializeUnit() - this function prepares a unit object for use by the
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
          unit.state.actions.push(c);
        }
        if(_.has(c,'effects.defense')) {
          unit.state.effects.defense += c.effects.defense;
        }
        if(_.has(c,'effects.ar')) {
          unit.state.effects.ar += c.effects.ar;
        }
        if(_.has(c,'health') && c.health.pool != 0) {
          c.health.remaining = c.health.pool;
          c.health.deflect = _.has(c,'effects.deflect') ? c.effects.deflect : 0;
          unit.state.pools.push(c.health);
        }
      });

      // Sort by priority then pool size.  Then reverse the order so that
      // higher priority pools are listed first.
      unit.state.pools = _.reverse(_.sortBy(unit.state.pools,['priority','pool']));

      // Setup the crit array with hull values
      // use the lowest priority pool as it should be the hull for FOTS.
      var pool = _.last(unit.state.pools);
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
      environment.info = {
        turn: 0
      };

      var done = false;
      var count = 0;
      var limit = 100;
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
        combatLog.push(state);
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
        state.info.turn = count;

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

      var atk = _.filter(unit.components,'attack');
      var bm = 0;
      var tp = 0;
      _.forEach(atk,function(a) {
        if(a.type === "beam") {
          bm += a.attack.volley;
        }
        else if(a.type === "torp") {
          tp += a.attack.volley;
        }
      });

      stats.beam = bm;
      stats.torp = tp;

      return stats;
    }

    function deathCheck(unit) {
      var ded = false;

      if(_.last(unit.state.pools).remaining <= 0 || unit.state.dead) {
        ded = true;
        unit.state.active = false;
      }

      return ded;
    }

    /* critCheck - this function determines if a unit has had a critical hit.
     * Standard FOTS rules say that a unit suffers a crit every 20% of it's hull.
    */
    function doCrit(state,unit) {
      var crit = [];
      var remaining = _.last(unit.state.pools).remaining;

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

    ////////////////////////////////////////////////////////////////////////////
    // longCheck - checks to see if there are any long range capable units
    // involved in the combat
    ////////////////////////////////////////////////////////////////////////////
    function longCheck(state) {
      var long = false;
      state.targets.long = [];

      _.forEach(state.targets.master,function(unit) {
        var l = false;
        _.forEach(unit.state.actions,function(attack) {
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

    ////////////////////////////////////////////////////////////////////////////
    //  combatTurn - this is the main combat event loop processor //////////////
    ////////////////////////////////////////////////////////////////////////////
    function combatTurn(state,prevState) {
      console.log(`%cMOBIUS: Entering combatTurn(${state.info.turn})`,'color: orange;');
      // Loop through all of the active units and process their turns
      _.forEach(state.targets.active,function(u) {
        var unit = state.targets.master[u];
        console.log(`MOBIUS: Working on unit ${unit.info.name}`);

        processUnit(unit,state);
      });

      // Determine and apply the final results of the actions queue from
      // above
      applyEffects2(state);

      // Cleanup dead units and anything else
      turnCleanup(state);
    }

    ////////////////////////////////////////////////////////////////////////////
    // processUnit - perform actions that the unit can take
    ////////////////////////////////////////////////////////////////////////////
    function processUnit(unit,state) {
      console.log(`MOBIUS: Entering processUnit(${unit.info.name})`);
      // Get the list of attacks a unit can make
      var actions = _.filter(unit.components,function(c) {
        var attack = false;
        if(_.has(c,"attack")) {
          // The component is an attack.
          // Check if there is ammo remaining or if it doesn't use ammo
          if((_.has(c.attack,"ammo") && c.attack.ammo > 0) || !_.has(c.attack,"ammo")) {
            attack = true;
          }
        }
        return attack;
      });
      unit.state.initStats = unitStats(unit);

      // Choose a target or targets
      var attacks = [];
      _.forEach(actions,function(a) {
        var t = _.sample(state.targets[unit.team]);
        var target = state.targets.master[t];
        attacks.push({
          actor: unit.uuid,
          target: t,
          action: a
        });
      });

      state.attacks = _.concat(state.attacks,attacks);

      // Attack said target(s)
      _.forEach(attacks,function(a) {
        // Extract information from the attack object
        var actor = state.targets.master[a.actor];
        var target = state.targets.master[a.target];
        var attack = a.action.attack;
        console.log(`MOBIUS: ${actor.info.name} is targeting ${target.info.name}`);

        // Hand off the attack to the combat helper
        var results = combat.doAttack({
          actor: actor,
          target: target,
          attack: attack,
          mode: "limit",
          limit: 500
        });

        a.results = results.results;

        if(results.results.success) {
          var msg = log(`${actor.info.name} fires on ${target.info.name} scoring ${results.results.damage} hits!`,"log-entry-green");
          state.log.push(msg);
        }
        else {
          var msg = log(`${actor.info.name} fires on ${target.info.name} and misses.`,"log-entry-warn");
          state.log.push(msg);
        }
      });
    }

    ////////////////////////////////////////////////////////////////////////////
    // selectTarget -
    ////////////////////////////////////////////////////////////////////////////
    function selectTarget(unit,state) {
      console.log(`MOBIUS: Entering selectTarget for ${unit.name.info}`);
      var t = _.sample(state.targets[unit.team]);
      var target = state.targets.master[t];

      var msg = log(`${unit.info.name} is targeting ${target.info.name}`,"log-entry-action");
      state.log.push(msg);

      return {
        actor: unit.uuid,
        target: t,
        action: a.name
      };
    }

    ////////////////////////////////////////////////////////////////////////////
    // applyEffects - make the things stick!
    ////////////////////////////////////////////////////////////////////////////
    function applyEffects(state) {
      console.log(`MOBIUS: Entering applyEffects()`);
      // Do turn cleanup
      _.forEach(state.attacks,function(attack) {
        // Apply damage as necessary
        if(attack.results.success) {
          var target = state.targets.master[attack.target];
          // Get all health pools
          var pools = target.state.pools;
          var remainder = attack.results.damage;
          console.log(`%cMOBIUS: Applying ${remainder} damage to ${target.info.name}`,'color: red;');
          // If there are any hitpoints left in a pool, apply damage
          _.forEach(pools,function(p) {
            var deflect = p.deflect;
            if(deflect > 0) {
              remainder = ((remainder - deflect) > 0) ? (remainder - deflect) : 0;
              var msg = log(`${target.info.name} deflects ${deflect} damage leaving ${remainder} damage`,"log-entry-warn");
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
    }

    ////////////////////////////////////////////////////////////////////////////
    // applyEffects2 - make the things stick!  but with functions!
    ////////////////////////////////////////////////////////////////////////////
    function applyEffects2(state) {
      console.log(`MOBIUS: Entering applyEffects2()`);
      // Do turn cleanup
      _.forEach(state.attacks,function(attack) {
        // Calculate the damage that is applied to the targets
        console.log(attack.results)
        if(attack.results.success) {
          var results = combat.calcDamage({
                target: attack.target,
                damage: attack.results.damage
          });
          _.merge(attack.results,results);
          console.log(attack.results);
          combat.applyDamage({
            target: attack.target,
            results: attack.results
          });
        }
      });
    }

    ////////////////////////////////////////////////////////////////////////////
    // turnCleanup - end of turn house keeping
    ////////////////////////////////////////////////////////////////////////////
    function turnCleanup(state) {
      console.log(`MOBIUS: Entering turnCleanup()`);
      // Decide who is now dead
      var removal = [];

      // Get the list of active units
      var list = _.filter(state.targets.master,['state.active',true]);

      _.forEach(list,function(unit) {
        //var unit = state.targets.master[u];
        var stats = unitStats(unit);
        unit.state.stats = stats;
        //var msg = log(`${unit.info.name} Sh=${stats.shield} Hl=${stats.hull}`);
        //state.log.push(msg);

        var crits = doCrit(state,unit);
        _.forEach(crits,function(crit) {
          var msg = log(`${unit.info.name} has suffered a critical hit: ${crit.text}`);
          state.log.push(msg);
          if(crit.action === "death") {
            unit.state.dead = true;
          }
          else if(crit.action === "dmg") {
          }
        });

        if(deathCheck(unit)) {
          var msg = log(`${unit.info.name} has been destroyed`,"log-entry-important");
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

    ////////////////////////////////////////////////////////////////////////////
    //  initializeCritTable - this function sets up the critical hit tables
    //    used by the combat engine.
    ////////////////////////////////////////////////////////////////////////////
    function initializeCritTable() {
      var ct = {
        maxRoll: 0,
        results: [
          _.fill([1],{text:`Reactor Core Breach (Ship explodes)`,action:"death"}),
          _.fill([2,3],{text:`Structural Collapse (+15% damage)`,action:"dmgAmp",dmgAmp:0.15}),
          _.fill([4,5,6],{text:`Explosion Amidships (+10% damage)`,action:"dmgAmp",dmgAmp:0.1}),
          _.fill([7,8,9,10,11,12],{text:`Superstructure Hit (+5% damage)`,action:"dmgAmp",dmgAmp:0.05}),
          _.fill([13,14,15,16,17,18,19,20,21,22,23,24,25],{text:`Generic non-lethal crit +1 damage`,action:"dmg",dmg:1}),
          _.fill([26,27,28,29,30,31,32,33],{text:`Generic non-lethal crit +2 damage`,action:"dmg",dmg:2}),
          _.fill([34,35,36,37],{text:`Generic non-leathal crit +3 damage`,action:"dmg",dmg:3})
        ]
      };

      ct.results = _.flatten(ct.results);
      ct.maxRoll = ct.results.length - 1;

      return ct;
    }

    ////////////////////////////////////////////////////////////////////////////
    // makeFOTSUdl - this function takes a unit object and creates a FOTS
    //  UDL from that object
    ////////////////////////////////////////////////////////////////////////////
    function makeFOTSUdl(unit) {
      var udl = `${unit.info.name},${unit.state.stats.beam},${unit.state.stats.shield}`;
      return udl;
    }
  }
})();
