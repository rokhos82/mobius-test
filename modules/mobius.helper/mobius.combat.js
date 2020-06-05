(function() {
  //////////////////////////////////////////////////////////////////////////////
  // Combat Helper Functions
  //////////////////////////////////////////////////////////////////////////////

  function factoryCtrl() {
    var services = {};
    var settings = {};

    /* doAttack - this unit will process an attack from an actor and
     * apply it to a target.  This function is channel aware.
    */
    services.doAttack = function(data) {
      var errors = [];
      var results = {
        success: false
      };

      // Check for actor
      if(!_.has(data,'actor')) {
        // Send back an error
        errors.push('No actor in attack data')
      }
      // Check for target
      if(!_.has(data,'target')) {
        // Send back an error
        errors.push('No target in attack data')
      }
      // Check for attack
      if(!_.has(data,'attack')) {
        // Send back an error
        errors.push('No attack in attack data')
      }

      if(errors.length === 0) {
        // Setup local variables
        var actor = data.actor;
        var target = data.target;
        var attack = data.attack;
        var mode = data.mode;

        // We have the information required.  ATTACK!!!!
        // Which mode are we using
        // Modes are:
        // 1) limit - does the to-hit roll exceed a predefined limit
        // 2) oppposed - does the to-hit roll exceed the defense roll
        if(data.mode === 'limit') {
          // In limit mode, if the hit roll is greater than 50 than the attack hits.
          // The hit roll is increased by TARGET and decreased by DEFENSE.
          var limit = data.limit;

          // Calculate the hit roll results
          var hit = _.random(1,1000,false);
          hit += attack.target
          hit -= target.state.effects.defense;

          // Record the results of the hit roll
          results.hit = hit;

          if(hit > limit) {
            // Successful hit!
            results.success = true;
            //Determine damage.
            // Roll for damage between 10% and 100%
            var damageRoll = _.random(1,1000,false);
            damageRoll += (_.isNumber(attack.yield) ? attack.yield : 0);
            damageRoll -= (_.isNumber(target.state.effects.resist) ? target.state.effects.resist : 0);

            // Bounds check the damage roll
            damageRoll = damageRoll > 1000 ? 1000 : damageRoll;
            damageRoll = damageRoll < 100 ? 100 : damageRoll;

            // Calculate how much damage the attack causes
            var damage = _.round(attack.volley * damageRoll / 1000);
            results.damage = damage;
          }

          // Spend one ammo point
          if(_.has(attack,"ammo")) {
            attack.ammo--;
            results.ammo = attack.ammo;
          }
        }
        else {
          results.success = false;
        }
      }

      return {
        errors: errors,
        results: results
      };
    };

    /* calcDamage - This function calculates damage to a unit.
     * Special Modes
     *  God Mode - the damage is applied directly to the target without other effects
     *      mode.god = true
    */
    services.calcDamage = function(data) {
      var target = data.target;
      var damage = data.damage;

      var errors = [];
      var results = {};

      // Things to consider: deflect, resist, and displacement
      // deflect is a specific amount of damage reduction (think AR)
      // <no>resist is a percentage amount of damage reduction</no> ALREADY CONSIDERED IN THE ATTACK FUNCTION
      // displacement is a percentage chance to miss entirely (think FLICKER)

      // Displacement is considered first, then if the attack did actually land,
      // deflect is used to remove a constant amount.

      if(!data.mode.god) {
        // Check if the unit has displacement
        var missed = false;
        if(_.isNumber(target.state.displacement)) {
          // Roll the chance to miss
          var toMiss = _.random(1,1000,false);

          // Did the hit really miss!?
          missed = (toMiss < target.state.displacement);
          results.displaced = missed;
        }
        // Check if we missed again...
        if(!missed) {
          // Does the unit posses deflect?
          var block = _.isNumber(target.state.deflect) ? target.state.deflect : 0;
          results.blocked = block;

          // Determine damage after deflect
          damage -= block;
          damage = damage < 0 ? 0 : damage;

          // Save the end damage to the result set
          results.damage = damage;
        }
      }
      else {
        results.damage = damage;
      }

      // Return the results and any errors
      return {
        errors: errors,
        results: results
      };
    };

    ////////////////////////////////////////////////////////////////////////////
    // applyDamage
    ////////////////////////////////////////////////////////////////////////////

    return services;
  }

  factoryCtrl.$inject = [];

  angular.module("mobius.helper").factory("mobius.helper.combat",factoryCtrl);
})();
