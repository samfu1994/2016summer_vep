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
var HORIZIN_HISTO_HEIGHT = 500;
var HORIZIN_HISTO_WIDTH = 120;
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
    }
    return sum / arr.length;
}

var refer = new Array; //global var to store the input 2d mat
var clickMargin = 10;


function getdata(flag){
    d3.csv("data/test_ubiq.csv", function(error, csv) {
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
//        alert(refer[0].length);
      if(!flag) draw();
      else histo(flag);
        
      float_window = d3.select("body").append("div");
        float_window.style("position", "absolute")
            .style("z-index", "10")
            .attr("class", "tag")
            .style("visibility","hidden")
            .text("default");
      }
)};
function draw(){
    //define chart, will be called later
    var chart = d3.box()
    .whiskers(iqr(3))
    .width(width)
    .height(height);
    
    //container of each svg                
    var containers = d3.select("#chart").selectAll("div")
          .data(refer)
          .enter()
          .append("div")
          .attr("id", function(d, i){return "container" + i;})
          .attr("class", "single_container")
          .style("display","inline-block")
          .style("width", "120px")
          .style("height", "700px");
    
    //each svg has a histogram plot and a boxplot
    
    //this is the histogram plot
    var histo_svg = containers
            .append("svg")
            .attr("class","histo-svg")
            .style("display", "none")
            .attr("id", function(d, i){return "histo-svg" + i;})
            .attr("width", function(d, i){
                    return width + margin.left + margin.right; 
              })
            .attr("height", height + margin.bottom + margin.top)
            .attr("position", "relative");
    //this is the boxplot
    var svg = containers
          .append("svg")
          .attr("class", "box box-svg")
          .attr("index", function(d, i){return i;})
          .attr("id", function(d, i){return "box-svg" + i;})
          .attr("width", function(d, i){
                return width + margin.left + margin.right; 
          })
          .attr("height", height + margin.bottom + margin.top)
          .attr("position", "relative");
    
    //show to histogram in place
    var change2histo_buttons = containers
            .append("button")
            .attr("type", "button")
            .attr("class","btn btn-primary")
            .text("histogram")
            .style("width", "100px")
            .style("display", "block")
            .style("margin-top", "5px")
            .style("margin-bottom", "5px")
            .on("click", function(d, i){
                draw_horizon_histo(i);
            });
    //show the boxplot
    var change2box_buttons = containers
            .append("button")
            .attr("type", "button")
            .attr("class","btn btn-primary")
            .text("boxplot")
            .style("display", "block")
            .style("margin-top", "5px")
            .style("margin-bottom", "5px")
            .on("click", function(d, i){
                recover_box(i);
            });
    //show both the boxplot and histogram plot
    var show_both_buttons = containers
            .append("button")
            .attr("type", "button")
            .attr("class","btn btn-success")
            .text("show both")
            .style("display", "block")
            .style("top", "600px")
            .on("click", function(d, i){
                show_both(i);
            });
    
    
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
    
      //draw 
      svg.append("rect")
        .attr("class", "btn")
        .attr("number", function(d, i){return i;})
        .attr("x", 0)
        .attr("y", 0)
        .attr("position", "relative")
        .style("z-index", 1)
        .attr("width", function() {return width + margin.left + margin.right - clickMargin;})
        .attr("height", function() {return height + margin.bottom + margin.top - clickMargin;})
          .attr("pointer-events", "none")
//        .on("click", function(d, i){draw_histo(i);})
      ;
    
      //draw the boxplot
      svg.call(chart);
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
        .rangeRound([0, width]);
    
    var bins = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (data);
    console.log("bins");
    console.log(bins);

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
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
    ;

    bar.append("rect")
        .attr("x", 1)
        .attr("fill", "cornflowerblue")
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
function recover_box(number){
    d3.select("#histo-svg"+number).style("display", "none");
    d3.select("#box-svg"+number).style("display", "inline-block");
}
function draw_horizon_histo(number){
    data = refer[number];
    var minValue = Math.min.apply(null, data);
    var maxValue = Math.max.apply(null, data);

    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30};
    var width = HORIZIN_HISTO_WIDTH - margin.left - margin.right;
    var height = HORIZIN_HISTO_HEIGHT - margin.top - margin.bottom;

    var y = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([height, 0]);
    
    var bins = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))
        (data);
    console.log(bins);

    var x = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { 
            return d.length; })])
        .range([0, width]);

    d3.select("#box-svg"+number).style("display", "none");
    var svg = d3.select("#histo-svg"+number)
        .style("display", "inline-block")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    var bar = svg.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { 
            return "translate(" + 0 + "," + y(d.x1) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("fill", "cornflowerblue")
        .attr("height", y(bins[0].x0) - y(bins[0].x1))
        .attr("width", function(d) { return x(d.length); });

    bar.append("text")
        .attr("dy", ".25em")
        .attr("y", (y(bins[0].x0) - y(bins[0].x1)) / 2)
        .attr("x", 80)
        .style("fill", "cornflowerblue")
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });

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
//    svg.append("circle")
//            .attr("class", "highlight")
//            .attr("cx", 10)
//            .attr("cy", 470)
//            .attr("stroke-width", 10)
//            .attr("r", 5)
//            .style("position", "absolute")
//            .style("visibility", "hidden")
//            .style("z-index", 20);   
    
    svg.append("g")
        .attr("class", "axis vertical--y")
        .call(d3.axisLeft(y));
    
}

