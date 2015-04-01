angular.module('starter.controllers', [])

.controller('RegisterCtrl', function($scope, $localstorage) {  
  
  $scope.flow = {};
  $scope.flow.isOut = true;
  $scope.totalIn = 0;
  $scope.totalOut = 0;
  $scope.total = 0;
  
  $scope.save = function(flow) {

    $scope.flow.date = new Date;
    $scope.flow.id = $scope.flow.date.getTime();
    $localstorage.setObject($scope.flow.id, $scope.flow);
    
    $scope.flow.reason = '';
    $scope.flow.money = '';
    
    $scope.calculate();
  };
  
  $scope.calculate = function() {
  
    $scope.totalIn = 0;
    $scope.totalOut = 0;
    $scope.total = 0;
    
    arrayFlows = $localstorage.all();

    for (i = 0; i < arrayFlows.length; i++) {
      if (arrayFlows[i].isOut) {
        $scope.totalOut += parseFloat(arrayFlows[i].money);
      } else {
        $scope.totalIn += parseFloat(arrayFlows[i].money);
      }
    }
    
    $scope.total = parseFloat($scope.totalIn) - parseFloat($scope.totalOut);
  };

})
.controller('HistoryCtrl', function($scope, Flows, $localstorage) {

  $scope.flows = $localstorage.all();
  
  $scope.remove = function(flow) {
    $localstorage.removeObject(flow.id);
    
    $scope.flows = $localstorage.all();
  };
})
.controller('ReportCtrl', function($scope, $localstorage) {

  $scope.calulateTotals = function() {
    
    arrayFlows = $localstorage.all();
    var totalIn = 0;
    var totalOut = 0;

    for (i = 0; i < arrayFlows.length; i++) {
      if (arrayFlows[i].isOut) {
        totalOut += parseFloat(arrayFlows[i].money);
      } else {
      
        totalIn += parseFloat(arrayFlows[i].money);
      }
    }
    
    return {in: totalIn, out: totalOut};
  };
  
  $scope.getMoneyByMonth = function() {
  
    arrayFlows = $localstorage.all();
    var inByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var outByMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var currentDate = new Date;

    for (i = 0; i < arrayFlows.length; i++) {
      
      var flow = arrayFlows[i];
      var flowDate = new Date(flow.date);

      if (currentDate.getFullYear() === flowDate.getFullYear()) {
      
        if (flow.isOut) {
          outByMonth[flowDate.getUTCMonth()] += parseFloat(flow.money);
        } else {
          inByMonth[flowDate.getUTCMonth()] += parseFloat(flow.money);
        }
      }
    }

    return {in: inByMonth, out: outByMonth};
  };
  
  $scope.displayCharts = function() {
  
    var lineCtx = document.getElementById("lineChart").getContext("2d");
    var pieCtx = document.getElementById("pieChart").getContext("2d");
    
    var moneyByMonth = $scope.getMoneyByMonth();
    
    dataLine = {
      labels: ["January", "February", "March", 
               "April", "May", "June", "July", 
               "August", "September", "November", "December"],
      datasets: [
          {
              label: "Ingresos",
              fillColor: "rgba(70,191,189,0.2)",
              strokeColor: "rgba(70,191,189,1)",
              pointColor: "rgba(70,191,189,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(70,191,189,1)",
              data: moneyByMonth.in
          },
          {
              label: "Egresos",
              fillColor: "rgba(247,70,74,0.2)",
              strokeColor: "rgba(247,70,74,1)",
              pointColor: "rgba(247,70,74,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(247,70,74,1)",
              data: moneyByMonth.out
          }
      ]
    };
    
    var totals = $scope.calulateTotals();
    
    var dataPie = [
      {
          value: totals.in,
          color:"#46BFBD",
          highlight: "#5AD3D1",
          label: "Ingresos"
      },
      {
          value: totals.out,
          color: "#F7464A",
          highlight: "#FF5A5E",
          label: "Egresos"
      }
    ];

    var options= {};
    var lineChart = new Chart(lineCtx).Line(dataLine, options);
    var pieChart = new Chart(pieCtx).Pie(dataPie,options);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
  
});
