cri = []
data = []     

var app = angular.module('demo',[]);

app.controller('ctrl', function($scope){
        $scope.type = ['mean', 'min', 'max', 'name'];
        $scope.selectCri = function(){                     document.getElementById("myDropdown").classList.toggle("show");
        }
        $scope.current_criterion = "";
        $scope.confirmCri = function(ele){
            $scope.current_criterion = ele;
        }
        $scope.isRev = false;
        $scope.data = '';
        $scope.cri = '';
        $scope.$watch('rev', function() {
            $scope.isRev = !$scope.isRev;
        });
        
        
        $scope.showChart = function(item){
            myName = item.name;
            var results = $.map(data, function(e,i){
              if( e.name === myName ){ 
                  console.log(e);
                  draw_histo(e.data);
              }
            });
        }

        function getCri(){
                d3.csv("data/criterion.csv", function(error, csv){
                    cri = csv;
                    for(i in cri){
                        cri[i].mean = Number(cri[i].mean);
                        cri[i].max = Number(cri[i].max);
                        cri[i].min = Number(cri[i].min);
                    }
                    $scope.cri = cri;
                    
                    d3.csv("data/output.csv", function(error, csv){
                        data = csv;
                        $scope.data = data;
                        console.log(data);
                    });
                  }
        )};

        getCri();

});

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


//promise.then(function() {
//  alert('Success: ');
//    console.log(data);
//}, function() {
//  alert('fail: ');
//    console.log(data);
//});
//getData();
//showPage();
           