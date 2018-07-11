var allRocks = [];
var allItems = [];
var allEnemies = [];
var levels = [
  [[100,135], [300,135]], //level 1
  [[0,220], [200,135], [400,50]], //level 2
  [[0,135], [200,135], [400,135]], //level 3
  [[0,-35], [200,-35], [400,-35], [200,135], [100,220], [300,220]], //level 4
  [[0,50], [100,135], [200,50], [200,305], [300,220], [400,305]], //level 5
  [[100,-35], [200,-35], [300,-35], [0,220], [100,135], [300,135], [400,220]], //level 6
  [[0,305], [100,305], [200,305], [200,135], [300,135], [400,135]], //level 7
  [[0,220], [100,50], [200,135], [200,305], [300,50], [400,220]], //level 8
  [[0,-35], [200,-35], [400,-35], [100,135], [300,135], [200,305]], //level 9
  [[200,-35], [0,220], [100,135], [300,135], [400,220], [200,305]], //level 10
  [[0,135], [100,-35], [100,305], [200,135], [300,-35], [300,305], [400,135]], //level 11
  [[0,220], [100,305], [300,305], [400,220], [100,50], [200,-35], [300,50]], //level 12
  [[0,220], [100,135], [200,50], [300,-35], [200,305], [300,220], [400,135]], //level 13
  [[0,-35], [100,-35], [200,-35], [300,-35], [300,50], [100,220], [100,305], [200,305], [300,305], [400,305]], //level 14
  [[0,-35], [100,-35], [200,-35], [300,-35], [100,135], [200,135], [300,135], [400,135], [0,305], [100,305], [200,305], [300,305]] //level 15
];


/*-----------------------------/
 * Enemy
 *----------------------------*/

var Enemy = function(x, y, index, sprite) {
    this.x = x;
    this.y = y;
    this.speed = random(200, 400);
    this.sprite = sprite;
    this.index = index;
};

// Parameter: dt, a time delta between ticks - ensures game runs at same speed for all computers
Enemy.prototype.update = function(dt) {
    // 1. even numbered enemies travel from right to left
    if (this.index % 2) {
      this.x -= this.speed * dt;
      if (this.x < -100) {
        this.x = 600;
        this.speed = random(200, 400);
      }
    } else {
     // 2. odd numbered enemies travel left to right
    this.x += this.speed * dt;
      // 3. move enemy back to starting position
      if (this.x > 600) {
          this.x = -100;
          this.speed = random(200, 400);
      }
    }
  // 4. check for collision
  checkCollisions.call(this);
};

// Each render function will render that item on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*-----------------------------/
 * Player
 *----------------------------*/

var Player = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/char-boy.png';
  this.levelUp = false;
  this.level = 1;
  this.score = 0;
  this.lives = 3;
  this.speed = 500;
  this.hurt = false;
}

Player.prototype.update = function(dt) {
  // prevent player from moving off board
  if (this.x < 0) {
    this.x = 0;
  }
  if (this.x > 404) {
    this.x = 404;
  }
  if (this.y < -25) {
    this.y = -25;
  }
  if (this.y > 380) {
    this.y = 380;
  }

  //check to see if player reaches top of board
  // 1. for levels 1-14, set levelUp to true to animate player to bottom of screen
  if ((this.y < -15) && (this.level < 15)) {
    this.levelUp = true;
    // 2. for final level, toggle winner modal when player reaches the top of board
  } else if ((this.y < -15) && (this.level >= 15)) {
    document.getElementById('winnerModal').classList.remove('hidden');
    document.getElementById('winner-score').innerHTML = this.score;
    document.getElementById('winner-level').innerHTML = this.level;
    // 3. move player back to bottom so that 'hidden' class can be removed when user clicks 'play again'
    this.y = 380;
  }
  if (this.levelUp) {
    this.animate(dt);
  }
}

Player.prototype.animate = function(dt) {
  // 1. clear enemies from screen
  clearScreen();
  // 2. animate player back to starting position
  if (this.y < 380) {
    this.y += this.speed * dt;
  } else {
    // 3. start next level
    this.levelUp = false;
    nextLevel();
  }
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyPress) {
  // prevX and prevY store player's previous location. Player will revert back to this position when colliding with rock
  this.prevX = this.x;
  this.prevY = this.y;

  switch (keyPress) {
    case 'left':
      this.x -= 101;
      break;
    case 'right':
      this.x += 101;
      break;
    case 'up':
      this.y -= 80;
      break;
    case 'down':
      this.y += 80;
      break;
  }
}

Player.prototype.playerDied = function() {
  // 1. reset position
  this.x = 202;
  this.y = 380;
  this.hurt = true;
  // 2. temporarily change sprite to 'hurt' image
  var playerName = player.sprite.slice(12, this.sprite.length - 4);
  this.sprite = 'images/char-' + playerName + '-hurt.png';
  // 3. change sprite back to original image
  setTimeout(function() {
    player.sprite = 'images/char-' + playerName + '.png';
    player.hurt = false;
  }, 1000);
  // 3. remove health
  this.lives--;
  updateScoreboard();
  // 4. if no lives, display game over modal
  if (this.lives < 1) {
    document.getElementById('gameOverModal').classList.toggle('hidden');
    document.getElementById('modal-score').innerHTML = this.score;
    document.getElementById('modal-level').innerHTML = this.level;
  }
}

var player = new Player(202, 380);

