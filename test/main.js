var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 120 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var min = [],
    max = [];

var chart = d3.box()
    .whiskers(iqr(1.5))
    .width(width)
    .height(height);
    
var sortMean = function(a, b){
    return a.meanValue - b.meanValue;
}
var sortMax = function(a, b){
    return a.maxValue - b.maxValue;
}
var sortMin = function(a, b){
    return a.minValue - b. minValue;
}
var findMean = function(arr){
    var sum = 0;
    for(var i in arr){
        sum += +arr[i];
//        console.log(+arr[i]);
//        console.log(sum);
    }
    return sum / arr.length;
}
var refer = [];

d3.csv("ubiq2.csv", function(error, csv) {
  if (error) throw error;

  Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };
    
  var index = 0;
  for(var x in csv[1]){
     if(!isNaN(csv[1][x])){
         refer[index] = [];
         max[index] = -Infinity;
         min[index] = Infinity;
         index++;
     } 
  }
//    console.log(csv);
//  console.log(csv[0]);
  var label = [];
  csv.splice(0, 1);
  for(var ele in csv[0]){
      if(!isNaN(csv[0][ele])){ // csv is a long 1d array, each one is an item
          label.push(ele);// key 
      }
  }
//  console.log("label");
//  console.log(label);
  for(var row in csv){
      index = 0;
      for(var ele in csv[row]){
          var tmp = csv[row][ele];
          if(!isNaN(tmp)){
              refer[index].push(tmp);
              if (tmp > max[index]) max[index] = tmp;
              if (tmp < min[index]) min[index] = tmp;
              index++;
          }
      }
  }
  for(var col in refer){
      refer[col].meanValue = findMean(refer[col]);
      refer[col].maxValue = +max[col];
      refer[col].minValue = +min[col];
      refer[col].label = label[col]; 
  }
    console.log(refer);
  
//  chart.domain([min, max]);
  var svg = d3.select("#chart").selectAll("svg")
      .data(refer)
      .enter().append("svg")
      .attr("class", "box")
      .attr("display", "inline-block")
      .attr("width", function(d, i){
//                                    chart.domain([min[i], max[i]]);
                                    return width + margin.left + margin.right; })
      .attr("height", height + margin.bottom + margin.top)
      .attr("position", "relative");
  
   
  svg.append("text").text(function(d){return d.label;})
      .attr("x", function(d){
        return 0;
//          return - (width + margin.left + margin.right) / 2;
      })
      .attr("y", function(d){
          return (height + margin.bottom + margin.top);
      })
      .attr("position", "absolute")
      .attr("left", function(){
      return 0;
//        return -(width + margin.left + margin.right)
      })
      .attr("font-family", "sans-serif")
                 .attr("font-size", "10px")
                 .attr("fill", "red"); 
    
    
//    .append("g")
//      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//    
    console.log(svg);
      svg.call(chart);
});

$(".sortCriterion").click(function(){
    if(this.value == "mean"){
            console.log("mean");
            refer.sort(sortMean);
        }
        else if(this.value == "max"){
            console.log("max");
            refer.sort(sortMax);
        }
        else if(this.value == "min"){
            console.log("miin");
            refer.sort(sortMin);
        }
    var myNode = $("#chart").get(0);
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }    
    
    var svg = d3.select("#chart").selectAll("svg")
      .data(refer)
      .enter().append("svg")
      .attr("class", "box")
      .attr("display", "inline-block")
      .attr("width", function(d, i){
//                                    chart.domain([min[i], max[i]]);
                                    return width + margin.left + margin.right; })
      .attr("height", height + margin.bottom + margin.top)
      .attr("position", "relative");
  
   
  svg.append("text").text(function(d){return d.label;})
      .attr("x", function(d){
        return 0;
//          return - (width + margin.left + margin.right) / 2;
      })
      .attr("y", function(d){
          return (height + margin.bottom + margin.top);
      })
      .attr("position", "absolute")
      .attr("left", function(){
      return 0;
//        return -(width + margin.left + margin.right)
      })
      .attr("font-family", "sans-serif")
                 .attr("font-size", "10px")
                 .attr("fill", "red"); 
    
    
      svg.call(chart);
});




// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}