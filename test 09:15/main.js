var margin = {top: 10, right: 50, bottom: 20, left: 50},
    padding = {top: 10},
    width = 120 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var padding_top_offset = 10;
var min = [],
    max = [];

var document_name = [];
var name2index = new Object;
var float_window;
var tooltip;
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
//      console.log(refer);
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
          name2index[csv[x].text_key] = x;
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
      }
      if(!flag) draw();
      else histo(flag);
        
      float_window = d3.select("body").append("div");
        float_window.style("position", "absolute")
            .style("z-index", "10")
            .attr("class", "tag")
            .style("visibility","hidden")
            .text("default");
            
        console.log(float_window);
    }
)};
function draw(){
    console.log("draw function");
    var chart = d3.box()
    .whiskers(iqr(3))
    .width(width)
    .height(height);
    
    (function(global){global.localStorage.setItem("mySharedData", JSON.stringify(refer))}(window));
                                
    var containers = d3.select("#chart").selectAll("div")
//        .selectAll("svg")
          .data(refer)
          .enter()
          .append("div")
          .attr("class", "single_container")
          .style("display","inline-block")
          .style("width", "120px")
          .style("height", "700px");
    
    
    var histo_svg = containers
            .append("svg")
            .attr("class","histo-svg")
            .style("display", "none")
            .text("aaaa")
            ;
    
    var svg = containers
          .append("svg")
          .attr("class", "box box-svg")
          .attr("index", function(d, i){return i;})
//          .style("display", "block")
          .attr("width", function(d, i){
    //                                    chart.domain([min[i], max[i]]);
                                        return width + margin.left + margin.right; })
          .attr("height", height + margin.bottom + margin.top)
          .attr("position", "relative");
        
    var change_buttons = containers
            .append("button")
            .attr("type", "button")
            .attr("class","btn btn-primary")
            .text("histogram")
            .style("width", "100px")
            .style("display", "block")
            .style("margin-top", "5px")
            .style("margin-bottom", "5px")
            .on("click", function(d, i){
                draw_histo(i);
//                d3.selectAll(".box-svg")
//                .data([])
//                .exit()
//                .filter(function (dd, ii) {
//                    return i == Number(d3.select(this).attr("index"))
//                })
//                .attr("display", "none")
//                
//                d3.selectAll(".histo-svg")
//                .data([])
//                .exit()
//                .filter(function (dd, ii) {
//                    return i == Number(d3.select(this).attr("index"))
//                })
//                .attr("display", "block")
//                ;
            });
    var change_buttons = containers
            .append("button")
            .attr("type", "button")
            .attr("class","btn btn-primary")
            .text("boxplot")
            .style("display", "block")
            .style("margin-top", "5px")
            .style("margin-bottom", "5px")
            .on("click", function(d, i){
                d3.selectAll(".box-svg")
                .data([])
                .exit()
                .filter(function (dd, ii) {
                    return i == Number(d3.select(this).attr("index"))
                })
                .attr("display", "block")
                
                d3.selectAll(".histo-svg")
                .data([])
                .exit()
                .filter(function (dd, ii) {
                    return i == Number(d3.select(this).attr("index"))
                })
                .attr("display", "none")
                ;
            });
    var show_both_buttons = containers
            .append("button")
            .attr("type", "button")
            .attr("class","btn btn-success")
            .text("show both")
            .style("display", "block")
            .style("top", "600px");
    
    
      svg.append("text").text(function(d){return d.label;})
          .attr("x", function(d){
            return 0;
    //          return - (width + margin.left + margin.right) / 2;
          })
          .attr("y", function(d){
              return (height + margin.bottom + margin.top);
          })
          .style("display", "block")
//          .attr("position", "absolute")
          .attr("left", function(){
//            return 0;
            return -(width + margin.left + margin.right)
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
//          .on("click", func(d, i){
//            draw_histo(i);
//            })
//        .on("click", function(d, i){console.log();draw_histo(i);})
      ;
//      console.log( svg);
      svg.append("circle")
        .attr("class", "highlight")
        .attr("cx", 10)
        .attr("cy", 470)
        .attr("stroke-width", 10)
        .attr("r", 5)
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("z-index", 10);
    
      svg.call(chart);
    
//    tooltip =  d3.selectAll("svg")
//            .append("div")
//            .style("position", "absolute")
//            .style("z-index", "10")
//            .attr("class", "tag")
//            .text("default");
    };

function draw_histo(number){
    d3.select("#histo_chart").selectAll("svg")
    .data([])
    .exit()
    .remove();
    
    data = refer[number];
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

    var svg = d3.select("#histo_chart").append("svg")
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
//    d3.select("#histo_chart")
//                .datum(refer[number])
////        .datum(irwinHallDistribution(10000, 10))
//      .call(histogramChart()
//        .bins(d3.scale.linear().ticks(20))
//        .tickFormat(d3.format(".01f")));    
}



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
    var bins = d3.layout.histogram()
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

$("#clear_histo").click(function(){
    d3.select("#histo_chart").selectAll("svg")
    .data([])
    .exit()
    .remove();
})
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

$("#getInput").click(function(){
    var name = document.getElementById('myInput').value;
    var num = +name2index[name];
    console.log(num);
    highlight(num);
});

$("#cancel").click(function(){
    float_window["_groups"][0][0]["style"].visibility = "hidden";
    hide_highlight();
})

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
            (svg_height - padding_top_offset) * (tmp - refer[i].minValue) / (refer[i].maxValue - refer[i].minValue);
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