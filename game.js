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
  constructor(x = 305, y = 595) {
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

  turn(direction) {
    if(direction == 'right') {
      this.turnRight();
    } else if(direction == 'left') {
      this.turnLeft();
    };
  }

  turnRight() {
    this.speed += 0.5;
    console.log('turnright');
  }

  turnLeft() {
    this.speed -= 0.5;
    console.log('turnleft');
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
    this.height = 640;
    this.width = 640;
    this.score = 0;
    this.player = new Player();
  }

  start() {
    createCanvas(this.width, this.height); 
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var directions = [ 'left', 'rigth'];
    var grammar = '#JSGF V1.0; grammar directions; public <color> = ' + directions.join(' | ') + ' ;'

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {

      var last = event.results.length - 1;
      var direction = event.results[last][0].transcript;

      console.log(direction.trim());
      direction.split(" ").forEach((word) => {
        this.player.turn(word.trim());
      })
    }
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

  _getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createBeat() {
    let beatColor = [this._getRandom(50, 255), this._getRandom(50, 255), this._getRandom(50, 255)]
    let beat = new Beat(beatColor, this._getRandom(10, this.width - 40));
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
