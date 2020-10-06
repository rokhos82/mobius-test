(function() {
  /** Mechanic definition factory
  */

  var factoryCtrl = function() {
    var __services = {};

    /*
     * Channel object look like the below:
    */

    // Here are the basic channels of a FOTS game
    __services.hitpoints = function() {
      // Need to define a channel object with two subchannels
    };

    __services.movement = function() {
      // This is simplistic movement.  The unit can only stay or flee.
    }

    __services.presence = function() {
      // This is simplistic detection.  A unit can be "seen" or not.
      // There are no varying degrees.  "Hiding" is bein in RESERVE or CLOAK.
    }

    __services.power = function() {
      // This is power needs and generation.
      // Used for unit creation.
    }

    __services.equipmentSpace = function() {
      // This is the equipment space requirements for components.
      // Used for unit creation.
    }

    __services.capture = function() {
      // This is channel is used for determining if a unit is captured.
      // Used for boarding party action.
    }

    return __services;
  };

  factory.$inject = [];

  angular.module("mobius.tech-library").factory("mobius.tech-library.mechanic",factoryCtrl);
})();
