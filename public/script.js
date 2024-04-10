document.addEventListener("DOMContentLoaded", function() {
    var box = document.getElementById("box");
    box.addEventListener("click", function(event) {
        var rect = box.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        console.log("Coordinates: (" + x/100 + ", " + y/100 + ")");
    });
});