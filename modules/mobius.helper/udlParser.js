(function() {
  /*  udlParser - converts old-school FOTS unit description lines (UDLs) to a more useful format.
   *
   */
  function factoryCtrl(objectFactory) {
    var services = {};

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
        if(/[\s+|^]DEFENSE\s+(-?\d+)\s*/.test(nonBracket)) {
          parts.defense = _.parseInt(nonBracket.match(/[\s+|^]DEFENSE\s+(?<def>-?\d+)\s*/).groups.def);
        }

        if(/[\s+|^]TARGET\s+(-?\d+)\s*/.test(nonBracket)) {
          parts.target = _.parseInt(nonBracket.match(/[\s+|^]TARGET\s+(?<tar>-?\d+)\s*/).groups.tar);
        }

        if(/[\s+|^]AR\s+(\d+)\s*/.test(nonBracket)) {
          parts.ar = _.parseInt(nonBracket.match(/[\s+|^]AR\s+(?<ar>\d+)\s*/).groups.ar);
        }

        if(/[\s+|^]SR\s+(\d+)\s*/.test(nonBracket)) {
          parts.sr = _.parseInt(nonBracket.match(/[\s+|^]SR\s+(?<sr>\d+)\s*/).groups.sr);
        }

        if(/[\s+|^]RESIST\s+(\d+)\s*/.test(nonBracket)) {
          parts.resist = _.parseInt(nonBracket.match(/[\s+|^]RESIST\s+(?<resist>\d+)\s*/).groups.resist);
        }

        if(/[\s+|^]FLICKER\s+(\d+)\s*/.test(nonBracket)) {
          parts.flicker = _.parseInt(nonBracket.match(/[\s+|^]FLICKER\s+(?<flicker>\d+)\s*/).groups.flicker);
        }

        if(/[\s+|^]DELAY\s+(\d+)/.test(nonBracket)) {}

        if(/[\s+|^]DAMAGE\s+(\d+)/.test(nonBracket)) {}

        if(/[\s+|^]BREAK\s+(\d+)/.test(nonBracket)) {}

        if(/[\s+|^]RESERVE\s+(\d+)/.test(nonBracket)) {}

        if(/[\s+|^]PD\s+(\d+)/.test(nonBracket)) {}

        if(/[\s+|^]REGEN\s+(\d+)\s+(\d+)\s+/.test(nonBracket)) {}

        if(/[\s+|^]DL\s+(\w+)\s+/.test(nonBracket)) {}

        if(/[\s+|^]HULL\s+(\d+)\s+(\d+)\s+/.test(nonBracket)) {}

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
          var c = objectFactory.newComponent();
          c.name = "attack";
          c.crit = "battery";
          c.attack = {};
          c.attack.volley = _.parseInt(bracket.match(/\[(?<volley>\d+)/).groups.volley);
          c.attack.channel = "hitpoints";

          if(/targets\s+\d+/.test(bracket)) {
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
            c.attack.packet = _.parseInt(bracket.match(/mis..(?<packet>.)./).groups.packet,16);
          }

          if(/multi\s+\d+/.test(bracket)) {
            var packet = _.parseInt(bracket.match(/multi\s+(?<packet>\d+)/).groups.packet);
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

          if(/pen/.test(bracket)) {}

          if(/hull\s+\d+\s+\d+/.test(bracket)) {}

          u.components.push(c);
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
