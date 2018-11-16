// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

let frameRate = 60;
let animationDate = new Date().getTime();

Number.prototype.inRangeOf = function(other,range){
    range = Math.abs(range);
    return this >= other - range && this <= other + range;
};

Array.prototype.remove = function(object){
    for(let i=0; i<this.length; i++){
        if(this[i] == object){
            this.splice(i,1);
        }
    }
}

class Square {
    constructor (value, drawLength, drawOffsetX, drawOffsetY) {
        //add showValue
        this.value = value;
        this.drawLength = drawLength;
        this.drawOffsetX = drawOffsetX;
        this.drawOffsetY = drawOffsetY;
    }

    absorb(targetSquare){
        this.value += targetSquare.value;
    }

    /**
     * 
     * @param {Board} board 
     * @param {Number} targetX 
     * @param {Number} targetY 
     * @param {Function} arrivedFunction A function that will be called when the square arrived at its destination, function takes in parameter the square
     */
    moveTo(targetX, targetY, arrivedFunction = undefined){
        let nbSteps = 10;
        let moveX = (targetX - this.drawOffsetX) / nbSteps;
        let moveY = (targetY - this.drawOffsetY) / nbSteps;

        let totalAnimationTime = 1000 / frameRate * nbSteps;
        let currentTime = new Date().getTime()
        if(animationDate < currentTime + totalAnimationTime){
            animationDate = currentTime + totalAnimationTime;
        }

        this.moveToDraw(targetX, targetY, moveX, moveY, arrivedFunction);
    }

    moveToDraw(targetX, targetY, moveX, moveY, arrivedFunction){
        this.drawOffsetX += moveX;
        this.drawOffsetY += moveY;

        let self = this;

        if(this.drawOffsetX.inRangeOf(targetX, moveX) && this.drawOffsetY.inRangeOf(targetY, moveY)){
            this.drawOffsetX = targetX;
            this.drawOffsetY = targetY;
            if(arrivedFunction){
                arrivedFunction(this);
            }
        } else {
            let animationTime = 1000 / frameRate;
            setTimeout(function() {self.moveToDraw(targetX, targetY, moveX, moveY, arrivedFunction);}, animationTime);
        }
            
        drawAll();
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
        context.clearRect(this.drawOffsetX, this.drawOffsetY, this.drawLength, this.drawLength);

        context.beginPath();
        context.rect(this.drawOffsetX, this.drawOffsetY, this.drawLength, this.drawLength);
        context.fillStyle = this.getColor();
        context.fill();
        context.stroke();

        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.font = '20px Arial';
        context.fillStyle = this.getColor().isDark() ? 'white' : 'black';
        context.fillText(this.value, this.drawOffsetX + (this.drawLength / 2), this.drawOffsetY + (this.drawLength / 2), this.drawLength);
    }
}

class Board {
    constructor (drawLength, drawOffsetX, drawOffsetY) {
        this.drawLength = drawLength;
        this.drawOffsetX = drawOffsetX;
        this.drawOffsetY = drawOffsetY;
        this.nbSquares = 4;
        this.grid = [];
        this.grid.length = this.nbSquares;
        for (let y = 0; y < this.nbSquares; y++) {
            let column = [];
            for(let x = 0; x<this.nbSquares; x++){
                column[x] = null;
            }
            this.grid[y] = column;
        }
    }

    getScore(){
        let total = 0;
        for(let y = 0; y < this.nbSquares; y++){
            for(let x = 0; x < this.nbSquares; x++){
                let square = this.grid[y][x];
                if(square){
                    total += square.value;
                }
            }
        }
        return total;
    }

    getHighestSquareValue(){
        let highest = 0;
        for(let y = 0; y < this.nbSquares; y++){
            for(let x = 0; x < this.nbSquares; x++){
                let square = this.grid[y][x];
                if(square){
                    if(square.value > highest){
                        highest = square.value;
                    }
                }
            }
        }
        return highest;
    }

    getNbEmptySquares(){
        let nbSquareEmpty = 0;
        for(let y = 0; y<this.nbSquares; y++){
            for(let x = 0; x<this.nbSquares; x++){
                if(!this.grid[y][x]){
                    nbSquareEmpty++;
                }
            }
        }
        return nbSquareEmpty;
    }

    hasMovableSquare(){
        if(this.getNbEmptySquares() > 0)
            return true;

        for(let y=0; y<this.nbSquares; y++){
            for(let x=0; x<this.nbSquares; x++){
                let currentSquare = this.grid[y][x];
                
                for(let i=0; i<4; i++){
                    let offsetY = i%2 == 0 ? i/2 == 0 ? -1 : 1 : 0;
                    let offsetX = i%2 == 1 ? i/2 == 0 ? -1 : 1 : 0;
                    
                    let indexY = y + offsetY;
                    let indexX = x + offsetX;

                    if(indexY >= 0 && indexY < this.nbSquares && indexX >= 0 && indexX < this.nbSquares){
                        let targetSquare = this.grid[indexY][indexX];

                        if(targetSquare){
                            if(targetSquare.value == currentSquare.value){
                                return true;
                            }
                        }
                    }                    
                }
            }
        }

        return false;
    }

