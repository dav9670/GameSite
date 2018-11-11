// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

class Square {
    constructor (value, color, x, y) {
        this.value = value;
        this.color = color;
        this.x = x;
        this.y = y;
    }
    
    isEmpty(){
        return this.value == 0;
    }

    moveTo(targetSquare){
        if(targetSquare != this){
            targetSquare.value += this.value;
            this.value = 0;
        }
    }
}

class Board {
    constructor (length, offestX, offsetY) {
        this.length = length;
        this.offestX = offestX;
        this.offsetY = offsetY;
        this.nbSquares = 4;
        this.grid = [];
        for (let y = 0; y < this.nbSquares; y++) {
            let column = [];
            for (let x = 0; x < this.nbSquares; x++) {
                column[x] = new Square(2, 'white', x, y);
            }
            this.grid[y] = column;
        }
    }

    moveSquares (move, dir) {
        for(let i = 0; i < this.nbSquares; i++){
            let line = [];
            if(dir == "horizontal"){
                if(move == 1){
                    line = this.grid[i].slice().reverse();
                } else if(move == -1){
                    line = this.grid[i];
                }
            } else if (dir == "vertical"){
                let verticalLine = [];
                for(let x = 0; x<this.nbSquares; x++){
                    verticalLine.push(this.grid[x][i]);
                }

                if(move == 1){
                    line = verticalLine.reverse();
                } else if(move == -1){
                    line = verticalLine;
                }
            }

            for(let x = 0; x<this.nbSquares; x++){
                let currentSquare = line[x];
                
                //From currentSquare, scan to the end of the line until hits another non-empty square
                if(!currentSquare.isEmpty()){
                    //Loops until hit boundary or targetSquare is not empty, if hit boundary, just move square to boundary
                    let targetSquare;
                    for(let rest = x - 1; rest >= 0; rest--){
                        targetSquare = line[rest];

                        if(!targetSquare.isEmpty()){
                            //if currentValue and neighborValue are the same, move square to neighbor, else move to the square before neighbor
                            if(targetSquare.value != currentSquare.value){
                                targetSquare = line[rest + 1];
                            }
                            break;
                        }
                    }

                    //Check for moving into itself is handled inside moveTo
                    //Undefined if border square, because no neighbor after it
                    if(targetSquare != undefined)
                        currentSquare.moveTo(targetSquare);
                }
            }
        }
    }

    draw (context) {
        context.clearRect(this.offestX, this.offsetY, this.length, this.length);
        for (let i = 0; i < this.grid.length; i++) {
            for (let x = 0; x < this.grid[i].length; x++) {
                let sLength = this.length / this.nbSquares;
                let startX = x * sLength + this.offestX;
                let startY = i * sLength + this.offsetY;

                context.beginPath();
                context.rect(startX, startY, sLength, sLength);
                context.fillStyle = this.grid[i][x].color;
                context.fill();
                context.stroke();

                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.font = '20px Arial';
                context.fillStyle = 'black';
                context.fillText(this.grid[i][x].isEmpty() ? "" : this.grid[i][x].value, startX + (sLength / 2), startY + (sLength / 2), sLength);
            }
        }
    }
}

let canvas;
let context;

let currentBoard;
let opponentBoard;

$(document).ready(function () {
    canvas = document.getElementById('game_canvas');
    context = canvas.getContext('2d');

    currentBoard = new Board(canvas.offsetWidth / 3, canvas.offsetWidth / 15, canvas.offsetHeight / 15 * 14 - (canvas.offsetWidth / 3));
    opponentBoard = new Board(canvas.offsetWidth / 3, canvas.offsetWidth / 15 * 14 - (canvas.offsetWidth / 3), canvas.offsetHeight / 15 * 14 - (canvas.offsetWidth / 3));

    currentBoard.draw(context);
    opponentBoard.draw(context);

    canvas.addEventListener('mousedown', function (event) {

    });
});

$(document).keypress(function (evt) {
    let move = 0;
    let dir = "";
    switch(evt.key){
        case "s" :
            move = 1;
            dir = "vertical";
        break;
        case "w" :
            move = -1;
            dir = "vertical";
        break;
        case "d" :
            move = 1;
            dir = "horizontal";
        break;
        case "a" :
            move = -1;
            dir = "horizontal";
        break;
    }
    
    currentBoard.moveSquares(move, dir);
    currentBoard.draw(context);
});

/* function doMouseDown (event) {
} */
