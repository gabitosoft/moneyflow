angular.module('starter.services', [])

.factory('Flows', function() {
  
  return {
    remove: function(flow) {
      flows.splice(flows.indexOf(flow), 1);
    },
    get: function(flowId) {
      for (var i = 0; i < flows.length; i++) {
        if (flows[i].id === parseInt(flowId)) {
          return flows[i];
        }
      }
      return null;
    }
  };
})
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    },
    removeObject: function(key) {
      delete $window.localStorage[key];
    },
    all: function() {
      flows = [];
      keys = Object.keys($window.localStorage);
      
      for (i = 0; i < keys.length; i++) {
        flows.push(JSON.parse($window.localStorage[keys[i]]));
      }

      // We want to display the first flow registered at the end.
      return flows.reverse();
    }
  }
}]);
