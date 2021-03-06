var margin = {top: 10, right: 50, bottom: 20, left: 50},
    width = 120 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var min = [],
    max = [];

var document_name = [];
var tooltip;
var float_window;
//var svg;

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
var refer = new Array;
var clickMargin = 10;

function myFunction() {
    alert("hello");
}
function getdata(flag){
    d3.csv("data/ubiq2.csv", function(error, csv) {
      if (error) throw error;

      Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
      };

      var index = 0;
//      console.log(csv);
      var name2index = new Object();
      var index2name = new Object();
//      console.log(refer);
      for(var i in csv){
          name2index[csv[i].test_key] = i; 
          index2name[i] = csv[i].test_key;
      }
      for(var x in csv[1]){
         if(!isNaN(csv[1][x])){
             refer[index] = [];
             max[index] = -Infinity;
             min[index] = Infinity;
             index++;
         } 
      }
      console.log(csv);
      console.log(document_name);
      for(var x in csv){
          document_name.push(csv[x].text_key);
      }
      console.log(document_name);
      var label = [];
//      csv.splice(0, 1);
      for(var ele in csv[0]){
          if(!isNaN(csv[0][ele])){ // csv is a long 1d array, each one is an item
              label.push(ele);// key 
          }
      }
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
      for(var col in refer){
          refer[col].meanValue = findMean(refer[col]);
          refer[col].maxValue = +max[col];
          refer[col].minValue = +min[col];
          refer[col].label = label[col]; 
          refer[col].name2val = name2index;
          refer[col].val2name = index2name;
      }
      if(!flag) draw();
      else histo(flag);
        
      float_window = d3.select("body").append("div")
                .style("position", "absolute")
            .style("z-index", "10")
            .attr("class", "tag")
            .style("visibility","hidden")
            .text("default");
    }
)};
function draw(){
//    console.log(refer);
    var chart = d3.box()
    .whiskers(iqr(3))
    .width(width)
    .height(height);
    
    (function(global){global.localStorage.setItem("mySharedData", JSON.stringify(refer))}(window));
                                
    var svg = d3.select("#chart").selectAll("svg")
          .data(refer)
          .enter().append("svg")
          .attr("display", "inline")
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
    
      svg.append("rect")
        .attr("class", "btn")
        .attr("number", function(d, i){return i;})
        .attr("x", 0)
        .attr("y", 0)
        .attr("position", "relative")
        .attr("z-index", 1)
        .attr("width", function() {return width + margin.left + margin.right - clickMargin;})
        .attr("height", function() {return height + margin.bottom + margin.top - clickMargin;})
          .attr("pointer-events", "none")
//        .on("click", function(d, i){window.open('histo.html' + "?" +i);})
      ;
//      console.log( svg);
      svg.append("circle")
        .attr("class", "highlight")
        .attr("cx", 10)
        .attr("cy", 470)
        .attr("r", 5)
        .style("position", "absolute")
        .style("visibility", "visible")
        .style("z-index", 10);
    
      svg.call(chart);
    
//    tooltip =  d3.selectAll("svg")
//            .append("div")
//            .style("position", "absolute")
//            .style("z-index", "10")
//            .attr("class", "tag")
//            .text("default");
    };



function histo(number){
    (function (global) {
    refer = JSON.parse(global.localStorage.getItem("mySharedData"));
}(window));
    var data = window.refer[number];
    console.log(data);
    for(i in data){
        data[i] = + data[i];
    }
//    console.log(isNaN(data[0]));
    console.log(Math.min.apply(null, data));
    var minValue = Math.min.apply(null, data);
    var maxValue = Math.max.apply(null, data);
//    var data = d3.range(1000).map(d3.randomBates(10));

    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .domain([minValue, maxValue])
//        .range([0, 1]);
        .rangeRound([0, width]);
    console.log(x.domain());
    var bins = d3.histogram()
        .domain(x.domain())
//        .domain([0, 10])
        .thresholds(x.ticks(20))
        (data);

    var y = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(bins)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function(d) { return height - y(d.length); });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
}




// Returns a function to compute the interquartile range.
function iqr(k) {
  return function(d, i) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2];
//        console.log("q1 : " + q1);
//        console.log("q3 : " + q3);
    var iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
  };
}


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
            else if(this.value == "desc"){
                refer.reverse();
            }
        var myNode = $("#chart").get(0);
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }    
        
        draw();
});


function getQuar(d, i){
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2];
//        console.log("q1 : " + q1);
//        console.log("q3 : " + q3);
    var iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
};

function highlight(num){
//    console.log("svg");
//    console.log(svg);
    var svg = d3.selectAll("svg");
    var coordinate = [];
    var x_coorninate = [];
    for(var i in refer){
        var tmp = refer[i][num];
        q1 = d3.quantile(refer[i], .25),
        q2 = d3.quantile(refer[i], .5),
        q3 = d3.quantile(refer[i], .75)

        var svg_height = 470;
        
        var cur_coordinate;
        if(refer[i].maxValue != refer[i].minValue)
            cur_coordinate = svg_height - 
            svg_height * (tmp - refer[i].minValue) / (refer[i].maxValue - refer[i].minValue);
        else
            cur_coordinate = 470;
        if(cur_coordinate > 470){
            console.log("aaaa");
            console.log(cur_coordinate);
            console.log([tmp, refer[i].minValue, refer[i].maxValue]);
        }
        coordinate.push(cur_coordinate);
        x_coorninate.push(10);
    }
//    console.log(coordinate.length); //122 items
//    console.log(d3.selectAll(".highlight"));
    //find element
    
    var tmpHandler = d3.selectAll(".highlight")
    .data(coordinate)
//    .enter()
//    .append("circle")
    
    //why not work with data
    .style("visibility", "visible")
    .style("fill", "red")
    .style("z-index", "15")
    .attr("cx", "10")
//    .attr("cy", "50");
    .attr("cy", function(d){ return d;});

};

function hide_highlight(){
    console.log("now hide");
    var tmpHandler = d3.selectAll(".highlight")
            .style("visibility", "hidden");
}