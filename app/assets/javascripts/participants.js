// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

let canvas;

$(document).ready(function(){
    canvas = document.getElementById("game_canvas");
    canvas.addEventListener('mousedown', doMouseDown);
});

function doMouseDown(event){
    var ctx = canvas.getContext("2d");
    ctx.moveTo(0,0);
    console.log(event);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

