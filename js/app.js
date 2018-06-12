//---------------------------------------------------------Enemy
// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // move enemy back to starting position when off canvas


    //check for collision
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
  if (this.y > 375) {
    this.y = 375;
  }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(keyPress) {
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

//---------------------------------------------------------

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player(202, 375, 50);

for (var i = 0; i < 3; i++) {
  var x = 0;
  var y = 55 + (85 * i);
  var speed = 0;
  allEnemies.push(new Enemy(x, y, speed));
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
