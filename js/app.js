//---------------------------------------------------------Enemy
var Enemy = function(x, y, index, sprite) {
    this.x = x;
    this.y = y;
    this.speed = random(200, 400);
    // this.speed = speed;
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


  //check for collision
  checkCollisions.call(this);
};




// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//--------------------------------------------------------- Player

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// add checkCollisions functionality-reset game when bug and char collide (in engine file commented out)
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
  // this.prevX = 0;
}

Player.prototype.update = function(dt) {
  //prevent player from moving off board
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



// Player.prototype.nextLevel = function() {
//   this.level++;
//   this.score += 100;
//   updateScoreboard();
//
//   if (this.level > 3) {
//     startEnemies(4);
//     createRocks(random(4, 7));
//     createItems(1);
//   } else {
//     startEnemies(3);
//     createRocks(random(2, 3));
//     createItems(1);
//   }
// }

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




Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyPress) {
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

//---------------------------------------------------------rock
var Rock = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/rock.png';
}


Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};



// check for collision with rock. if true, revert player to previous position
Rock.prototype.update = function() {
  checkCollisions.call(this);
}


var allRocks = [];

//---------------------------------------------------------Item
var Item = function(x, y, sprite) {
  this.x = x;
  this.y = y;
  this.sprite = sprite;
  // this.color = ['Green', 'Orange', 'Blue'];
}

Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Item.prototype.update = function() {
  checkCollisions.call(this);
}

var allItems = [];

function createItems(num) {
  var posX = [0, 100, 200, 300, 400];
  var posY = [50, 135, 220];
  var colors = ['Gem Green', 'Gem Orange', 'Gem Blue', 'heart', 'star'];
  var sprite = 'images/' + colors[Math.floor(Math.random() * colors.length)] + '.png';
  // add new row for > level 2
  if (player.level > 3) {
    posY.push(305);
  }

  var x = posX[Math.floor(Math.random() * posX.length)];
  var y = posY[Math.floor(Math.random() * posY.length)];
  console.log(`original x = ${x}, y = ${y}`);


  // // if cell already has a rock, generate new random location
  for (var i = 0; i < allRocks.length; i++) {
    if ((allRocks[i].x === x) && (allRocks[i].y === y)) {
      x = posX[Math.floor(Math.random() * posX.length)];
      y = posY[Math.floor(Math.random() * posY.length)];
      i = -1;
      console.log(`new x = ${x}, y = ${y}`);
    }
  }
  allItems.push(new Item(x, y, sprite));
}





// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];


function startEnemies(num) {
  var sprite, index;
  for (var i = 0; i < num; i++) {
    var x = 600;
    var y = 55 + (85 * i);
    // var speed = 110;
    index = i;
    if (i % 2 === 0) {
      sprite = 'images/enemy-bug.png';
    } else {
      sprite = 'images/enemy-bug-reverse.png';
    }
    allEnemies.push(new Enemy(x, y, index, sprite));
  }
};

// var createRocks = function(num) {
//   var posX = [0, 100, 200, 300, 400];
//   var posY = [50, 135, 220];
//   // add new row for levels 3+
//   if (player.level > 3) {
//     posY.push(305);
//   }
//   for (var i = 0; i < num; i++) {
//     var x = posX[Math.floor(Math.random() * posX.length)];
//     var y = posY[Math.floor(Math.random() * posY.length)];
//     allRocks.push(new Rock(x, y));
//   }
// }

//grid
// [0,-35] [100,-35] [200,-35] [300,-35] [400,-35] //water
// [0,50]  [100,50]  [200,50]  [300,50]  [400,50]
// [0,135] [100,135] [200,135] [300,135] [400,135]
// [0,220] [100,220] [200,220] [300,220] [400,220]
// [0,305] [100,305] [200,305] [300,305] [400,305]


