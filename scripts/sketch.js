
var canvas;
var quadTree;
var pointList = [];
var r;
var phi;
var horizVelocity;
var vertVelocity;
const totalPoints = 1000;
const capacity = 10;
function setup(){
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas');
    r = new Rectangle(0, 0, width, height);
    quadTree = new QuadTree(r, capacity);
    setQuadTree(quadTree);
      
}

function setQuadTree(quadTree){
    for (let i = 0; i < totalPoints; i++) {
        let x = randomGaussian(width / 2, width / 8);
        let y = randomGaussian(height / 2, height / 8);
        phi = (2* Math.PI * Math.random());
        horizVelocity = Math.cos(phi) * 0.1;
        vertVelocity = Math.sin(phi) * 0.1;
        let p = new QuadTreePoint(new Point(x, y), horizVelocity, vertVelocity);
        quadTree.insert(p);
        pointList.push(p);
      }
}

function draw(){
    quadTree = new QuadTree(r, capacity);
    background(37,41,52);
    for(let i = 0; i < totalPoints; i++){ 
        let tempPoint = new Point(pointList[i].x+=pointList[i].vx, pointList[i].y+=pointList[i].vy);
        if (tempPoint.x > windowWidth || tempPoint.x <= 0){
            pointList[i].vx *= -1;
        }
        if (tempPoint.y > windowHeight || tempPoint.y <= 0){
            pointList[i].vy *= -1;
        }
        let tempQTreePoint = new QuadTreePoint(tempPoint, horizVelocity, vertVelocity);
        quadTree.insert(tempQTreePoint);
    }
    show(quadTree);
}

function show(quadTree) {
    
    stroke(50);
    noFill();
    strokeWeight(1);
    rectMode(CENTER);
    if (quadTree.points == 0){
        fill(40,50,60);
    }
    rect(quadTree.boundary.x, quadTree.boundary.y, quadTree.boundary.w * 2, quadTree.boundary.h * 2);
    // for (let p of quadTree.points) {
    //   p.display();
    // }
  
    if (quadTree.divided) {
      show(quadTree.northeast);
      show(quadTree.northwest);
      show(quadTree.southeast);
      show(quadTree.southwest);
    }
  }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    pointList = [];
    setQuadTree(quadTree);
}

class QuadTreePoint {
    constructor(point, horizVelocity, vertVelocity) {
        this.point = point; 
        this.x = point.x;
        this.y = point.y
        this.vx = horizVelocity;
        this.vy = vertVelocity;
      }

      display() {
        strokeWeight(2);
        stroke(235,0,75);
        point(this.x, this.y);
      }
              
}