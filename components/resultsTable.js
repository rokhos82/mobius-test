(function (){
  // Unit Card
  function controller() {
    var $ctrl = this;
  }

  controller.$inject = [];

  var component = angular.module("mobius-test").component("resultsTable",{
    templateUrl: "./components/resultsTable.html",
    controller: controller,
    bindings: {
      state: "<"
    }
  });
})();
