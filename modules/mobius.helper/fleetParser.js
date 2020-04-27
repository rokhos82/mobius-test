(function() {
  /*  fleetParser
   *
   */
  function factoryCtrl(udl,factory) {
    var services = {};

    services.parseFots = function(fleetString) {
      var fleet = factory.newFleet();

      var lines = _.split(fleetString,"\n");

      var firstLine = _.split(lines[0],",");
      var unitLines = _.drop(lines,1);

      fleet.name = firstLine[0];

      _.forEach(unitLines,function(line) {
        fleet.units.push(udl.parseFots(line));
      });

      return fleet;
    };

    return services;
  }

  factoryCtrl.$inject = ["mobius.helper.udlParser","mobius.helper.objectFactory"]

  angular.module("mobius.helper").factory("mobius.helper.fleetParser",factoryCtrl);
})();
