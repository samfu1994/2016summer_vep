var isSelect = [];
for(var i = 0; i < 5000; i++) {
    isSelect.push(0);
}


function makeTable() {
	var data, sort_by, filter_cols; // Customizable variables
	
    function my_highlight(num){
        console.log("highlight" + num);
        
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
        
        
        console.log(current_click);
        
        
        
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
                    //get the index
                    var cur_index = this.getAttribute('class').substring(9);
                    cur_index = + cur_index;
                    visited_color[cur_index] = 0;
                    click_count -= 1;
                    var c = d3.select(this).attr("class");
                    d3.selectAll("." + c).style("display", "none");
                    already_highlight.delete(d3.select(this).attr(cur_index));
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

    
    
    
    
	var table; // A reference to the main DataTable object
	
	// This is a custom event dispatcher.
	var dispatcher = d3.dispatch('highlight', 'select');
	
	// Main function, where the actual plotting takes place.
	function _table(targetDiv) {
	  // Create and select table skeleton
	  var tableSelect = targetDiv.append("table")
	    .attr("class", "display compact")
			// Generally, hard-coding Ids is wrong, because then 
			// you can't have 2 table plots in one page (both will have the same id).
			// I will leave it for now for simplicity. TODO: remove hard-coded id.
	    .attr("id", "gene_table") 
	    .style("visibility", "hidden"); // Hide table until style loads;
			
	  // Set column names
	  var colnames = Object.keys(data[0]);
		if(typeof filter_cols !== 'undefined'){
			// If we have filtered cols, remove them.
			colnames = colnames.filter(function (e) {
				// An index of -1 indicate an element is not in the array.
				// If the col_name can't be found in the filter_col array, retain it.
				return filter_cols.indexOf(e) < 0;
			});
		}
		
		// Here I initialize the table and head only. 
		// I will let DataTables handle the table body.
	  var headSelect = tableSelect.append("thead");
	  headSelect.append("tr")
	    .selectAll('td')
	    .data(colnames).enter()
		    .append('td')
		    .html(function(d) { return d; });
	
		if(typeof sort_by !== 'undefined'){
			// if we have a sort_by column, format it according to datatables.
			sort_by[0] = colnames.indexOf(sort_by[0]); //colname to col idx
			sort_by = [sort_by]; //wrap it in an array
		}
		

	  // Apply DataTable formatting: https://www.datatables.net/
	  $(document).ready(function() {
	    table = $('#gene_table').DataTable({
				// Here, I am supplying DataTable with the data to fill the table.
				// This is more efficient than supplying an already contructed table.
				// Refer to http://datatables.net/manual/data#Objects for details.
	      data: data,
	      columns: colnames.map(function(e) { return {data: e}; }),
	      "bLengthChange": false, // Disable page size change
	      "bDeferRender": true,
	      "order": sort_by
	    });
			
	    tableSelect.style("visibility", "visible");
      $('#gene_table tbody')
        .on( 'mouseover', 'tr', function () { highlight(this, true); } )
        .on( 'mouseleave', 'tr', function () { highlight(this, false); } )
        .on('click', 'tr', function () {
          
            var cur_name = this.firstChild.textContent;
            var cur_index = +name2index[cur_name];
            if(isSelect[cur_index] == 1){
//                console.log("it has been selected");
                var color_index = +this.getAttribute("color_index");
                isSelect[cur_index] = 0;
                visited_color[color_index] = 0;
                click_count -= 1;
                d3.selectAll(".highlight" + color_index).style("display", "none");
//                already_highlight.delete(d3.select(this).attr());
            }
            else{
//                console.log("it has not been selected");
                isSelect[cur_index] = 1;
                var i;
                // find available colors
                for(i = 0; i < 10; i++){
                    if(visited_color[i] == false){
                        break;
                    }
                }
//                console.log(this);
                $(this).attr("color_index", i);
                my_highlight(cur_index);
            }
          
            select(this);

        });
	  });	
	}
  
	/**** Helper functions to highlight and select data **************/
	function highlight(row, on_off) {
		if(typeof on_off === 'undefined'){
			// if on_off is not provided, just toggle class.
			on_off = !d3.select(row).classed('highlight');
		}
		// Set the row's class as highlighted if on==true,
		// Otherwise remove the 'highlighted' class attribute.
		// In DataTables, this is handled automatically for us.
		d3.select(row).classed('highlight', on_off);
		
		// Fire a highlight event, with the data and highlight status.
		dispatcher.highlight(table.rows(row).data()[0], on_off);
	}
	function select(row, on_off) {
		// Similar to highlight function.
		if(typeof on_off === 'undefined'){
			on_off = !d3.select(row).classed('selected');
		}
		
		d3.select(row).classed('selected', on_off);	
        
		// Fire a select event, with the data and selected status.
		dispatcher.select(table.rows(row).data()[0], on_off);
    }
	
	/**** Setter / getters functions to customize the table plot *****/
	_table.datum = function(_){
    if (!arguments.length) {return data;}
    data = _;
    
    return _table;
	};
	_table.filterCols = function(_){
    if (!arguments.length) {return filter_cols;}
    filter_cols = _;
    
    return _table;
	};
	_table.sortBy = function(colname, ascending){
    if (!arguments.length) {return sort_by;}
    
		sort_by = [];
		sort_by[0] = colname;
		sort_by[1] = ascending ? 'asc': 'desc';
    
    return _table;
	};
	
	
	// This allows other objects to 'listen' to events dispatched by the _table object.
//	d3.rebind(_table, dispatcher, 'on');
	
	// This is the return of the main function 'makeTable'
	return _table;
}
