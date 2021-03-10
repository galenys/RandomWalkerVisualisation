const STEP_SIZE = 10;
const COLOR_CHANGE_RATE = 0.03;
const HISTOGRAM_WIDTH = 5;
const HISTOGRAM_HEIGHT = 9;

class Path {
  constructor(origin) {
    this.positions = [origin];
  }

  addPosition(newPos) {
    this.positions.push(newPos);
  }

  randomStep() {
    let i = this.positions[this.positions.length-1].x;
    let j = this.positions[this.positions.length-1].y;
    switch(Math.floor(Math.random() * 4)) {
      case 0:
        this.positions.push(createVector(i+STEP_SIZE,j));
        break;
      case 1:
        this.positions.push(createVector(i-STEP_SIZE,j));
        break;
      case 2:
        this.positions.push(createVector(i,j+STEP_SIZE));
        break;
      case 3:
        this.positions.push(createVector(i,j-STEP_SIZE));
        break;
      default:
        break;
    }
  }

  taxicabDistance() {
    return (
      Math.abs(this.positions[this.positions.length-1].x - this.positions[0].x) +
      Math.abs(this.positions[this.positions.length-1].y - this.positions[0].y)
    );
  }

  display(color) {
    noFill();
    stroke(color);
    strokeWeight(3);
    let i = this.positions.length;
    line(
      this.positions[i-2].x, this.positions[i-2].y,
      this.positions[i-1].x, this.positions[i-1].y
    );
    strokeWeight(0.3);
    line(
      this.positions[0].x, this.positions[0].y,
      this.positions[i-1].x, this.positions[i-1].y
    );
  }
}


class PathHandler {
  constructor(n, origin) {
    this.color = color(0, 222, 59);

    this.paths = [];
    this.origin = origin;
    for (let i = 0; i < n; i++) {
      this.paths.push(new Path(origin));
    }
  }

  randomStepAllPaths() {
    this.paths.forEach(p => p.randomStep());
  }

  displayAllPaths() {
    this.paths.forEach(p => p.display(this.color));
  }

  getRandomColor() {
    return color(
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      255
    )
  }

  blendColor() {
    this.color = lerpColor(this.color, this.getRandomColor(), COLOR_CHANGE_RATE);
  }

  getDistances() {
    return this.paths.map(x => x.taxicabDistance());
  }

  getHistogram(segmentWidth) {
    let distances = this.getDistances();
    let histogram = {};
    for(let i = 0; i < distances.length; i++) {
      let index = Math.floor(distances[i] / segmentWidth);
      histogram[index] = (histogram[index] + 1) || 1;
    }
    return histogram;
  }

  displayHistogram() {
    let histogram = this.getHistogram(HISTOGRAM_WIDTH);
    for(let k in histogram) {
      fill(this.color, 0.5);
      noStroke();

      let barHeight = histogram[k] * HISTOGRAM_HEIGHT;
      rect(k * HISTOGRAM_WIDTH, height - barHeight, HISTOGRAM_WIDTH*2, barHeight);
    }
  }
}

let pathHandler;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);

  pathHandler = new PathHandler(500, createVector(width/2, height/2));
}

function draw() {
  background(0);
  pathHandler.randomStepAllPaths();
  pathHandler.displayAllPaths();
  pathHandler.displayHistogram();
}
