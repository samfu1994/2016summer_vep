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
var outlier_size;
var HORIZIN_HISTO_HEIGHT = 500;
var HORIZIN_HISTO_WIDTH = 120;
var tooltip;
var clicked = false;
var current_click = -1;
var click_count = 0;
var showText;
var showSmall = 0;
var files = ["data/transpose_ubiq2.csv", "data/20000_ubiq3.csv"]
var color_pool = ["red", "aqua", "blue", "blueviolet", "burlywood", "cadetblue",
                 "chartreuse", "darkblue", "darkorange", "darkgrey", "brown"];
var visited_color = new Array(color_pool.length)
for(i = 0; i < color_pool.length; i++)
    visited_color[i] = 0;

var visited_color_coding = new Array(500);
var visited = new Array(500);
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


function getdata(file_index){
    
    d3.csv(files[file_index], function(error, csv) {
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
function draw(){
    showText = 1;
    outlier_size = 4;
    //define chart, will be called later
    for(i = 0; i < 500; i++){
        visited[i] = 0;
    }
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
          .style("height", "700px")
          .style("position", "relative");
    
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
            .attr("height", height + margin.bottom + margin.top); //this is the boxplot
    var histo_svg = containers
            .append("svg")
            .attr("class","color-svg")
            .style("display", "none")
            .attr("id", function(d, i){return "color-svg" + i;})
            .attr("width", function(d, i){
                    return width + margin.left + margin.right; 
              })
            .attr("height", height + margin.bottom + margin.top); //this is the boxplot
    var svg = containers
          .append("svg")
          .attr("class", "box box-svg")
          .attr("index", function(d, i){return i;})
          .attr("id", function(d, i){return "box-svg" + i;})
          .attr("width", function(d, i){
                return width + margin.left + margin.right; 
          })
          .attr("height", height + margin.bottom + margin.top);    
    //show to histogram in place
      var colorButtons = containers
            .append("button")
            .attr("type", "button")
            .attr("class","btn btn-info")
            .text("color plot")
            .style("width", "100px")
            .style("display", "block")
            .style("margin-top", "5px")
            .style("margin-bottom", "5px")
            .on("click", function(d, i){
                var cur = d3.select("#color-svg" + i);
                console.log(cur.style);
                if(d3.select("#color-svg" + i).style("display") == "none"){
                    d3.select("#histo-svg" + i).style("display", "none").style("position", "relative");
                    d3.select("#box-svg" + i).style("display", "none").style("position", "relative");
                    draw_color_coding(i);
                }
                else{
                    d3.select("#color-svg" + i).style("display", "none").style("position", "relative");
                    d3.select("#box-svg" + i).style("display", "block").style("position", "relative");
                }
                
            });
                
        
        var changeButtons = containers
            .append("button")
            .attr("type", "button")
            .attr("class","btn btn-primary")
            .text("change plot")
            .style("width", "100px")
            .style("display", "block")
            .style("margin-top", "5px")
            .style("margin-bottom", "5px")
            .on("click", function(d, i){
                if( d3.select("#chart").select("#histo-svg" + i).style("display") == "none"){
                    //to show histogram
                    
                    if(visited[i]){
                        d3.select("#chart").select("#histo-svg" + i).style("display", "block").style("position", "relative");
                    
                        d3.select("#chart").select("#box-svg" + i).style("display", "none").style("position", "relative");
                        
                        d3.select("#chart").select("#color-svg" + i).style("display", "none").style("position", "relative");
                        
                        d3.select("#chart").select("#histo-svg"+i).select(".eachLabel").style("display","block");
                    }
                    else{
                        draw_horizon_histo(i);
                        visited[i] = 1;
                    }
                }
                else{
                    d3.select("#chart").select("#histo-svg" + i).style("display", "none").style("position", "relative");
                    d3.select("#chart").select("#color-svg" + i).style("display", "none").style("position", "relative");
                    d3.select("#chart").select("#box-svg" + i).style("display", "block").style("position", "relative");
                    
                }
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
          .attr("class","eachLabel")

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

function draw_small(){
    //define chart, will be called later
    showText = 0;
    outlier_size = 2;
    var horizon_margin = 2;
    var width = 10;
    var height = 300;
    var chart = d3.box()
    .whiskers(iqr(3))
    .width(width)
    .height(height);    
    //container of each svg                
    var containers = d3.select("#small_chart").selectAll("div")
          .data(refer)
          .enter()
          .append("div")
          .attr("id", function(d, i){return "container" + i;})
          .attr("class", "single_container")
          .style("display","inline-block")
          .style("width", "11.5px")
          .style("height", "300px")
          .style("position", "relative");
    
    //each svg has a histogram plot and a boxplot
    
    var histo_svg = containers
            .append("svg")
            .attr("class","color-svg")
            .style("display", "none")
            .attr("id", function(d, i){return "color-svg" + i;})
            .attr("width", function(d, i){
                    return width; 
              })
            .attr("height", height); //this is the boxplot
    var svg = containers
          .append("svg")
          .attr("class", "box box-svg")
          .attr("index", function(d, i){return i;})
          .attr("id", function(d, i){return "box-svg" + i;})
          .attr("width", function(d, i){
                return width; 
          })
          .attr("height", height);    
    //show to histogram in place
    
      //draw 
      svg.append("rect")
        .attr("class", "btn")
        .attr("number", function(d, i){return i;})
        .attr("x", 0)
        .attr("y", 0)
        .attr("position", "relative")
        .style("z-index", 1)
        .attr("width", function() {return width;})
        .attr("height", function() {return height;})
          .attr("pointer-events", "none")
      ;
    
      //draw the boxplot
      svg.call(chart);
    };


function recover_box(number){
    d3.select("#histo-svg"+number).style("display", "none");
    d3.select("#box-svg"+number).style("display", "inline-block");
}

function draw_color_coding(number){
    data = refer[number];
    var minValue = Math.min.apply(null, data);
    var maxValue = Math.max.apply(null, data);

    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30};
    var width = HORIZIN_HISTO_WIDTH - margin.left - margin.right;
    var height = HORIZIN_HISTO_HEIGHT - margin.top - margin.bottom;

    var y = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([470, 0]);
    
    var bins = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(35))
        (data);

    var x = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { 
            return d.length; })])
        .range([0, width]);

    var svg = d3.select("#color-svg"+number)
        .style("display", "inline-block")
    ;
    var num_bar = bins.length
    var each_height = 470.0 / num_bar

    var bar = svg.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) { 
            if(y(d.x1) == 470)
                return "translate(" + 0 + ", 500 )";

            return "translate(" + 0 + "," + y(d.x1) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("fill", "cornflowerblue")
        .attr("height", function(){return each_height;})
        .attr("width", 120)
        .style("fill", function(d) {return "rgb(0, 0, " + (1 - d) * 300 + ")";})
        ;
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
        .range([470, 0]);
    
    var bins = d3.histogram()
        .domain(y.domain())
        .thresholds(y.ticks(35))
        (data);

    var x = d3.scaleLinear()
        .domain([0, d3.max(bins, function(d) { 
            return d.length; })])
        .range([0, width]);

    var svg = d3.select("#histo-svg"+number)
        .style("display", "inline-block")
//        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    ;
    

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
          })
          .attr("y", function(d){
              return (height + margin.bottom + margin.top);
          })
        .attr("class","eachLabel")
          .style("display", "block")
          .attr("left", function(){
            return -(width + margin.left + margin.right)
          })
          .attr("font-family", "sans-serif")
          .attr("font-size", "10px")
          .attr("fill", "red"); 
    
    svg.append("g")
        .attr("class", "axis vertical--y")
        .call(d3.axisLeft(y));
    
}

