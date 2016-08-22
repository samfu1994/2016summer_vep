var refer = [5,4,3,2,1];
$(".sortCriterion").click(function(){
    alert(this.value);
    if(this.value == "mean"){
            alert("mean");
            refer.sort(sortMean);
        }
        else if(this.value == "max"){
            alert("max");
            refer.sort(sortMax);
        }
        else{
            alert("miin");
            refer.sort(sortMin);
        }
    
    
    
});