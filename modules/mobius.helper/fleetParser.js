(function() {
  /*  fleetParser
   *
   */
  function factoryCtrl(udl,factory) {
    var services = {};

    services.parseFots = function(fleetString) {
      var data = {};
      data.errors = [];
      var fleet = factory.newFleet();

      var lines = _.split(fleetString,"\n");

      var firstLine = _.split(lines[0],",");
      var unitLines = _.drop(lines,1);

      fleet.name = firstLine[0];

      _.forEach(unitLines,function(line) {
        var d = udl.parseFots(line);
        
        if(d.errors.length == 0) {
          fleet.units.push(d.unit);
        }
        else {
          data.errors.push(d.errors);
        }
      });

      data.group = fleet;

      data.errors = _.flatten(data.errors);

      return data;
    };

    return services;
  }

  factoryCtrl.$inject = ["mobius.helper.udlParser","mobius.helper.objectFactory"]

  angular.module("mobius.helper").factory("mobius.helper.fleetParser",factoryCtrl);
})();
