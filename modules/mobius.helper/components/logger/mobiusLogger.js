(function (){
  /* mobiusLogger - a better loggin UI
  */
  function controller() {
    var $ctrl = this;
  }

  controller.$inject = [];

  var component = angular.module("mobius-test").component("mobiusLogger",{
    templateUrl: "./modules/mobius.helper/components/logger/logger.html",
    controller: controller,
    bindings: {
      entries: "<"
    }
  });
})();
