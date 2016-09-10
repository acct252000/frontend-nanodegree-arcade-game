/* app.js
 * This file creates the characters of the game and governs their movement and collision logic, as well as keeping score.
 */
//this section sets certain global variables needed throughout the game for easy update later.
//range of enemy spends
var maxEnemySpeed = 8;
var minEnemySpeed = 2;

//enemy picture
var enemySprite = 'images/enemy-bug.png';

//game cell height and width
var cellWidth = 101;
var cellHeight = 83;

//initial enemy coordinates
var initialEnemyX = -cellWidth;
//initial player coordinates
var initialPlayerX = cellWidth * 2;
//offset determined through trial and error
var initialPlayerVerticalOffset = 35;
var initialPlayerY = cellHeight * 5 - initialPlayerVerticalOffset;
// to keep track of player score
var playerScore = 0;



// define class for Character with commonalities of Player and Enemy
var Character = function(x, y, sprite) {

    this.x = x;
    this.y = y;
    this.sprite = sprite;

};
Character.prototype.render = function() {

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};




// Enemies our player must avoid subclass of Character
var Enemy = function() {
    Character.call(this, initialEnemyX, generateEnemyYCoordinate(), enemySprite);
    this.speed = generateEnemySpeed();
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;
//updates enemy each cycle and collision detects with player note that in demo bugs crawl over each other so no detection with other bugs.
Enemy.prototype.update = function(dt) {

    this.x += this.speed;
    if (this.x > 505) {
        this.reset();
    }

    if (player.x + 25 <= this.x + 82 && player.x + 102 >= this.x + 23 && player.y + 71 <= this.y + 113 && player.y + 112 >= this.y + 53) {

        player.reset();
        if (playerScore > 0) {
            playerScore = 0;
        }
    }



};
//resets enemy once off the screen
Enemy.prototype.reset = function() {
    this.x = initialEnemyX;
    this.y = generateEnemyYCoordinate();
    this.speed = generateEnemySpeed();

};

//define our Player class subclass of Character
var Player = function(sprite) {
    Character.call(this, initialPlayerX, initialPlayerY, sprite);
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;
//resets our Character to starting position
Player.prototype.reset = function() {
    this.x = initialPlayerX;
    this.y = initialPlayerY;


};
//checks to see if point is earned and resets Player
Player.prototype.update = function(dt) {
    if (this.y <= initialPlayerVerticalOffset) {
        playerScore += 1;
        this.reset();
    }

};
//handles up, down, left and right input from the keyboard
Player.prototype.handleInput = function(keyPressed) {

    //I am not sure about string comparison here but left per project matrix.
    switch (keyPressed) {
        case 'left':
            if (this.x <= 0) {
                break;
            } else {
                this.x -= cellWidth;
            }
            break;
        case 'right':
            if (this.x >= 4 * cellWidth) {
                break;
            } else {
                this.x += cellWidth;
            }
            break;
        case 'up':
            if (this.y <= initialPlayerVerticalOffset) {
                break;
            } else {
                this.y -= cellHeight;
            }
            break;
        case 'down':
            if (this.y >= initialPlayerY) {
                break;
            } else {
                this.y += cellHeight;
            }
            break;
        default:
            break;
    }



};

//create gems for our player to collect subclass of Character

var Gem = function(x, y, sprite, value) {
    Character.call(this, x, y, sprite);
    this.value = value;
};

Gem.prototype = Object.create(Character.prototype);
Gem.prototype.constructor = Gem;
Gem.prototype.update = function(dt) {
    if (player.x == this.x && player.y == this.y - 20) {

        playerScore += this.value;
        this.x = -101;

    }

};

//generates random row number for enemy limited to 2, 3, 4
function generateEnemyYCoordinate() {
    var row = Math.floor(Math.random() * (4 - 2 + 1)) + 2;
    var y = (row - 2) * 83 + 55;
    return y;

}

//generates random speed for enemy from minimum to maximum as defined in global variables
function generateEnemySpeed() {
    return Math.floor(Math.random() * (maxEnemySpeed - minEnemySpeed + 1)) + minEnemySpeed;
}

//renders score
function renderScore() {
    ctx.font = "28px Impact";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.fillText("Score:", 420, 80);
    ctx.strokeText("Score:", 420, 80);
    ctx.fillText(playerScore, 447, 112);
    ctx.strokeText(playerScore, 447, 112);
}

//select picture and value of treasure
function randomTreasure() {

    var treasure = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
    var sprite = 'images/Heart.png';
    var value = 10;
    switch (treasure) {

        case 1:
            sprite = 'images/gem-blue.png';
            value = 5;
            break;
        case 2:
            sprite = 'images/gem-green.png';
            value = 3;
            break;
        case 3:
            sprite = 'images/gem-orange.png';
            value = 1;
            break;
        case 4:
            sprite = 'images/heart.png';
            value = 10;
            break;
        case 5:
            sprite = 'images/key.png';
            value = 8;
            break;
        default:
            sprite = 'images/gem-orange.png';
            value = 1;
            break;
    }

    var selectedTreasure = {
        "sprite": sprite,
        "value": value
    };
    return selectedTreasure;
}

function generateGemParameters() {

    //generate all possible coordinates for gems
    var possibleCoordinates = [];

    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 5; col++) {
            var coordinate = {
                "x": col * 101,
                "y": (row + 1) * 83 - 15
            };
            possibleCoordinates.push(coordinate);
        }
    }

    //select at five at random and ensure no duplicates



    var firstPick = selectRandomIn(0, possibleCoordinates.length);
    var secondPick = selectRandomIn(0, possibleCoordinates.length);
    while (secondPick == firstPick) {
        secondPick = selectRandomIn(0, possibleCoordinates.length);
    }
    var thirdPick = selectRandomIn(0, possibleCoordinates.length);
    while (thirdPick == firstPick || thirdPick == secondPick) {
        thirdPick = selectRandomIn(0, possibleCoordinates.length);
    }
    var fourthPick = selectRandomIn(0, possibleCoordinates.length);
    while (fourthPick == firstPick || fourthPick == secondPick || fourthPick == thirdPick) {
        fourthPick = selectRandomIn(0, possibleCoordinates.length);
    }
    var fifthPick = selectRandomIn(0, possibleCoordinates.length);
    while (fifthPick == firstPick || fifthPick == secondPick || fifthPick == thirdPick || fifthPick == fourthPick) {
        fifthPick = selectRandomIn(0, possibleCoordinates.length);
    }

    var selectedTreasures = [];

    // geneate five random treasures
    for (var i = 0; i < 5; i++) {

        selectedTreasures[i] = randomTreasure();
    }

    //create array of objects with all parameters for Gem
    var gemParameters = [
        {
            "x": possibleCoordinates[firstPick].x,
            "y": possibleCoordinates[firstPick].y,
            "sprite": selectedTreasures[0].sprite,
            "value": selectedTreasures[0].value
},
        {
            "x": possibleCoordinates[secondPick].x,
            "y": possibleCoordinates[secondPick].y,
            "sprite": selectedTreasures[1].sprite,
            "value": selectedTreasures[1].value
},
        {
            "x": possibleCoordinates[thirdPick].x,
            "y": possibleCoordinates[thirdPick].y,
            "sprite": selectedTreasures[2].sprite,
            "value": selectedTreasures[2].value
},
        {
            "x": possibleCoordinates[fourthPick].x,
            "y": possibleCoordinates[fourthPick].y,
            "sprite": selectedTreasures[3].sprite,
            "value": selectedTreasures[3].value
},
        {
            "x": possibleCoordinates[fifthPick].x,
            "y": possibleCoordinates[fifthPick].y,
            "sprite": selectedTreasures[4].sprite,
            "value": selectedTreasures[4].value
}
];



    return gemParameters;

}

//select random number between max and min values
function selectRandomIn(max, min) {
    var randomPicked = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomPicked;
}

var player = new Player('images/char-boy.png');

var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

var allGems = [];

//create five Gems
var gemParameters = generateGemParameters();


for (var index = 0; index < gemParameters.length; index++) {
    var gem = new Gem(gemParameters[index].x, gemParameters[index].y, gemParameters[index].sprite, gemParameters[index].value);
    allGems.push(gem);

}




// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});