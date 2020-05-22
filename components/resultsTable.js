(function (){
  // Unit Card
  function controller() {
    var $ctrl = this;

    $ctrl.$onInit = function() {
      $ctrl.isPre = ($ctrl.pre === "true");
      $ctrl.units = _.filter($ctrl.group.units,function(unit) {
        return unit.state.active;
      });
    }
  }

  controller.$inject = [];

  var component = angular.module("mobius-test").component("resultsTable",{
    templateUrl: "./components/resultsTable.html",
    controller: controller,
    bindings: {
      group: "<",
      pre: "@"
    }
  });
})();
