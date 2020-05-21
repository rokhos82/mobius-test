(function() {
  /*  udlParser - converts old-school FOTS unit description lines (UDLs) to a more useful format.
   *
   */
  function factoryCtrl(objectFactory) {
    var services = {};

    function buildAttack(bracket) {
      var c = objectFactory.newComponent();
      c.name = "attack";
      c.crit = "battery";
      c.attack = {};
      c.attack.affinity = {};
      c.attack.volley = _.parseInt(bracket.match(/\[(?<volley>\d+)/).groups.volley);
      c.attack.battery = 1;
      c.attack.channel = "hitpoints";

      if(/target\s+\d+/.test(bracket)) {
        c.attack.target = _.parseInt(bracket.match(/target\s+(?<tar>\d+)/).groups.tar) * 10;
      }

      if(/\s+long/.test(bracket)) {
        c.attack.long = true;
      }

      if(/ammo\s+\d+\s*/.test(bracket)) {
        c.attack.ammo = _.parseInt(bracket.match(/ammo\s+(?<ammo>\d+)/).groups.ammo);
      }

      if(/yield\s+\d+/.test(bracket)) {
        c.attack.yield = _.parseInt(bracket.match(/yield\s+(?<yield>\d+)/).groups.yield) * 10;
      }

      if(/mis..../.test(bracket)) {
        c.attack.battery = c.attack.volley;
        c.attack.volley = _.parseInt(bracket.match(/mis..(?<packet>.)./).groups.packet,16);
      }

      if(/multi\s+\d+/.test(bracket)) {
        var packet = _.parseInt(bracket.match(/multi\s+(?<packet>\d+)/).groups.packet);
        c.attack.battery = c.attack.volley / packet;
        c.attack.volley = packet;
        console.log(c.attack);
      }

      if(/vibro/.test(bracket)) {
        c.attack.vibro = true;
      }

      if(/meson/.test(bracket)) {
        c.attack.meson = true;
      }

      if(/low/.test(bracket)) {
        c.attack.low = true;
      }

      if(/heat/.test(bracket)) {
        c.attack.heat = true;
      }

      if(/crack/.test(bracket)) {
        c.attack.crack = true;
      }

      if(/global/.test(bracket)) {
        c.attack.global = true;
      }

      if(/offline/.test(bracket)) {}

      if(/pen/.test(bracket)) {
        c.attack.penetrate = true;
      }

      // Check if the bracket has a hull search
      // hull A B
      // A := center point of search
      // B := steps away from center point that will match
      if(/hull\s+\d+\s+\d+/.test(bracket)) {}

      // Check for anti-fighter only targeting
      if(/af/.test(bracket)) {}

      // Check for artillery tag
      // These units can fire from the back (reserve) of the group
      if(/artillery/.test(bracket)) {}

      // Check if the weapon is a shield cracker
      if(/crack/.test(bracket)) {}

      // Check if the bracket is in a datalink
      if(/dl\s*\w*\s*/.test(bracket)) {}

      // Check if the bracket is a field effect
      if(/field/.test(bracket)) {
        c.attack.field = true;
      }

      // Check if the bracket is flak
      if(/flak/.test(bracket)) {}

      // Check if the bracket has a rate of fire
      // rof A B
      // A := Reload Delay
      // B := First Shot Delay
      // For example, rof 2 0 fires every other round and starts round 1
      // To continue, rof 2 1 fires every other round and starts round 2
      if(/rof\s*\d*\s*\d*/.test(bracket)) {
        // How to mondel this?
      }

      // Check if the brack has a scan
      // scan A B
      // A := targeting value (center point)
      // B := scope of search (deviation from center point)
      if(/scan\s+\d+\s+\d+/.test(bracket)) {
        var scan = bracket.match(/scan\s*(?<center>\d*)\s*(?<scope>\d*/).groups;
        c.attack.affinity.center = _.parseInt(scan.center);
        c.attack.affinity.scope = _.parseInt(scan.scope);
      }

      return c;
    }

    services.parseFots = function(udl) {
      // Split the UDL by the 'commas'
      var rawParts = _.split(udl,",");
      var data = {};
      data.errors = [];

      if(rawParts.length != 13) {
        data.errors.push(`Incorrect UDL. Part count is ${rawParts.length}; should be 13: ${udl}`);
      }
      else {
        var parts = {
          name: _.trim(rawParts[0],'"'),
          beam: _.parseInt(rawParts[1]),
          shields: _.parseInt(rawParts[3]),
          hull: _.parseInt(rawParts[7]),
          tags: rawParts[12]
        };

        var channels = ["hull","shield","crew","boarding","power","realspace","superluminal"];
        var groups = {
          hitpoints: ["hull","shield"]
        };

        // Get the parts of the tags string that are bracketed
        var brackets = parts.tags.match(/\[.*?\]/g);

        // Get everything after the last bracket
        var nonBracket = _.trim(parts.tags.slice(parts.tags.lastIndexOf("]")+1));

        // Extract information from the non-bracketed tags
        if(/^\s*DEFENSE\s+(-?\d+)\s*/.test(nonBracket)) {
          parts.defense = _.parseInt(nonBracket.match(/^\s*DEFENSE\s+(?<def>-?\d+)\s*/).groups.def);
        }

        if(/^\s*TARGET\s+(-?\d+)\s*/.test(nonBracket)) {
          parts.target = _.parseInt(nonBracket.match(/^\s*TARGET\s+(?<tar>-?\d+)\s*/).groups.tar);
        }

        if(/^\s*AR\s+(\d+)\s*/.test(nonBracket)) {
          parts.ar = _.parseInt(nonBracket.match(/^\s*AR\s+(?<ar>\d+)\s*/).groups.ar);
        }

        if(/^\s*SR\s+(\d+)\s*/.test(nonBracket)) {
          parts.sr = _.parseInt(nonBracket.match(/^\s*SR\s+(?<sr>\d+)\s*/).groups.sr);
        }

        if(/^\s*RESIST\s+(\d+)\s*/.test(nonBracket)) {
          parts.resist = _.parseInt(nonBracket.match(/^\s*RESIST\s+(?<resist>\d+)\s*/).groups.resist);
        }

        if(/^\s*FLICKER\s+(\d+)\s*/.test(nonBracket)) {
          parts.flicker = _.parseInt(nonBracket.match(/^\s*FLICKER\s+(?<flicker>\d+)\s*/).groups.flicker);
        }

        if(/^\s*DELAY\s+(\d+)/.test(nonBracket)) {}

        if(/^\s*DAMAGE\s+(\d+)/.test(nonBracket)) {}

        if(/^\s*BREAK\s+(\d+)/.test(nonBracket)) {}

        if(/^\s*RESERVE\s+(\d+)/.test(nonBracket)) {}

        if(/^\s*PD\s+(\d+)/.test(nonBracket)) {}

        if(/^\s*REGEN\s+(\d+)\s+(\d+)\s+/.test(nonBracket)) {}

        if(/^\s*DL\s+(\w+)\s+/.test(nonBracket)) {}

        if(/^\s*HULL\s+(\d+)\s+(\d+)\s+/.test(nonBracket)) {}

        // Check if the unit has a TIME tag
        // TIME A
        // A := Unit flees after A rounds
        if(/^\s*TIME\s+\d+/.test(nonBracket)) {}

        // Check if the unit has a DELAY tag
        // DELAY A
        // A := Unit enters combat after A rounds
        if(/^\s*DELAY\s+\d+/.test(nonBracket)) {}

        // Check if the unit has a personal break off tag
        // DAMAGE A
        // A := Amount of hitpoints left
        // A=100 is fight until shields are depleted
        // A=50 is fight until half of hull is depleted
        // A=150 is fight until half of shields are depleted

        // Check if the unit has a fleet break off tag
        // BREAK A
        // A := the morale of the unit
        // A=100 means fight to the last man
        // A=50 means fight till half the total hull of the fleet is gone

        // Fill out a unit object
        var u = objectFactory.newUnit();

        u.info.name = parts.name;
        u.info.size = parts.hull;
        u.info.type = "unit";

        var hull = objectFactory.newComponent();
        hull.name = "hull";
        hull.crit = "unitBase";
        hull.health = {
          pool: parts.hull,
          priority: 1
        };
        hull.presence = {
          magnitude: parts.hull,
          channel: 1
        };
        hull.effects = {};
        if(parts.defense > 0) {
          hull.effects.defense = parts.defense * 10;
        }
        if(parts.ar > 0) {
          hull.effects.deflect = parts.ar;
        }
        hull.channel = "hull";
        u.components.push(hull);

        if(parts.shields >= 0) {
          var shield = objectFactory.newComponent();
          shield.name = "shield",
          shield.crit = "shield",
          shield.health = {
            pool: parts.shields,
            priority: 2
          }
          shield.channel = "shield";
          u.components.push(shield);
        }

        _.forEach(brackets,function(bracket) {
          var c = buildAttack(bracket);
          // If the component is a battery (multi) then duplicate it
          if(c.attack.battery == 1) {
            // Just one battery, input the component
            u.components.push(c);
          }
          else {
            // Multiple batteries, duplicate the component and add each battery individually
            var battery = c.attack.battery;
            for(i = 0;i < battery;i++) {
              var cc = _.cloneDeep(c);
              cc.attack.battery = 1;
              u.components.push(cc);
            }
          }
        });

        if(!_.isArray(brackets) && parts.beam != 0) {
          // Then use the beam rating from the UDL and grab any non-bracketed weapons tags.
          var beam = objectFactory.newComponent();
          beam.name = "beam";
          beam.crit = "battery";
          beam.attack = {};
          beam.attack.volley = parts.beam;
          beam.attack.target = parts.target;
          u.components.push(beam);
        }

        data.unit = u;
      }

      return data;
    };

    return services;
  }

  factoryCtrl.$inject = ["mobius.helper.objectFactory"];

  angular.module("mobius.helper").factory("mobius.helper.udlParser",factoryCtrl);
})();
