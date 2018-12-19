//get device in verschillende javascript fies..... soms laat de applicatie wel een id zien en soms niet. 
window.onload = function(){
    var userId = device.uuid;
    document.getElementById("tekst-ID").innerHTML = userId;
}
