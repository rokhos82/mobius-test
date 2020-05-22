(function (){
  // Unit Card
  function controller() {
    var $ctrl = this;

    $ctrl.$onInit = function() {
      $ctrl.blue = $ctrl.state.groups.blue;
      $ctrl.red = $ctrl.state.groups.red;
      $ctrl.isPre = ($ctrl.pre === "true");
    }
  }

  controller.$inject = [];

  var component = angular.module("mobius-test").component("results",{
    templateUrl: "./components/results.html",
    controller: controller,
    bindings: {
      state: "<",
      pre: "@"
    }
  });
})();