/*-----------------------------/
 * Rock
 *----------------------------*/

var Rock = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/rock.png';
}

Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Rock.prototype.update = function() {
  checkCollisions.call(this);
}


/*-----------------------------/
 * Item
 *----------------------------*/

var Item = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
}

Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Item.prototype.update = function() {
  checkCollisions.call(this);
}


/*-----------------------------/
 * Instantiate objects
 *----------------------------*/

function createItems(num) {
  // 1. posX and posY include the x and y coordinates for each block of the road
  var posX = [0, 100, 200, 300, 400];
  var posY = [50, 135, 220];
  var colors = ['Gem Green', 'Gem Orange', 'Gem Blue', 'heart', 'star'];
  var sprite = 'images/' + colors[Math.floor(Math.random() * colors.length)] + '.png';
  // 2. add new row levels 4+
  if (player.level > 3) {
    posY.push(305);
  }
  // 3. generate random location for items
  var x = posX[Math.floor(Math.random() * posX.length)];
  var y = posY[Math.floor(Math.random() * posY.length)];
  // 4. if cell already has a rock, generate new random location
  for (var i = 0; i < allRocks.length; i++) {
    if ((allRocks[i].x === x) && (allRocks[i].y === y)) {
      x = posX[Math.floor(Math.random() * posX.length)];
      y = posY[Math.floor(Math.random() * posY.length)];
      i = -1;
    }
  }
  // 5. push item into array. Engine.js will then go through each item and call update method
  allItems.push(new Item(x, y, sprite));
}

function startEnemies(num) {
  var sprite, index;
  // 1. start enemies off screen. odd numbered enemies travel in reverse direction
  for (var i = 0; i < num; i++) {
    var x = 600;
    var y = 55 + (85 * i);
    index = i;
    if (i % 2 === 0) {
      sprite = 'images/enemy-bug.png';
    } else {
      sprite = 'images/enemy-bug-reverse.png';
    }
    allEnemies.push(new Enemy(x, y, index, sprite));
  }
};

function createRocks() {
  var currentLevel = player.level - 1;
  // loop through levels array, which contains coordinates for the rocks in each level
    for (var i = 0; i < levels[currentLevel].length; i++) {
      var x = levels[currentLevel][i][0];
      var y = levels[currentLevel][i][1];
      allRocks.push(new Rock(x, y));
    }
}


/*-----------------------------/
 * Helper functions
 *----------------------------*/

function nextLevel() {
  player.level++;
  player.score += 100;
  updateScoreboard();
  createRocks();
  createItems(1);
  if (player.level <= 3) {
    startEnemies(3);
  } else {
    startEnemies(4);
  }
}

function checkCollisions() {
  if ((this.x > player.x - 70 && this.x < player.x + 70) &&
      (this.y > player.y - 70 && this.y < player.y + 70)) {
        // 1. when colliding with rock, reset player to previous position
        if (this instanceof Rock) {
          player.x = player.prevX;
          player.y = player.prevY;
        }
        // 2. colliding with enemy sends player to bottom of screen or displays game over modal
        if (this instanceof Enemy) {
            player.playerDied();
        }
        // 3. colliding with an item removes that item from screen and increases score/lives
        if (this instanceof Item) {
          allItems.pop();
          if (this.sprite === 'images/Gem Blue.png' || this.sprite === 'images/Gem Green.png' || this.sprite === 'images/Gem Orange.png') {
            player.score += 50;
            // 4. colliding with a star removes all rocks from screen
          } else if (this.sprite === 'images/star.png') {
            player.score += 25;
            allRocks = [];
          } else if (this.sprite === 'images/heart.png') {
            player.lives++;
          }
          updateScoreboard();
        }
  }
}

function updateScoreboard() {
  document.getElementById('level').innerHTML = player.level;
  document.getElementById('score').innerHTML = player.score;
  document.getElementById('lives').innerHTML = player.lives;
}

// generate random number
function random(min, max) {
  return Math.random() * (max - min) + min;
}


/*-----------------------------/
 * Events
 *----------------------------*/

//avatar selection/begin game
document.querySelector('.avatar-container').addEventListener('click', function(e) {
  var thisCharacter = e.target.classList;
  var startModal = document.getElementById('avatarModal');
  // 1. set avatar
  if (thisCharacter.contains('avatar')) {
    player.sprite = 'images/char-' + thisCharacter[1] + '.png';
  }
  // 2. set up new game
  newGame();
  // 3. fade out modal
  startModal.classList.add('fade-out');
  // 4. swap out 'fade-out' for 'hidden' to set up next animation.
  setTimeout(function() {
    startModal.classList.add('hidden');
    startModal.classList.remove('fade-out');
  }, 1000);
});

// check if modal buttons clicked
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('play-again')) {
    document.getElementById('gameOverModal').classList.add('hidden');
    document.getElementById('winnerModal').classList.add('hidden');
    document.getElementById('avatarModal').classList.remove('hidden');
  }
});

function newGame() {
  // 1. reset scoreboard
  player.level = 1;
  player.score = 0;
  player.lives = 3;
  updateScoreboard();
  clearScreen();
  startEnemies(3);
  createRocks();
  createItems(1);
}

function clearScreen() {
  allEnemies = [];
  allRocks = [];
  allItems = [];
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
  if (!player.hurt) {
    player.handleInput(allowedKeys[e.keyCode]);
  }
});
