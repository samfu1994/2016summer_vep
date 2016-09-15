(function() {

d3.box = function() {
  var width = 1,
      height = 1,
      duration = 0,
      domain = null,
      value = Number,
      whiskers = boxWhiskers,
      quartiles = boxQuartiles,
      tickFormat = null;

  // For each small multiple…
  function box(g) {
    g.each(function(d, i) {
//      d_new = d.map(function(num){return num});
      
      d = d.map(function(val, i){
           var rObj = {};
           rObj["value"] = +val;
           rObj["index"] = i;
          //index is int, value is string!!!!
           return rObj;
      }).sort(function(a, b){
          if (a.value > b.value) {
            return 1;
          }
          if (a.value < b.value) {
            return -1;
          }
          
          return 0; 
      });
        
//        console.log(d);
      var g = d3.select(this),
          n = d.length,
          min = d[0].value,
          max = d[n - 1].value;

      // Compute quartiles. Must return exactly 3 elements.
      var quartileData = d.quartiles = quartiles(d);
        
//      console.log(quartileData);
//      console.log(quartileData);
      // Compute whiskers. Must return exactly 2 elements, or null.
        var dd = d.map(function(ddd){
          return ddd.value;
        });
        dd.quartiles = d.quartiles;
        var whiskerIndices = whiskers && whiskers.call(this, dd, i);
//        console.log(whiskerIndices);
        var whiskerData = whiskerIndices && whiskerIndices.map(function(i) { return dd[i]; });
        
//        console.log(whiskerData);
        
//      console.log(whiskerData);

//      console.log(whiskerIndices);
//      console.log(whiskerIndices.map(function(i) { return d[i]; }));
      // Compute outliers. If no whiskers are specified, all data are "outliers".
      // We compute the outliers as indices, so that we can join across transitions!
      var outlierIndices = 
          whiskerIndices? 
          d3.range(0, whiskerIndices[0]).concat(d3.range(whiskerIndices[1] + 1, n))
          : d3.range(n);
//      console.log(d);
//      console.log(outlierIndices);
      // Compute the new x-scale.
      var x1 = d3.scale.linear()
          .domain(domain && domain.call(this, dd, i) || [min, max])
          .range([height, 0]);
      // Retrieve the old x-scale, if this is an update.
      var x0 = this.__chart__ || d3.scale.linear()
          .domain([0, Infinity])
          .range(x1.range());
        
//      console.log("range");
//      console.log(x1.range());

      // Stash the new scale.
      this.__chart__ = x1;

      // Note: the box, median, and box tick elements are fixed in number,
      // so we only have to handle enter and update. In contrast, the outliers
      // and other elements are variable, so we need to exit them! Variable
      // elements also fade in and out.

      // Update center line: the vertical line spanning the whiskers.
      var center = g.selectAll("line.center")
          .data(whiskerData ? [whiskerData] : []);
//      console.log(whiskerData);
      center.enter().insert("line", "rect")
          .attr("class", "center")
          .attr("x1", width / 2)
          .attr("y1", function(d) { return x0(d[0]); })
          .attr("x2", width / 2)
          .attr("y2", function(d) { return x0(d[1]); })
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .style("opacity", 1)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); });

      center.transition()
          .duration(duration)
          .style("opacity", 1)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); });

      center.exit().transition()
          .duration(duration)
          .style("opacity", 1e-6)
          .attr("y1", function(d) { return x1(d[0]); })
          .attr("y2", function(d) { return x1(d[1]); })
          .remove();

      // Update innerquartile box.
      var box = g.selectAll("rect.box")
          .data([quartileData]);
        
      
      
      box.enter().append("rect")
          .attr("class", "box")
          .attr("pointer-events", "none")
          .attr("x", 0)
          .attr("y", function(d) { return x0(d[2]); })
          .attr("width", width)
          .attr("height", function(d) { return x0(d[0]) - x0(d[2]); })
        .transition()
          .duration(duration)
          .attr("y", function(d) { return x1(d[2]); })
          .attr("height", function(d) { if(x1(d[0]) - x1(d[2]) < 0){
//          console.log(d); console.log(x1(d[0]));console.log(x1(d[2]));console.log(x1(d[0]) - x1(d[2]));
      }     return x1(d[0]) - x1(d[2]); });
//
//      box.transition()
//          .duration(duration)
//          .attr("y", function(d) { return x1(d[2]); })
//          .attr("height", function(d) { return x1(d[0]) - x1(d[2]); });

      // Update median line.
      var medianLine = g.selectAll("line.median")
          .data([quartileData[1]]);

      medianLine.enter().append("line")
          .attr("class", "median")
          .attr("x1", 0)
          .attr("y1", x0)
          .attr("x2", width)
          .attr("y2", x0)
        .transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1);

      medianLine.transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1);

      // Update whiskers.
      var whisker = g.selectAll("line.whisker")
          .data(whiskerData || []);

      whisker.enter().insert("line", "circle, text")
          .attr("class", "whisker")
          .attr("x1", 0)
          .attr("y1", x0)
          .attr("x2", width)
          .attr("y2", x0)
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1);

      whisker.transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1);

      whisker.exit().transition()
          .duration(duration)
          .attr("y1", x1)
          .attr("y2", x1)
          .style("opacity", 1e-6)
          .remove();

      // Update outliers.
      var outlier = g.selectAll("circle.outlier")
          .data(outlierIndices, Number);
      
        
