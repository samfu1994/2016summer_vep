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
var gene_data = [];
var showText;
var showSmall = 0;
var currentFILE = "NULL";
var showBox = true;
var currentPlot = "box";
var already_highlight = new Set();
var files = ["transpose_ubiq2.csv", "20000_ubiq3.csv"];
var pre_path = "data/";
var color_pool = ["red", "aqua", "blue", "blueviolet", "burlywood", "cadetblue",
                 "chartreuse", "darkblue", "darkorange", "darkgrey", "brown"];
var visited_color = new Array(color_pool.length)
for(i = 0; i < color_pool.length; i++)
    visited_color[i] = 0;

var visited_color_coding = new Array(500);
for(i = 0; i < 500; i++)
    visited_color_coding[i] = 0;
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
var origin_refer = new Array;
var clickMargin = 10;



//function getdata(file){
//    currentFILE = file;
//    d3.csv(pre_path + file, function(error, csv) {
//      if (error) throw error;
//
//      Object.size = function(obj) {
//        var size = 0, key;
//        for (key in obj) {
//            if (obj.hasOwnProperty(key)) size++;
//        }
//        return size;
//      };
//
//      var index = 0;
//      //malloc space
//      for(var x in csv[1]){
//         if(!isNaN(csv[1][x])){
//             refer[index] = [];
//             max[index] = -Infinity;
//             min[index] = Infinity;
//             index++;
//         } 
//      }
//      //bind document name with index
//      for(var x in csv){
//          document_name.push(csv[x].text_key);
//          name2index[csv[x].text_key] = x;
//      }
//      var label = [];
//      for(var ele in csv[0]){
//          if(!isNaN(csv[0][ele])){ 
//              label.push(ele);// key 
//          }
//      }
//        console.log("aaaa");
//        console.log(label);
//      //transpose the mat
//      for(var row in csv){
//          index = 0;
//          for(var ele in csv[row]){
//              var tmp = +csv[row][ele];
//              if(!isNaN(tmp)){
//                  refer[index].push(tmp);
//                  if (tmp > max[index]) max[index] = tmp;
//                  if (tmp < min[index]) min[index] = tmp;
//                  index++;
//              }
//          }
//      }
//      //store the attribute to each of the feature
//      for(var col in refer){
//          refer[col].meanValue = findMean(refer[col]);
//          refer[col].maxValue = +max[col];
//          refer[col].minValue = +min[col];
//          refer[col].label = label[col]; 
//      }
//        
//      origin_refer = refer.slice();
////        gene_data = data_for_dt();
//        draw();
//        draw_small();
//
//
//      float_window = d3.select("body").append("div");
//        float_window.style("position", "absolute")
//            .style("z-index", "10")
//            .attr("class", "tag")
//            .style("visibility","hidden")
//            .text("default");
//      }
//)};
function draw(){
    if(currentPlot == "box") showBox = 1;
    else showBox = 0;
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
    var svg = containers
          .append("svg")
          .attr("class", "box box-svg")
          .attr("index", function(d, i){return i;})
          .attr("id", function(d, i){return "box-svg" + i;})
          .attr("width", function(d, i){
                return width + margin.left + margin.right; 
          })
          .attr("height", height + margin.bottom + margin.top);  
                
        
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
      ;
    
      //draw the boxplot
      svg.call(chart);
      if(!showBox){
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
    };



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

function redraw(){
            var myNode = $("#small_chart").get(0);
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }    
            draw_small();

            var myNode = $("#chart").get(0);
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }    
            draw();
    if(showSmall){
        //to show big
        $("#small_chart").css("display", "block");
        $("#chart").css("display", "none");
    }
    else{
        $("#chart").css("display", "block");      
        $("#small_chart").css("display", "none");        
    }
    
    for(var i = 0; i < 10; i++){
        visited_color[i] = false;
    }
    for(let item of already_highlight){
        var i;
        // find available colors
        for(i = 0; i < 10; i++){
            if(visited_color[i] == false){
                break;
            }
        }
        clicked = true;
        visited_color[i] = 1;// set the visited bit of color vector
        current_click = i; // set current_click
        click_count += 1;
        d = +item;
        my_highlight(d); // highlight them, with class name ends with current_click
//        d3.selectAll(".highlight" + current_click)
//                .style("pointer-events", "auto")
//                .attr("index", d)
//                .on("click", function(){
//                    //if clicked again, then hide all them.
//                    visited_color[i] = 0;
//                    click_count -= 1;
//                    var c = d3.select(this).attr("class");
//                    d3.selectAll("." + c).style("display", "none");
//                    already_highlight.delete(d3.select(this).attr(index));
//                })
//                .on("mouseover", function(){
//                    //each time mouseover, current_click should be -1, so the color is red
//                    d = +d3.select(this).attr("index");
//                    float_window["_groups"][0][0].textContent = document_name[d];
//                    float_window["_groups"][0][0].style.visibility = "visible";                
//                    })
//                .on("mousemove", function(){
//                    float_window["_groups"][0][0].style["top"] = (event.pageY-10)+"px";
//                    float_window["_groups"][0][0].style["left"] = (event.pageX+10)+"px";
//                    })
//                .on("mouseout", function(){
//                    float_window["_groups"][0][0]["style"].visibility = "hidden";
//                    })
//                ;
    }
};

//highlight all the values of the selected document in each svg
function my_highlight(num){
    console.log("my_highlight" + num);
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
    
    
    var tmpHandler = 
    d3.select("#small_chart")
    .selectAll(".box-svg")
    .data(coordinate)
    .append("circle")
    .attr("class", "highlight" + current_click)
    .attr("cx", 5)
    .attr("stroke-width", 10)
    .attr("r", 2)
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
    
    d3.selectAll(".highlight" + current_click)
                .style("pointer-events", "auto")
                .attr("index", num)
                .on("click", function(){
                    //if clicked again, then hide all them.
                    visited_color[i] = 0;
                    click_count -= 1;
                    var c = d3.select(this).attr("class");
                    d3.selectAll("." + c).style("display", "none");
                    already_highlight.delete(d3.select(this).attr(index));
                })
                .on("mouseover", function(){
                    //each time mouseover, current_click should be -1, so the color is red
                    d = +d3.select(this).attr("index");
                    float_window["_groups"][0][0].textContent = document_name[d];
                    float_window["_groups"][0][0].style.visibility = "visible";                
                    })
                .on("mousemove", function(){
                    float_window["_groups"][0][0].style["top"] = (event.pageY-10)+"px";
                    float_window["_groups"][0][0].style["left"] = (event.pageX+10)+"px";
                    })
                .on("mouseout", function(){
                    float_window["_groups"][0][0]["style"].visibility = "hidden";
                    })
                ;
    
};

//mouseout event, hide all the highlight
function hide_highlight(){
    var tmpHandler = d3.selectAll(".highlight-1")
            .style("display", "none")
            .style("pointer-events", "none");
}