var levels = [
  [[100,135], [300,135]], //1
  [[0,220], [200,135], [400,50]], //2
  [[0,135], [200,135], [400,135]], //3
  [[0,-35], [200,-35], [400,-35], [200,135], [100,220], [300,220]], //4
  // [[100,50], [300,50], [0,220], [200,220], [400,220]], //5
  [[0,50], [100,135], [200,50], [200,305], [300,220], [400,305]], //6
  [[100,-35], [200,-35], [300,-35], [0,220], [100,135], [300,135], [400,220]], //7
  // [[0,50], [100,220], [200,135], [300,220], [400,50]], //8
  [[0,305], [100,305], [200,305], [200,135], [300,135], [400,135]], //9
  [[0,220], [100,50], [200,135], [200,305], [300,50], [400,220]], //10
  [[0,-35], [200,-35], [400,-35], [100,135], [300,135], [200,305]], //11
  [[200,-35], [0,220], [100,135], [300,135], [400,220], [200,305]], //12
  [[0,135], [100,-35], [100,305], [200,135], [300,-35], [300,305], [400,135]], //13
  [[0,220], [100,305], [300,305], [400,220], [100,50], [200,-35], [300,50]], //14
  [[0,220], [100,135], [200,50], [300,-35], [200,305], [300,220], [400,135]], //15
  [[0,-35], [100,-35], [200,-35], [300,-35], [300,50], [100,220], [100,305], [200,305], [300,305], [400,305]], //16
  [[0,-35], [100,-35], [200,-35], [300,-35], [100,135], [200,135], [300,135], [400,135], [0,305], [100,305], [200,305], [300,305]] //17
];

function createRocks() {
  var currentLevel = player.level - 1;
    for (var i = 0; i < levels[currentLevel].length; i++) {
      var x = levels[currentLevel][i][0];
      var y = levels[currentLevel][i][1];
      console.log(`x is ${x} y is ${y}`);
      allRocks.push(new Rock(x, y));
    }
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++





Player.prototype.playerDied = function() {
  // 1. reset position
  this.x = 202;
  this.y = 380;
  this.hurt = true;
  //change sprite to 'hurt' image
  var playerName = player.sprite.slice(12, this.sprite.length - 4);
  this.sprite = 'images/char-' + playerName + '-hurt.png';
  setTimeout(function() {
    player.sprite = 'images/char-' + playerName + '.png';
    player.hurt = false;
  }, 1000);


  // 2. decrease score
  // if (this.score > 0) {
  //   this.score -= 50;
  // } else {
  //   this.score = 0;
  // }
  // 3. remove health
  this.lives--;
  updateScoreboard();
  // 4. if no lives, display game over modal
  if (this.lives < 1) {
    console.log(`you're toast, bro`);
    document.getElementById('gameOverModal').classList.toggle('hidden');
    document.getElementById('modal-score').innerHTML = this.score;
    document.getElementById('modal-level').innerHTML = this.level;
  }
}






// ++++++++++++++++++++++++++++++++++++++++++++++++++

// check for collisions
function checkCollisions() {
  if ((this.x > player.x - 70 && this.x < player.x + 70) &&
      (this.y > player.y - 70 && this.y < player.y + 70)) {
        // 1. when colliding with rock, reset player to previous position
        if (this instanceof Rock) {
          player.x = player.prevX;
          player.y = player.prevY;
        }
        if (this instanceof Enemy) {
            player.playerDied();
        }
        if (this instanceof Item) {
          allItems.pop();
          if (this.sprite === 'images/Gem Blue.png' || this.sprite === 'images/Gem Green.png' || this.sprite === 'images/Gem Orange.png') {
            player.score += 50;
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


// helper function for random values
function random(min, max) {
  return Math.random() * (max - min) + min;
}

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
  // 3. fade out modal.
  // startModal.classList.add('fade-out');
  startModal.classList.add('fade-out');

  // 4. swap out 'fade-out' for 'hidden' to set up next animation.
  setTimeout(function() {
    startModal.classList.add('hidden');
    startModal.classList.remove('fade-out');

  }, 1000);
});


// document.getElementById('play-again').addEventListener('click', function() {
//   document.getElementById('gameOverModal').classList.add('hidden');
//   document.getElementById('avatarModal').classList.remove('hidden');
// });

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('play-again')) {
    document.getElementById('gameOverModal').classList.add('hidden');
    document.getElementById('winnerModal').classList.add('hidden');
    document.getElementById('avatarModal').classList.remove('hidden');
  }
})

var player = new Player(202, 380);

function newGame() {
  // reset scoreboard
  player.level = 1;
  player.score = 0;
  player.lives = 3;
  updateScoreboard();

  //reset level, score, lives
  clearScreen();

  startEnemies(3);
  // createRocks(random(2, 3));
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
