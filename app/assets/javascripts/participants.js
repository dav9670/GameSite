// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

class Square {
	constructor(value){
		this.value = value;
	}
}

class Board {
	constructor (width, height) {
		this.width = width;
		this.height = height;
		this.length = 4;
		this.grid = [];
		for(let i=0; i<this.length; i++){
			let column = [];
			for(let x=0; x<this.length; x++){
				console.log(x);
				column[x] = new Square(0);
			}
			this.grid[i] = column;
		}
	}

	draw(context) {
		for(let i=0; i<this.grid.length; i++){
			for(let x=0; x<this.grid[i].length; x++){
				let sWidth = this.width / this.length;
				let sHeight = this.height / this.length;
				let startX = x * sWidth;
				let startY = i * sHeight;
				console.log(sWidth + " " + sHeight);
				context.moveTo(startX, startY);
				context.lineTo(startX + sWidth, startY);
				context.lineTo(startX + sWidth, startY + sHeight);
				context.lineTo(startX, startY + sHeight);
				context.lineTo(startX, startY);
				context.stroke();
			}
		}
	}
}

let canvas;

$(document).ready(function () {
	canvas = document.getElementById('game_canvas');

	let board = new Board(canvas.offsetWidth, canvas.offsetHeight);
	board.draw(canvas.getContext('2d'));

	console.log(board);

	//canvas.addEventListener('mousedown', doMouseDown)
});

/*function doMouseDown (event) {
}*/