//          console.log(outlierIndices);

//      console.log(tooltip[0][i]);
        
      outlier.enter().insert("circle", "text")
          .attr("class", "outlier")
          .attr("r", 3)
          .attr("cx", width / 2)
          .attr("cy", function(i) { return x0(dd[i]); })
          .style("opacity", 1e-6)
          .attr('index', function(i){ return d[i].index;})
          .transition()
          .duration(duration)
          .attr("cy", function(i) { return x1(dd[i]); })
          .style("opacity", 1);
        
        var tt = g.selectAll(".outlier")
            .on("mouseover", function(){
//                console.log(d3.select(this).attr("index"));
//                console.log(d);
                //now d is after sorting.
                d = +d3.select(this).attr("index");
                float_window[0][0].textContent = document_name[d];
                float_window[0][0].style.visibility = "visible";
                highlight(d);
            })
            .on("mousemove", function(){
                float_window[0][0].style["top"] = (event.pageY-10)+"px";
                float_window[0][0].style["left"] = (event.pageX+10)+"px";
            })
        
            .on("mouseout", function(){
                    float_window[0][0].style.visibility = "hidden";
                    hide_highlight();
           });
          
      
//        var tmp = g.selectAll(".outlier")
//                .append("div")
//                .attr("x", 0)
//                .attr("dy", ".35em")
//                .attr("text-anchor", "middle")
//                .style("position", "absolute")
//                .style("z-index", "10")
//                .style("visibility", "visible")
//                .text(function(d) { return document_name[d]; });
        
        
        
              

//      outlier.transition()
//          .duration(duration)
//          .attr("cy", function(i) { return x1(d[i]); })
//          .style("opacity", 1);
//
//      outlier.exit().transition()
//          .duration(duration)
//          .attr("cy", function(i) { return x1(d[i]); })
//          .style("opacity", 1e-6)
//          .remove();


      // Compute the tick format.
      var format = tickFormat || x1.tickFormat(8);

      // Update box ticks.
      var boxTick = g.selectAll("text.box")
          .data(quartileData);

      boxTick.enter().append("text")
          .attr("class", "box")
          .attr("dy", ".3em")
          .attr("dx", function(d, i) { return i & 1 ? 6 : -6 })
          .attr("x", function(d, i) { return i & 1 ? width : 0 })
          .attr("y", x0)
          .attr("text-anchor", function(d, i) { return i & 1 ? "start" : "end"; })
          .text(format)
        .transition()
          .duration(duration)
          .attr("y", x1);

      boxTick.transition()
          .duration(duration)
          .text(format)
          .attr("y", x1);

      // Update whisker ticks. These are handled separately from the box
      // ticks because they may or may not exist, and we want don't want
      // to join box ticks pre-transition with whisker ticks post-.
      var whiskerTick = g.selectAll("text.whisker")
          .data(whiskerData || []);

      whiskerTick.enter().append("text")
          .attr("class", "whisker")
          .attr("dy", ".3em")
          .attr("dx", 6)
          .attr("x", width)
          .attr("y", x0)
          .text(format)
          .style("opacity", 1e-6)
        .transition()
          .duration(duration)
          .attr("y", x1)
          .style("opacity", 1);

      whiskerTick.transition()
          .duration(duration)
          .text(format)
          .attr("y", x1)
          .style("opacity", 1);

      whiskerTick.exit().transition()
          .duration(duration)
          .attr("y", x1)
          .style("opacity", 1e-6)
          .remove();
    });
    d3.timer.flush();
  }

  box.width = function(x) {
    if (!arguments.length) return width;
    width = x;
    return box;
  };

  box.height = function(x) {
    if (!arguments.length) return height;
    height = x;
    return box;
  };

  box.tickFormat = function(x) {
    if (!arguments.length) return tickFormat;
    tickFormat = x;
    return box;
  };

  box.duration = function(x) {
    if (!arguments.length) return duration;
    duration = x;
    return box;
  };

  box.domain = function(x) {
    if (!arguments.length) return domain;
    domain = x == null ? x : d3.functor(x);
    return box;
  };

  box.value = function(x) {
    if (!arguments.length) return value;
    value = x;
    return box;
  };

  box.whiskers = function(x) {
    if (!arguments.length) return whiskers;
    whiskers = x;
    return box;
  };

  box.quartiles = function(x) {
    if (!arguments.length) return quartiles;
    quartiles = x;
    return box;
  };

  return box;
};

function boxWhiskers(d) {
  return [0, d.length - 1];
}

function boxQuartiles(d) {
  var func = function(d){
      return d.value;
  };
  return [
    d3.quantile(d.map(func), .25),
    d3.quantile(d.map(func), .5),
    d3.quantile(d.map(func), .75)
  ];
}

})();