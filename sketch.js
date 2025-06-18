let car;
let obstacles = [];
let items = [];
let celebrationItems = [];
let gameOver = false;
let score = 0;
let finishY = 10000; // Distância total da corrida
let distance = 0;

function setup() {
  createCanvas(800, 600);
  car = new Car();

  // Obstáculos e itens espalhados ao longo da "estrada"
  for (let i = 0; i < 15; i++) {
    let y = random(-finishY, 0);
    obstacles.push(new Obstacle(random(290, 510), y));
  }

  for (let i = 0; i < 8; i++) {
    let y = random(-finishY, 0);
    items.push(new Item(random(290, 510), y));
  }
}

function draw() {
  background(135, 206, 235); // Céu

  drawBackground();

  if (!gameOver && distance < finishY) {
    distance += 5; // A "estrada" se move para baixo
  }

  drawRoad();

  car.update();
  car.display();

  // Obstáculos
  for (let obs of obstacles) {
    obs.update(distance);
    obs.display(distance);
    if (car.collidesWith(obs, distance)) {
      gameOver = true;
    }
  }

  // Itens
  for (let i = items.length - 1; i >= 0; i--) {
    items[i].update(distance);
    items[i].display(distance);
    if (car.collidesWith(items[i], distance)) {
      score++;
      celebrationItems.push(new Celebration(items[i].x, height / 2));
      items.splice(i, 1);
    }
  }

  // Celebrações
  for (let i = celebrationItems.length - 1; i >= 0; i--) {
    celebrationItems[i].display();
    if (celebrationItems[i].alpha <= 0) {
      celebrationItems.splice(i, 1);
    }
  }

  // HUD
  fill(0);
  textSize(20);
  text("Pontuação: " + score, 20, 30);
  text("Distância: " + (finishY - distance), 20, 60);

  if (gameOver) {
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    noLoop();
  }

  if (distance >= finishY && !gameOver) {
    fill(0);
    textSize(48);
    textAlign(CENTER, CENTER);
    text("VOCÊ CONCLUIU!", width / 2, height / 2);
    noLoop();
  }
}

// ---------- FUNÇÕES DE DECORAÇÃO ----------

function drawBackground() {
  // Campo em cima
  fill(34, 139, 34);
  rect(0, 0, width / 2, height);

  // Cidade à direita
  fill(200, 200, 255);
  rect(width / 2, 0, width / 2, height);

  // Prédios
  for (let i = 0; i < 4; i++) {
    fill(180);
    rect(width - 80 - i * 60, height - 150, 40, 150);
  }
}

function drawRoad() {
  fill(100);
  rect(250, 0, 300, height);

  // Faixas brancas
  stroke(255);
  strokeWeight(4);
  for (let y = 0; y < height; y += 40) {
    line(width / 2, y, width / 2, y + 20);
  }
  noStroke();
}

// ---------- CLASSES ----------

class Car {
  constructor() {
    this.width = 40;
    this.height = 70;
    this.x = width / 2 - this.width / 2;
    this.y = height - this.height - 30;
    this.speed = 6;
  }

  update() {
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += this.speed;
    }
    this.x = constrain(this.x, 260, 500);
  }

  display() {
    fill(255, 0, 0);
    rect(this.x, this.y, this.width, this.height);
  }

  collidesWith(obj, dist) {
    let objY = obj.y + dist;
    return (
      this.x < obj.x + obj.width &&
      this.x + this.width > obj.x &&
      this.y < objY + obj.height &&
      this.y + this.height > objY
    );
  }
}

class Obstacle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 30;
  }

  update(dist) {
    // Nada a atualizar, pois a "pista" se move
  }

  display(dist) {
    let y = this.y + dist;
    fill(0);
    rect(this.x, y, this.width, this.height);
  }
}

class Item {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 25;
    this.width = this.size;
    this.height = this.size;
  }

  update(dist) {
    // Nada — a pista se move
  }

  display(dist) {
    let y = this.y + dist;
    fill(0, 255, 0);
    ellipse(this.x + this.size / 2, y + this.size / 2, this.size);
  }
}

class Celebration {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(10, 30);
    this.color = color(random(255), random(255), random(255));
    this.alpha = 255;
  }

  display() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.alpha);
    noStroke();
    ellipse(this.x, this.y, this.size);
    this.alpha -= 5;
  }
}