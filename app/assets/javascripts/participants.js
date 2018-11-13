// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

let canvas;

let currentBoard;
let opponentBoard;

let gameFinished = false;

class Square {
    constructor (value, drawLength, drawOffsetX, drawOffsetY) {
        this.value = value;
        this.drawLength = drawLength;
        this.drawOffsetX = drawOffsetX;
        this.drawOffsetY = drawOffsetY;
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

    getColor(){
        let colorValue = this.value == 0 ? tinycolor("white") : tinycolor("orange").lighten().lighten().lighten().lighten();
        let boundary = Math.log2(this.value)
        for(let i = 0; i < boundary; i++){
            colorValue = colorValue.darken();
        }
        return colorValue;
    }

    draw(context){
        if(!this.isEmpty()){
            context.clearRect(this.drawOffestX, this.drawOffsetY, this.drawLength, this.drawLength);
    
            context.beginPath();
            context.rect(this.drawOffsetX, this.drawOffsetY, this.drawLength, this.drawLength);
            context.fillStyle = this.getColor();
            context.fill();
            context.stroke();
    
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.font = '20px Arial';
            context.fillStyle = this.getColor().isDark() ? 'white' : 'black';
            context.fillText(this.isEmpty() ? "" : this.value, this.drawOffsetX + (this.drawLength / 2), this.drawOffsetY + (this.drawLength / 2), this.drawLength);
        }
    }
}

class Board {
    constructor (drawLength, drawOffsetX, drawOffsetY) {
        this.drawLength = drawLength;
        this.drawOffsetX = drawOffsetX;
        this.drawOffsetY = drawOffsetY;
        this.nbSquares = 4;
        this.grid = [];
        for (let y = 0; y < this.nbSquares; y++) {
            let column = [];
            for (let x = 0; x < this.nbSquares; x++) {
                let sLength = this.drawLength / this.nbSquares;
                let startX = x * sLength + this.drawOffsetX;
                let startY = y * sLength + this.drawOffsetY;
                column[x] = new Square(0, sLength - 16, startX + 8, startY + 8);
            }
            this.grid[y] = column;
        }
    }

    getScore(){
        let total = 0;
        for(let y = 0; y < this.nbSquares; y++){
            for(let x = 0; x < this.nbSquares; x++){
                total += this.grid[y][x].value;
            }
        }
        return total;
    }

    getHighestSquareValue(){
        let highest = 0;
        for(let y = 0; y < this.nbSquares; y++){
            for(let x = 0; x < this.nbSquares; x++){
                if(this.grid[y][x].value > highest){
                    highest = this.grid[y][x].value;
                }
            }
        }
        return highest;
    }

    getNbEmptySquares(){
        let nbTotalSquares = this.nbSquares * this.nbSquares;
        for(let y = 0; y<this.nbSquares; y++){
            for(let x = 0; x<this.nbSquares; x++){
                if(!this.grid[y][x].isEmpty()){
                    nbTotalSquares--;
                }
            }
        }
        return nbTotalSquares;
    }

    moveSquares (move, dir) {

        let nbSquaresMoved = 0;

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
                    line = verticalLine.slice().reverse();
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
                    if(targetSquare != undefined && currentSquare != targetSquare){
                        currentSquare.moveTo(targetSquare);
                        nbSquaresMoved++;
                    }
                }
            }
        }
        return nbSquaresMoved;
    }

    spawnSquares(nbNewSquares = 1){
        let indexes = [];
        for(let i=0; i<this.nbSquares * this.nbSquares; i++){
            indexes.push(i);
        }
        for (var i = indexes.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = indexes[i];
            indexes[i] = indexes[j];
            indexes[j] = temp;
        }

        for(let i=0; i<this.nbSquares * this.nbSquares && nbNewSquares > 0; i++){
            let index = indexes.pop(i);
            let square = this.grid[Math.floor(index / this.nbSquares)][index % this.nbSquares];
            if(square.isEmpty()){
                //square.value = Math.pow(2, Math.round(Math.random() + 1));
                let valueChance = Math.random();
                square.value = valueChance < 0.75 ? 2 : 4;
                nbNewSquares--;
            }
        }
    }

    isInside(x, y){
        return  x > this.drawOffsetX && x < this.drawOffsetX + this.drawLength &&
                y > this.drawOffsetY && y < this.drawOffsetY + this.drawLength;
    }

    indexOf(x, y){
        if(this.isInside(x, y)){
            return { indexX : Math.floor((x - this.drawOffsetX) / (this.drawLength / this.nbSquares)), indexY : Math.floor((y - this.drawOffsetY) / (this.drawLength / this.nbSquares))};
        }
        return null;
    }

    draw (context) {

        context.clearRect(this.drawOffsetX, this.drawOffsetY - 50, this.drawLength, this.drawLength + 50);

        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.font = '20px Arial';
        context.fillStyle = 'black';
        context.fillText("Score : " + this.getScore(), this.drawOffsetX + (this.drawLength / 2), this.drawOffsetY - 50, this.drawLength);

        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                let sLength = this.drawLength / this.nbSquares;
                let startX = x * sLength + this.drawOffsetX;
                let startY = y * sLength + this.drawOffsetY;

                context.beginPath();
                context.rect(startX, startY, sLength, sLength);
                context.stroke();

                this.grid[y][x].draw(context);
            }
        }
    }
}

$(document).ready(function () {
    canvas = document.getElementById('game_canvas');
    context = canvas.getContext('2d');

    currentBoard = new Board(canvas.offsetWidth / 3, canvas.offsetWidth / 15, canvas.offsetHeight / 15 * 14 - (canvas.offsetWidth / 3));
    opponentBoard = new Board(canvas.offsetWidth / 3, canvas.offsetWidth / 15 * 14 - (canvas.offsetWidth / 3), canvas.offsetHeight / 15 * 14 - (canvas.offsetWidth / 3));

    currentBoard.spawnSquares(2);

    currentBoard.draw(context);
    opponentBoard.draw(context);

    canvas.addEventListener('mousedown', function (event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        console.log("currentBoard : " + currentBoard.indexOf(x,y));
        console.log("opponentBoard : " + opponentBoard.indexOf(x,y));
    });
});

$(document).keypress(function (evt) {
    if(gameFinished == false) {
        let move = 0;
        let dir = "";
        let wasMoveKey = false;
        switch(evt.key){
            case "s" :
                move = 1;
                dir = "vertical";
                wasMoveKey = true;
            break;
            case "w" :
                move = -1;
                dir = "vertical";
                wasMoveKey = true;
            break;
            case "d" :
                move = 1;
                dir = "horizontal";
                wasMoveKey = true;
            break;
            case "a" :
                move = -1;
                dir = "horizontal";
                wasMoveKey = true;
            break;
        }
        
        if(wasMoveKey) {
            if(currentBoard.moveSquares(move, dir) > 0){
                currentBoard.spawnSquares();
                currentBoard.draw(context);
                
                if(currentBoard.getHighestSquareValue() == 2048){
                    gameFinished = true;
                }
            } else {
                if(currentBoard.getNbEmptySquares() == 0){
                    gameFinished = true;
                }
            }

            if(gameFinished == true){
                alert("Game finished, winner is " + (currentBoard.getScore() > opponentBoard.getScore() ? "you" : "opponent") + "!");
            }
        }
    } 
});

