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
            damageRoll += attack.yield ? attack.yield : 0;
            damageRoll -= target.state.effects.resist;

            // Bounds check the damage roll
            damageRoll = damageRoll > 1000 ? 1000 : damage;
            damageRoll = damageRoll < 100 ? 100 : damage;

            // Calculate how much damage the attack causes
            var damage = _.round(attack.volley * damageRoll / 1000);
            results.damage = damage;
          }
        }
        else {}
      }

      return {
        errors: errors,
        results: results
      };
    };

    return services;
  }

  factoryCtrl.$inject = [];

  angular.module("mobius.helper").factory("mobius.helper.combat",factoryCtrl);
})();
