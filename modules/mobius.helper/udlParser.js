(function() {
  /*  udlParser - converts old-school FOTS unit description lines (UDLs) to a more useful format.
   *
   */
  function factoryCtrl(objectFactory) {
    var services = {};

    services.parseFots = function(udl) {
      // Split the UDL by the 'commas'
      var rawParts = _.split(udl,",");

      if(rawParts.length != 13) {
        console.error("Incorrect UDL");
      }
      else {
        var parts = {
          name: rawParts[0],
          shields: _.parseInt(rawParts[3]),
          hull: _.parseInt(rawParts[7]),
          tags: rawParts[12]
        };

        // Get the parts of the tags string that are bracketed
        var brackets = parts.tags.match(/\[.*?\]/g);

        // Get everything after the last bracket
        var nonBracket = _.trim(parts.tags.slice(parts.tags.lastIndexOf("]")+1));

        // Extract information from the non-bracketed tags
        if(nonBracket.indexOf("DEFENSE") >= 0) {
          parts.defense = _.parseInt(nonBracket.match(/(?:DEFENSE\s+)(?<def>\d+)(?:\s*)/).groups.def);
        }

        if(nonBracket.indexOf("TARGET") >= 0) {
          parts.target = _.parseInt(nonBracket.match(/(?:TARGET\s+)(?<tar>\d+)(?:\s*)/).groups.tar);
        }

        if(nonBracket.indexOf("AR") >= 0) {
          parts.ar = _.parseInt(nonBracket.match(/(?:AR\s+)(?<ar>\d+)(?:\s*)/).groups.ar);
        }

        if(nonBracket.indexOf("RESIST") >= 0) {
          parts.resist = _.parseInt(nonBracket.match(/(?:AR\s+)(?<resist>\d+)(?:\s*)/).groups.resist);
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
          c.attack.volley = _.parseInt(bracket.match(/(?:\[)(?<volley>\d+)/).groups.volley);
          if(bracket.indexOf("target") > 0) {
            c.attack.target = _.parseInt(bracket.match(/(?:target\s*)(?<tar>\d+)/).groups.tar) * 10;
          }
          if(bracket.indexOf("long") > 0) {
            c.attack.long = true;
          }
          u.components.push(c);
        });

        u.type = "unit";

        return u;
      }
    };

    return services;
  }

  factoryCtrl.$inject = ["mobius.helper.objectFactory"];

  angular.module("mobius.helper").factory("mobius.helper.udlParser",factoryCtrl);
})();
