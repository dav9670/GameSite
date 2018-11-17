// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

let frameRate = 60;

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

    moveBy(moveX, moveY){
        this.drawOffsetX += moveX;
        this.drawOffsetY += moveY;
    }

    moveTo(targetX, targetY){
        this.drawOffsetX = targetX;
        this.drawOffsetY = targetY;
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
        this.turnsPlayed = 0;
        this.gameFinished = false;
        this.movingSquares = [];
        this.nbAnimationSteps = 10;
        this.animationDate = new Date().getTime();
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
        } else {
            this.grid[indexY][indexX] = square;
        }

        let targetX = indexX * (this.drawLength / this.nbSquares) + this.drawOffsetX + 8;
        let targetY = indexY * (this.drawLength / this.nbSquares) + this.drawOffsetY + 8;

        let moveX = (targetX - square.drawOffsetX) / this.nbAnimationSteps;
        let moveY = (targetY - square.drawOffsetY) / this.nbAnimationSteps;

        let totalAnimationTime = 1000 / frameRate * this.nbAnimationSteps;
        let currentTime = new Date().getTime();
        if(this.animationDate < currentTime + totalAnimationTime){
            this.animationDate = currentTime + totalAnimationTime;
        }

        this.movingSquares.push({
            square: square,
            moveX: moveX,
            moveY: moveY,
            targetX: targetX,
            targetY: targetY
        });
    }

    /**
     * Move all the grid in the direction provided
     * @param {Number} move Left and Up = -1, Right and Down = 1 
     * @param {String} dir "h" (horizontal) or "v" (vertical)
     */
    moveSquares (move, dir) {
        let nbSquaresMoved = 0;

        let squareAdder = move == -1 ? 1 : -1;
        let squareStart = move == -1 ? 0 : this.nbSquares - 1;
        let squareEnd = move == -1 ? this.nbSquares : -1;

        let restAdder = move;
        let restEnd = move == -1 ? -1: this.nbSquares;
        
        
        for(let lineIndex=0; lineIndex<this.nbSquares; lineIndex++){
            for(let squareIndex=squareStart; squareIndex!=squareEnd; squareIndex += squareAdder){
                //if horizontal, loop through second array by keepin same first index
                //else if vertical, loop through first array by keeping same second index
                let firstIndex = (dir == "h" ? lineIndex : squareIndex);
                let secondIndex = (dir == "h" ? squareIndex : lineIndex);
                let currentSquare = this.grid[firstIndex][secondIndex];
                if(currentSquare){
                    //From currentSquare, scan to the end of the line until hits another non-empty square
                    let restIndex;
                    for(restIndex = squareIndex + restAdder; restIndex!=restEnd; restIndex+=restAdder){
                        let firstIndex = (dir == "h" ? lineIndex : restIndex);
                        let secondIndex = (dir == "h" ? restIndex : lineIndex);
                        let restSquare = this.grid[firstIndex][secondIndex];

                        //Loops until a non-empty square is hit, if same values, combine, else take square before
                        if(restSquare){
                            if(currentSquare.value != restSquare.value){
                                restIndex -= restAdder;
                            }
                            break;
                        }
                    }

                    //Need to move square out of loop in case that no other square in line, need to move to boundary
                    if(restIndex != undefined){
                        if(restIndex == restEnd){
                            restIndex -= restAdder;
                        }

                        let firstIndex = (dir == "h" ? lineIndex : restIndex);
                        let secondIndex = (dir == "h" ? restIndex : lineIndex);

                        if(this.grid[firstIndex][secondIndex] != currentSquare){
                            this.moveSquareTo(currentSquare, firstIndex, secondIndex);
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

    playTurn(move, dir, funcAfterTurn){
        if(this.gameFinished == false && this.movingSquares.length == 0 && new Date().getTime() > currentBoard.animationDate + 50 && this.moveSquares(move, dir) > 0){
            this.moveSquareDraw(context);
            let self = this;
            setTimeout(function(){
                self.spawnSquares();
                
                if(self.getHighestSquareValue() >= 2048 || !self.hasMovableSquare()){
                    self.gameFinished = true;
                }

                self.draw(canvas.getContext("2d"), self == currentBoard ? "green" : "red");

                funcAfterTurn();

            }, this.animationDate - new Date().getTime());
            this.turnsPlayed++;

            return true;
        }
        return false;
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

    moveSquareDraw(context){
        for(let i=0; i<this.movingSquares.length; i++){
            let squareInfos = this.movingSquares[i];
            let square = squareInfos.square;
            let moveX = squareInfos.moveX;
            let moveY = squareInfos.moveY;
            let targetX = squareInfos.targetX;
            let targetY = squareInfos.targetY;

            square.moveBy(moveX, moveY);
            if(square.drawOffsetX.inRangeOf(targetX, moveX) && square.drawOffsetY.inRangeOf(targetY, moveY)){
                square.moveTo(targetX, targetY);
                this.movingSquares.remove(squareInfos);
            }
        }

        this.draw(context, this == currentBoard ? "green" : "red");

        let self = this;

        if(this.movingSquares.length > 0){
            setTimeout(function(){self.moveSquareDraw(context);}, 1000 / frameRate);
        }
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

        for(let i=0; i<this.movingSquares.length; i++){
            let square = this.movingSquares[i].square;
            square.draw(context);
        }

        if(outlineColor){
            context.beginPath();
            context.strokeStyle = this.gameFinished ? "black" : outlineColor;
            context.lineWidth = 5;
            context.rect(this.drawOffsetX - 1, this.drawOffsetY - 1, this.drawLength + 1, this.drawLength + 1);
            context.stroke();

            context.lineWidth = 1;
            context.strokeStyle = "black";
        }
    }
}

let canvas;

let currentBoard;
let hostBoard;
let opponentBoard;

let turn = 0;
let turnPerPlayer = 10;

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
    let move = 0;
    let dir = "";
    let wasMoveKey = false;
    switch(evt.key){
        case "s" :
            move = 1;
            dir = "v";
            wasMoveKey = true;
        break;
        case "w" :
            move = -1;
            dir = "v";
            wasMoveKey = true;
        break;
        case "d" :
            move = 1;
            dir = "h";
            wasMoveKey = true;
        break;
        case "a" :
            move = -1;
            dir = "h";
            wasMoveKey = true;
        break;
    }
    
    if(wasMoveKey) {
        currentBoard.playTurn(move, dir, function() {

            turn++;

            let turnsRemaining;
            
            if(hostBoard.gameFinished == true){
                turnsRemaining = hostBoard.turnsPlayed - opponentBoard.turnsPlayed;
                currentBoard = opponentBoard;
            } else if(opponentBoard.gameFinished == true){
                turnsRemaining = opponentBoard.turnsPlayed - hostBoard.turnsPlayed;
                currentBoard = hostBoard;
            } else {
                currentBoard = Math.floor(turn / turnPerPlayer) % 2 == 0 ? hostBoard : opponentBoard;
            }

            if(turnsRemaining != undefined){
                if(turnsRemaining > 0){
                    drawTurnsRemaining(turnsRemaining)
                } else {
                    currentBoard.gameFinished = true;
                    alert("Game finished, winner is " + (hostBoard.getScore() > opponentBoard.getScore() ? "host" : "opponent") + "!");
                }
            }
            
            drawAll();
        })
    }
});


function drawAll(){
    let context = canvas.getContext("2d");
    hostBoard.draw(context, hostBoard == currentBoard ? "green" : "red");
    opponentBoard.draw(context,  opponentBoard == currentBoard ? "green" : "red");
}

function drawTurnsRemaining(turnsRemaining){
    let context = canvas.getContext("2d");
    let text = "Turns remaining : " + turnsRemaining;

    let metrics = context.measureText(text);

    context.clearRect(canvas.offsetWidth / 2 - metrics.width / 2 + 10, canvas.offsetHeight / 4, canvas.offsetWidth / 2 + metrics.width / 2 + 10, canvas.offsetHeight / 4 + 30);

    context.textAlign = 'center';
    context.textBaseline = 'top';
    context.font = '20px Arial';
    context.fillStyle = 'black';
    context.fillText(text, canvas.offsetWidth / 2, canvas.offsetHeight / 4);

}