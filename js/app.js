//---------------------------------------------------------Enemy
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
  if (this.y < -15) {
    this.levelUp = true;
    this.score += 100;
    this.level++;
    updateScoreboard();
  }

  if (this.levelUp) {
    this.reset(dt);
  }
}

Player.prototype.reset = function(dt) {
  // 1. clear enemies from screen
  allEnemies = [];
  allRocks = [];
  allItems = [];
  // 2. animate player back to starting position
  if (this.y < 380) {
    this.y += 300 * dt;
  } else {
    // 3. start next level
    this.levelUp = false;
    this.nextLevel();
  }
}

Player.prototype.nextLevel = function() {
  if (this.level > 3) {
    startEnemies(4);
    createRocks(random(4, 7));
    createItems(1);
  } else {
    startEnemies(3);
    createRocks(random(2, 3));
    createItems(1);
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



//---------------------------------------------------------

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player(202, 380);

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


var createRocks = function(num) {
  var posX = [0, 100, 200, 300, 400];
  var posY = [50, 135, 220];
  // add new row for > level 2
  if (player.level > 3) {
    posY.push(305);
  }
  for (var i = 0; i < num; i++) {
    var x = posX[Math.floor(Math.random() * posX.length)];
    var y = posY[Math.floor(Math.random() * posY.length)];
    allRocks.push(new Rock(x, y));

    // ***********************
    // for (var rock of allRocks) {
    //   if ((x === rock.x) && (y === rock.y)) {
    //     console.log('overlap');
    //     i--;
    //   } else {
    //     allRocks.push(new Rock(x, y));
    //   }
    // }
    // ***********************
  }
}




// ++++++++++++++++++++++++++++++++++++++++++++++++++

var heart = '<img src = "images/heart.png">';

// let heartArray = [heart, heart, heart];
// let heartString = heartArray.join(''); // convert to string to get rid of commas
// let heartCounter = document.querySelector('scoreboard-hearts');
// heartCounter.innerHTML = heartString;

// update health each time dies? so you would only need one setlives function instead of restore health and playerDied?
// reset position
// lives -- ?? then couldn't use this to reset for new game. maybe put this in checkCollisions?
// create a previous lives and new lives > if new lives < previous lives decrease score
// set health based on life count
// check if dead

// heart counter (old)
Player.prototype.restoreHealth = function(lives) {
  // for (var i = 0; i < lives; i++) {
  //   document.querySelector('.scoreboard-hearts').innerHTML += heart;
  // }
}


Player.prototype.playerDied = function() {
  //change sprite to 'hurt' image
  var playerName = player.sprite.slice(12, this.sprite.length - 4);
  this.sprite = 'images/char-' + playerName + '-hurt.png';
  setTimeout(function() {
    player.sprite = 'images/char-' + playerName + '.png';
  }, 1000);

  // 1. reset position
  this.x = 202;
  this.y = 380;
  // 2. decrease score
  if (this.score > 0) {
    this.score -= 50;
  } else {
    this.score = 0;
  }
  // 3. remove health
  this.lives--;
  updateScoreboard();
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

//avatar selection
document.querySelector('.avatar-container').addEventListener('click', function(e) {
  var thisCharacter = e.target.classList;
  if (thisCharacter.contains('avatar')) {
    player.sprite = 'images/char-' + thisCharacter[1] + '.png';
  }
  document.getElementById('avatarModal').classList.toggle('hidden');
});

document.getElementById('play-again').addEventListener('click', function() {
  document.getElementById('gameOverModal').classList.toggle('hidden');
  document.getElementById('avatarModal').classList.toggle('hidden');
});


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
