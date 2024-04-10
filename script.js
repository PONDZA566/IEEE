// Mocking the document object
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><head></head><body><div id="box" class="box"></div></body></html>');
global.document = dom.window.document;

// Your actual code starts here
console.log("Script started.");

var box = document.getElementById("box");
if (box) {
    console.log("Box element found.");

    var clickHandler = function(event) {
        console.log("Box clicked.");

        var rect = box.getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;

        // Adjust the scaling factor as needed
        var scaledX = x / 10; // For example, assuming each 10 pixels represent 1 unit
        var scaledY = y / 10;

        console.log("(" + scaledX + ", " + scaledY + ")");
    };

    // Add click event listener
    box.addEventListener("click", clickHandler);

    // Keep the script running indefinitely to listen for click events
    console.log("Script will keep running to listen for click events...");
    setInterval(() => {}, 1000); // Run an empty function every second
} else {
    console.error("Box element not found.");
}
