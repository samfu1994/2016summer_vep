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
        .attr("width", 10)
        .style("fill", function(d, i) {
                                var l = d.length;
                                if(l > 255) l = 255;
                                var str = "rgb(100," + (255 - l)+ " , " + (255 - l) + ")";
                                       return str;})
        .append("title")
        .text(function(d){ return d.length;})
        ;
};




function draw_small(){
    if(currentPlot == "box") showBox = 1;
    else showBox = 0;
    //define chart, will be called later
    showText = 0;
    outlier_size = 2;
    var horizon_margin = 2;
    var width = 10;
    var height = 470;
    var chart = d3.box()
    .whiskers(iqr(3))
    .width(width)
    .height(height);    
    //container of each svg 
    for(i = 0; i < 500; i++){
        visited_color_coding[i] = 0;
    }
    var containers = d3.select("#small_chart").selectAll("div")
          .data(refer)
          .enter()
          .append("div")
          .attr("id", function(d, i){return "container" + i;})
          .attr("class", "single_container")
          .style("display","inline-block")
          .style("width", "11.5px")
          .style("height", height)
          .style("position", "relative");
    
    //each svg has a histogram plot and a boxplot
    
    var color_svg = containers
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
      if(!showBox){
          for(var i = 0; i < refer.length; i++){
            if(!visited_color_coding[i]){
                    draw_color_coding(i);
                            visited[i] = 1;
                            d3.select("#small_chart").select("#box-svg" + i).style("display", "none").style("position", "absolute");
                        }
              else{
                  d3.select("#small_chart").select("#color-svg" + i).style("display", "block").style("position", "relative");

                  d3.select("#small_chart").select("#box-svg" + i).style("display", "none").style("position", "relative");
                  d3.select("#color-svg" + i).style("display", "none").style("position", "relative");

                  d3.select("#small_chart").select("#color-svg"+i).select(".eachLabel").style("display","block");
              }
          }
      }
};

