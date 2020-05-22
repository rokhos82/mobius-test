(function (){
  // Unit Card
  function controller() {
    var $ctrl = this;

    $ctrl.$onInit = function() {
      $ctrl.isPre = ($ctrl.pre === "true");
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