function show_both(number){
    data = refer[number];
    var minValue = Math.min.apply(null, data);
    var maxValue = Math.max.apply(null, data);

    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30};
    var width = HORIZIN_HISTO_WIDTH - margin.left - margin.right;
    var height = HORIZIN_HISTO_HEIGHT - margin.top - margin.bottom;

    var y = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([height, 0]);
    
    var bins = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(20))
        (data);
    console.log(bins);

    var x = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { 
            return d.length; })])
        .range([0, width]);

//    d3.select("#box-svg"+number).style("display", "none");
    var svg = d3.select("#histo-svg"+number)
        .style("display", "absolute")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    

    var bar = svg.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { 
            return "translate(" + 0 + "," + y(d.x1) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("fill", "cornflowerblue")
        .attr("height", y(bins[0].x0) - y(bins[0].x1))
        .attr("width", function(d) { return x(d.length); });

    bar.append("text")
        .attr("dy", ".25em")
        .attr("y", (y(bins[0].x0) - y(bins[0].x1)) / 2)
        .attr("x", 80)
        .style("fill", "cornflowerblue")
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });

//    svg.append("circle")
//            .attr("class", "highlight")
//            .attr("cx", 10)
//            .attr("cy", 470)
//            .attr("stroke-width", 10)
//            .attr("r", 5)
//            .style("position", "absolute")
//            .style("visibility", "hidden")
//            .style("z-index", 20);   
    
    svg.append("g")
        .attr("class", "axis vertical--y")
        .call(d3.axisLeft(y));
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
//resort the svg according to the criterion users select
//remove all the old svg and redraw all of it
$(".sortCriterion").click(function(){
        var currentCri = $(".display_current_cri").html();
        if(this.value == "mean"){
                currentCri = "mean";
                refer.sort(sortMean);
            }
            else if(this.value == "max"){
                currentCri = "max";
                refer.sort(sortMax);
            }
            else if(this.value == "min"){
                currentCri = "min";
                refer.sort(sortMin);
            }
            else if(this.value == "desc"){
                currentCri += "  DESC";
                refer.reverse();
            }
        var myNode = $("#chart").get(0);
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }    
    
        $(".display_current_cri").text(currentCri);
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

//get quartiles 
function getQuar(d, i){
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2];
    var iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr);
    while (d[--j] > q3 + iqr);
    return [i, j];
};

//highlight all the values of the selected document in each svg
function highlight(num){
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
        
        coordinate.push(cur_coordinate);
        x_coorninate.push(10);
    }
    
    var tmpHandler = d3.selectAll(".highlight")
    .data(coordinate)
    .style("visibility", "visible")
    .style("fill", "red")
    .style("z-index", "15")
    .attr("cx", "10")
    .attr("cy", function(d){ return d;});

};

//mouseout event, hide all the highlight
function hide_highlight(){
    console.log("now hide");
    var tmpHandler = d3.selectAll(".highlight")
            .style("visibility", "hidden");
}