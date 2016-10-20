

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
});


$("#clear_histo").click(function(){
    d3.select("#histo_chart").selectAll("svg")
    .data([])
    .exit()
    .remove();
});
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
$(".dropdown-menu").on('click', 'li a', function(){
      $("#sort-criteria").text($(this).text());
   });

$( document ).ready(function() {
    $("#hideInstruction").click(function(){
        console.log("aaa");
            $("#instruction_title").click();
    });
});
