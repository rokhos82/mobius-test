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

        if(/[\s+|^]RESIST\s+(\d+)\s*/.test(nonBracket)) {
          parts.resist = _.parseInt(nonBracket.match(/[\s+|^]RESIST\s+(?<resist>\d+)\s*/).groups.resist);
        }

        // Fill out a unit object
        var u = objectFactory.newUnit();

        u.name = parts.name;
        u.size = parts.hull;

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
        u.components.push(hull);

        if(parts.shields >= 0) {
          var shield = objectFactory.newComponent();
          shield.name = "shield",
          shield.crit = "shield",
          shield.health = {
            pool: parts.shields,
            priority: 2
          }
          u.components.push(shield);
        }

        _.forEach(brackets,function(bracket) {
          var c = objectFactory.newComponent();
          c.name = "attack";
          c.crit = "battery";
          c.attack = {};
          c.attack.volley = _.parseInt(bracket.match(/\[(?<volley>\d+)/).groups.volley);
          if(bracket.indexOf("target") > 0) {
            c.attack.target = _.parseInt(bracket.match(/target\s*(?<tar>\d+)/).groups.tar) * 10;
          }
          if(bracket.indexOf("long") > 0) {
            c.attack.long = true;
          }
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

        u.type = "unit";

        data.unit = u;
      }

      return data;
    };

    return services;
  }

  factoryCtrl.$inject = ["mobius.helper.objectFactory"];

  angular.module("mobius.helper").factory("mobius.helper.udlParser",factoryCtrl);
})();
