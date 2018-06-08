function calculateTip() {
    //alert("hello");
    var billAmount = document.getElementById("billAmount").value;
    var numPeople = document.getElementById("numPeople").value;
    var serviceQuality = document.getElementById("serviceQuality").value;
    
    if(billAmount ===""){
        document.getElementById("billAmount").style.border="1px red solid";
        document.getElementById("totalTip").style.display = "none";
    }
    
    if(numPeople ==="" || numPeople <= 1) {
        numPeople=1;
        document.getElementById("each").style.display = "none";
    }   
    else {         
        document.getElementById("each").style.display = "block";
    }
    
    var total =(billAmount*serviceQuality)/numPeople;
    total=total.toFixed(2);
    
    document.getElementById("tip").innerHTML=total;
    document.getElementById("totalTip").style.display = "block";
}


//Hiding unwanted part
document.getElementById("totalTip").style.display = "none";

//==== to compare same type