    moveSquareTo(square, indexY, indexX){

        for(let y=0; y<this.nbSquares; y++){
            let squareIndex = this.grid[y].indexOf(square);
            if(squareIndex != -1){
                this.grid[y][squareIndex] = null;
            }
        }

        if(this.grid[indexY][indexX]){
            this.grid[indexY][indexX].absorb(square);
            movingSquares.push(square);
        } else {
            this.grid[indexY][indexX] = square;
        }

        square.moveTo(indexX * (this.drawLength / this.nbSquares) + this.drawOffsetX + 8, indexY * (this.drawLength / this.nbSquares) + this.drawOffsetY + 8, function(square) {
            movingSquares.remove(square);
        });
    }

    moveSquares (move, dir) {
        let nbSquaresMoved = 0;

        for(let i = 0; i < this.nbSquares; i++){
            for(let x = 0; x<this.nbSquares; x++){


                let line = [];
                if(dir == "horizontal"){
                    if(move == 1){
                        line = this.grid[i].slice().reverse();
                    } else if(move == -1){
                        line = this.grid[i];
                    }
                } else if (dir == "vertical"){
                    let verticalLine = [];
                    for(let j = 0; j<this.nbSquares; j++){
                        verticalLine.push(this.grid[j][i]);
                    }

                    if(move == 1){
                        line = verticalLine.slice().reverse();
                    } else if(move == -1){
                        line = verticalLine;
                    }
                }

                let currentSquare = line[x];
                
                //From currentSquare, scan to the end of the line until hits another non-empty square
                if(currentSquare){
                    //Loops until hit boundary or targetSquare is not empty, if hit boundary, just move square to boundary
                    let rest;
                    for(rest = x - 1; rest >= 0; rest--){
                        if(line[rest]){
                            //if currentValue and neighborValue are the same, move square to neighbor, else move to the square before neighbor
                            if(line[rest].value != currentSquare.value){
                                rest++;
                            }
                            break;
                        }
                    }

                    if(rest != undefined){
                        
                        if(rest == -1)
                            rest = 0;

                        let indexY;
                        let indexX;

                        if(dir == "horizontal"){
                            indexY = i;
                            indexX = move == -1 ? rest : this.nbSquares - (rest + 1);
                        } else if(dir == "vertical"){
                            indexY = move == -1 ? rest : this.nbSquares - (rest + 1);
                            indexX = i;
                        }

                        //TODO Move to index y,x multiplied by square dims, instead of target position
                        //TODO Make a list of square moving to combine, make them null in the grid
                        if(this.grid[indexY][indexX] != currentSquare){
                            this.moveSquareTo(currentSquare, indexY, indexX);
                            nbSquaresMoved++;
                        }
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
            let y = Math.floor(index / this.nbSquares);
            let x = index % this.nbSquares;

            if(!this.grid[y][x]){
                
                let value = Math.random() < 0.75 ? 2 : 4;

                let sLength = this.drawLength / this.nbSquares;
                let startX = x * sLength + this.drawOffsetX;
                let startY = y * sLength + this.drawOffsetY;

                this.grid[y][x] = new Square(value, sLength - 16, startX + 8, startY + 8);

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

    draw (context, outlineColor) {

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

                let square = this.grid[y][x];
                if(square){
                    square.draw(context);
                }
            }
        }

        if(outlineColor){
            context.beginPath();
            context.strokeStyle = outlineColor;
            context.lineWidth = 5;
            context.rect(this.drawOffsetX - 1, this.drawOffsetY - 1, this.drawLength + 1, this.drawLength + 1);
            context.stroke();

            context.lineWidth = 1;
            context.strokeStyle = "black";
        }
    }
}

let canvas;
let context;

let currentBoard;
let hostBoard;
let opponentBoard;

let gameFinished = false;

let turn = 0;
let turnPerPlayer = 10;

let movingSquares = [];

$(document).ready(function () {
    canvas = document.getElementById('game_canvas');
    context = canvas.getContext('2d');

    hostBoard = new Board(canvas.offsetWidth / 3, canvas.offsetWidth / 15, canvas.offsetHeight / 15 * 14 - (canvas.offsetWidth / 3));
    opponentBoard = new Board(canvas.offsetWidth / 3, canvas.offsetWidth / 15 * 14 - (canvas.offsetWidth / 3), canvas.offsetHeight / 15 * 14 - (canvas.offsetWidth / 3));

    hostBoard.spawnSquares(2);
    opponentBoard.spawnSquares(2);

    currentBoard = hostBoard;

    drawAll();

    canvas.addEventListener('mousedown', function (event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        
        console.log("currentBoard : " + currentBoard.indexOf(x,y));
        console.log("opponentBoard : " + opponentBoard.indexOf(x,y));
    });
});

$(document).keypress(function (evt) {
    if(animationDate < new Date().getTime()){
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
                    setTimeout(function(){
                        currentBoard.spawnSquares(); 
                        turn++;
                        currentBoard = Math.floor(turn / turnPerPlayer) % 2 == 0 ? hostBoard : opponentBoard;
        
                        drawAll();
        
                        if(currentBoard.getHighestSquareValue() == 2048 || !currentBoard.hasMovableSquare()){
                            gameFinished = true;
                        }
                    }, animationDate - new Date().getTime());
                }
            }
        }
        
        if(gameFinished == true){
            alert("Game finished, winner is " + (hostBoard.getScore() > opponentBoard.getScore() ? "host" : "opponent") + "!");
        }
    }
});

function drawAll(){
    hostBoard.draw(context, hostBoard == currentBoard ? "green" : "red");
    opponentBoard.draw(context,  opponentBoard == currentBoard ? "green" : "red");

    for(let i=0; i<movingSquares.length; i++){
        movingSquares[i].draw(context);
    }
}