(function (){
  // Unit Card
  function controller() {
    var $ctrl = this;
  }

  controller.$inject = [];

  var component = angular.module("mobius-test").component("unitCard",{
    templateUrl: "./components/unitCard.html",
    controller: controller,
    bindings: {
      unit: "<"
    }
  });
})();
