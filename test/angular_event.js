var myApp = angular.module('myApp', []);

myApp.controller('leftCtrl', ['$scope', function($scope) {
    $scope.criteria = ["DEFAULT","MIN", "MAX", "MEAN"];
    $scope.currentCri = $scope.criteria[0];
    $scope.reverse_order = false;
    $scope.currentPlot = "box";
    $scope.normalPlot = ["box", "histogram"];
    $scope.smallPlot = ["box", "color"];
    $scope.plots = $scope.normalPlot;
    $scope.currentFILE = currentFILE;
    $scope.files= files;
    $scope.resort = function(item){
        $scope.currentCri = item;
        if(item == "MEAN"){
            refer.sort(sortMean);
        }
        else if(item == "MIN"){
            refer.sort(sortMin);
        }
        else if(item == "MAX"){
            refer.sort(sortMax);
        }
        else{
            refer = origin_refer;
        }
        redraw();
    };
    $scope.callReverse = function(){
        if(isDesc){//currently is reverse order
            if($scope.reverse_order){
                ;
            }
            else{
                //cancel checkbox
                refer.reverse();
                isDesc = 0;
                redraw();
            }
        }
        else{//currently not reverse order
            if($scope.reverse_order){
                //change to desc
                refer.reverse();
                isDesc = 1;
                redraw();
            }
        }
    };
    $scope.toggle_view = function(){
        if(showSmall){
            $("#small_chart").css("display", "none");
            $("#chart").css("display", "block");
            showSmall = 0;
            $scope.plots = $scope.normalPlot;
        }
        else{
            showSmall = 1;
            $("#chart").css("display", "none");      
            $("#small_chart").css("display", "block");        
            $scope.plots = $scope.smallPlot;
        }
        $scope.currentPlot = "box";
        currentPlot = "box";
        redraw();
    };
    
    $scope.showPlot = function(p){
        currentPlot = p;
        $scope.currentPlot = p;
        if(showSmall){
            if($scope.currentPlot == "color"){
                for(var i = 0; i < refer.length; i++){
                    if(!visited_color_coding[i]){
                        draw_color_coding(i);
                        visited_color_coding[i] = 1;
                        d3.select("#small_chart").select("#box-svg" + i).style("display", "none").style("position", "absolute");
                        console.log("aasa");
                    }
                    else{
                        d3.select("#small_chart").select("#box-svg" + i).style("display", "none").style("position", "relative");
                        d3.select("#small_chart").select("#color-svg" + i).style("display", "block").style("position", "relative");

                        d3.select("#small_chart").select("#histo-svg"+i).select(".eachLabel").style("display","block");
                    }
                }
            }
            else if($scope.currentPlot == "box"){
                for(var i = 0; i < refer.length; i++){
                    d3.select("#small_chart").select("#histo-svg" + i).style("display", "none").style("position", "relative");
                    d3.select("#small_chart").select("#color-svg" + i).style("display", "none").style("position", "relative");
                    d3.select("#small_chart").select("#box-svg" + i).style("display", "block").style("position", "relative");
                }
            }
        }
        else{
            //currently show normal
            if($scope.currentPlot == "box"){
                for(var i = 0; i < refer.length; i++){
                    d3.select("#chart").select("#histo-svg" + i).style("display", "none").style("position", "relative");
                    d3.select("chart").select("#color-svg" + i).style("display", "none").style("position", "relative");
                    d3.select("#chart").select("#box-svg" + i).style("display", "block").style("position", "relative");
                }
            }
            else if($scope.currentPlot == "histogram"){
                for(var i = 0; i < refer.length; i++){
                    if(!visited[i]){
                        draw_horizon_histo(i);
                        visited[i] = 1;
                        d3.select("#chart").select("#box-svg" + i).style("display", "none").style("position", "absolute");
                    }
                    else{
                        d3.select("#chart").select("#histo-svg" + i).style("display", "block").style("position", "relative");

                        d3.select("#chart").select("#box-svg" + i).style("display", "none").style("position", "relative");
                        d3.select("#color-svg" + i).style("display", "none").style("position", "relative");

                        d3.select("#chart").select("#histo-svg"+i).select(".eachLabel").style("display","block");
                    }
                }
            }
        }
    }
    
    $scope.getdata = function (file){
        currentFILE = file;
        $scope.currentFILE = file;
        d3.csv(pre_path + file, function(error, csv) {
          if (error) throw error;

          Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) size++;
            }
            return size;
          };

          var index = 0;
          //malloc space
          for(var x in csv[1]){
             if(!isNaN(csv[1][x])){
                 refer[index] = [];
                 max[index] = -Infinity;
                 min[index] = Infinity;
                 index++;
             } 
          }
          //bind document name with index
          for(var x in csv){
              document_name.push(csv[x].text_key);
              name2index[csv[x].text_key] = x;
          }
          var label = [];
          for(var ele in csv[0]){
              if(!isNaN(csv[0][ele])){ 
                  label.push(ele);// key 
              }
          }
          //transpose the mat
          for(var row in csv){
              index = 0;
              for(var ele in csv[row]){
                  var tmp = +csv[row][ele];
                  if(!isNaN(tmp)){
                      refer[index].push(tmp);
                      if (tmp > max[index]) max[index] = tmp;
                      if (tmp < min[index]) min[index] = tmp;
                      index++;
                  }
              }
          }
          //store the attribute to each of the feature
          for(var col in refer){
              refer[col].meanValue = findMean(refer[col]);
              refer[col].maxValue = +max[col];
              refer[col].minValue = +min[col];
              refer[col].label = label[col]; 
          }

          origin_refer = refer.slice();
            draw();
            draw_small();


          float_window = d3.select("body").append("div");
            float_window.style("position", "absolute")
                .style("z-index", "10")
                .attr("class", "tag")
                .style("visibility","hidden")
                .text("default");
          }
    )};
}]);
