// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

class Square {
	constructor(value, color){
		this.value = value;
		this.color = color;
	}
}

class Board {
	constructor (length, offestX, offsetY) {
		this.length = length
		this.offestX = offestX;
		this.offsetY = offsetY;
		this.nbSquares = 4;
		this.grid = [];
		for(let i=0; i<this.nbSquares; i++){
			let column = [];
			for(let x=0; x<this.nbSquares; x++){
				column[x] = new Square(0, "green");
			}
			this.grid[i] = column;
		}
	}

	draw(context) {
		for(let i=0; i<this.grid.length; i++){
			for(let x=0; x<this.grid[i].length; x++){
				let sLength = this.length / this.nbSquares;
				let startX = x * sLength + this.offestX;
				let startY = i * sLength + this.offsetY;

				context.beginPath();
				context.rect(startX, startY, sLength, sLength);
				context.fillStyle = this.grid[i][x].color;
				context.fill();
				context.stroke();

				context.textAlign = "center";
				context.textBaseline = "middle";
				context.font = "20px Arial";
				context.fillStyle = "black";
				context.fillText(this.grid[i][x].value, startX + (sLength / 2), startY + (sLength / 2), sLength);
			}
		}
	}
}

let canvas;

$(document).ready(function () {
	canvas = document.getElementById('game_canvas');

	let currentBoard = new Board(canvas.offsetWidth / 3, canvas.offsetWidth / 15, canvas.offsetHeight / 15);
	let opponentBoard = new Board(canvas.offsetWidth / 3, canvas.offsetWidth / 15 * 14 - (canvas.offsetWidth / 3), canvas.offsetHeight / 15);
	
	currentBoard.draw(canvas.getContext('2d'));
	opponentBoard.draw(canvas.getContext('2d'));

	//canvas.addEventListener('mousedown', doMouseDown)
});

/*function doMouseDown (event) {
}*/
