class Beat {
  constructor(color, x, y = -20) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.color = color;
  }

  draw() {
    fill(...this.color) ;
    rect(this.x, this.y, this.size, this.size);
  }

  advance(speed) {
    this.y += speed;
  }
}

class Player {
  constructor(x = 305, y = 415) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.color = [255, 255, 255];
    this.speed = 0;
    this.lives = 5;
  }

  draw() {
    fill(...this.color) ;
    rect(this.x, this.y, this.size, this.size);
  }

  move() {
    this.x += this.speed;
  }

  turnRight() {
    this.speed = Math.abs(this.speed)
  }

  turnLeft() {
    this.speed = Math.abs(this.speed) * -1
  }

  hit() {
    this.lives--;
  }
}

class Game {
  constructor() {
    this.beats = [];
    this.speed = 1.5;
    this.prob = 0.01;
    this.height = 460;
    this.width = 640;
    this.score = 0;
    this.player = new Player();
  }

  start() {
    createCanvas(this.width, this.height);
  }

  render() {
    background(0, 0, 0);
    this.beats.forEach((beat) => {
      beat.draw();
    })
    this.player.draw();
    fill(255);
    text(`Score: ${this.score}`, this.width - 75, 15);
    text(`Lives: ${this.player.lives}`, this.width - 75, 30);
  }

  update() {
    this.moveBeats();
    this.player.move();
    this.checkHits();
    this.checkDodged();
    if(this.isHappeningRandomEvent(this.prob)) {
      this.createBeat();
    }
    if(this.isHappeningRandomEvent(0.005)) {
      this.levelUp();
    }
  }

  moveBeats() {
    this.beats.forEach((beat) => {
      beat.advance(this.speed);
    })
  }

  checkHits() {
    this.beats.forEach((beat) => {
      if(beat.x + beat.size > this.player.x && beat.x < this.player.x + this.player.size && beat.y + beat.size > this.player.y && beat.y + beat.size < this.player.y + this.player.size) {
        this.beats.splice(this.beats.indexOf(beat), 1);
        this.player.hit();
      }
    })
  }

  isHappeningRandomEvent(prob) {
    if(Math.random() < prob) {
      return true;
    }
    return false;
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createBeat() {
    let beatColor = [this.getRandom(50, 255), this.getRandom(50, 255), this.getRandom(50, 255)]
    let beat = new Beat(beatColor, this.getRandom(10, this.width - 40));
    this.beats.push(beat);
  }

  levelUp() {
    this.speed += 0.1;
    this.prob += 0.001;
  }

  checkDodged() {
    this.beats.forEach((beat) => {
      if(beat.y > this.height) {
        this.beats.splice(this.beats.indexOf(beat), 1);
        this.score++;
      }
    })
  }

  isGameOver() {
    if(this.player.lives > 0) {
      return false;
    }
    return true;
  }

  youLose() {
    background(0, 0, 0);
    text(`Your final score is ${this.score}. Try again!`, this.width / 2 - 100, this.height / 2 - 5) 
  }
}

let game = new Game();

function setup() {
  game.start();
}

function draw() {
  if(game.isGameOver()) {
    game.youLose();
  } else {
    game.render();
    game.update();
  }
}