function show_both(number){
    if(!visited[number]){
        draw_horizon_histo(number);
        visited[number] = 1;
    }
    d3.select("#chart").select("#histo-svg"+number).style("display", "block").style("position", "relative");
    d3.select("#chart").select("#box-svg"+number).style("display", "block").style("position", "absolute").style("top", "0px").style("left", "30px");
    d3.select("#chart").select("#histo-svg"+number).select(".eachLabel").style("display","none");
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
var isDesc = 0;
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
                if(!isDesc){
                    currentCri += "  DESC";
                    isDesc = 1;
                }
                else{
                    currentCri = currentCri.substring(0,currentCri.length - 6);
                    isDesc = 0;
                }
                refer.reverse();
            }
        
    
        $(".display_current_cri").text(currentCri);
        if(showSmall){
            var myNode = $("#small_chart").get(0);
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }    
            draw_small();
            
        }
        else{
            var myNode = $("#chart").get(0);
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }    
            draw();
        }
});

$("#getInput").click(function(){
    var name = document.getElementById('myInput').value;
    var num = +name2index[name];
    highlight(num);
});

$("#cancel").click(function(){
    float_window["_groups"][0][0]["style"].visibility = "hidden";
    hide_highlight();
    clicked = 0;
});
$("#change_all_histo").click(function(){
    if(!showSmall){
        for(var i = 0; i < refer.length; i++){
            if(!visited[i]){
                console.log("here");
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
});
$("#change_all_color").click(function(){
    if(showSmall){
        for(var i = 0; i < refer.length; i++){
            if(!visited_color_coding[i]){
                draw_color_coding(i);
                visited_color_coding[i] = 1;
                d3.select("#small_chart").select("#box-svg" + i).style("display", "none").style("position", "absolute");
            }
            else{
                d3.select("#small_chart").select("#histo-svg" + i).style("display", "none").style("position", "relative");

                d3.select("#small_chart").select("#box-svg" + i).style("display", "none").style("position", "relative");
                d3.select("#small_chart").select("#color-svg" + i).style("display", "block").style("position", "relative");

                d3.select("#small_chart").select("#histo-svg"+i).select(".eachLabel").style("display","block");
            }
        }
    }
});


$("#change_all_box").click(function(){
    for(var i = 0; i < refer.length; i++){
        d3.select("#small_chart").select("#histo-svg" + i).style("display", "none").style("position", "relative");
        d3.select("#small_chart").select("#color-svg" + i).style("display", "none").style("position", "relative");
        d3.select("#small_chart").select("#box-svg" + i).style("display", "block").style("position", "relative");
        
        d3.select("#chart").select("#histo-svg" + i).style("display", "none").style("position", "relative");
        d3.select("chart").select("#color-svg" + i).style("display", "none").style("position", "relative");
        d3.select("#chart").select("#box-svg" + i).style("display", "block").style("position", "relative");
    }
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
    
    var tmpHandler = 
    d3.select("#chart")
    .selectAll(".box-svg")
    .data(coordinate)
    .append("circle")
    .attr("class", "highlight" + current_click)
    .attr("cx", 10)
    .attr("stroke-width", 10)
    .attr("r", 5)
    .style("position", "absolute")
    .style("visibility", "visible")
    .style("z-index", 20)
    .style("fill", color_pool[current_click + 1])
    .style("pointer-events", "none")
    .style("z-index", "15")
    .attr("cy", function(d){ return d;});
    
    d3.select("#reference")
    .select("svg")
    .append("circle")
    .attr("class", "highlight" + current_click)
    .attr("r", 5)
    .attr("cx", 20)
    .attr("cy", function(){return 20 +  10 * current_click})
    .attr("stroke-width", 10)
    .style("fill", color_pool[current_click + 1]);
    
    d3.select("#reference")
    .select("svg")
    .append("text")
    .attr("class", "highlight" + current_click)
    .attr("dy", function(){return 20 + 10 * current_click;})
    .attr("dx",  20)
    .attr("position", "relative")
    .text(document_name[num]);
};

$(".toggle_display").click(function(){
    if(showSmall){
        //to show big
        $("#small_chart").css("display", "none");
        $("#chart").css("display", "block");
        showSmall = 0;
    }
    else{
        showSmall = 1;
        $("#chart").css("display", "none");      
        $("#small_chart").css("display", "block");        
    }
});
$(".file").click(function(){
    d3.select("#chart").selectAll("*").remove();
    if(this.value == "ubiq2"){
        getdata(0);
    }
    else if(this.value == "ubiq3"){
        getdata(1);
    }
    else{
        
    }
    $(".display_file_name").text(this.value);
});
                          
$('[class^="highlight"]').click(function(){
    alert($this.class);
});
$('[class^="highlight"]').mouseover(function(){
    console.log("aaa");
});
$(".outlier").mouseover(function(){
    console.log("aaa");
});
//mouseout event, hide all the highlight
function hide_highlight(){
    var tmpHandler = d3.selectAll(".highlight-1")
            .style("display", "none")
            .style("pointer-events", "none");
}