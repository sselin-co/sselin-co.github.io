
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


// function setup() {
//   canvas = createCanvas(windowWidth, windowHeight);
//   canvas.parent('canvas');  
//   canvas.style('z-index', '-1');  
//   canvas.position(0,0);  
//   noStroke();
//   colorMode(HSB, 360, 255, 255);
// }

// function draw() {
//   windowResized();  
//   var addSharpness = -0.03; // -0.3 to 0.3 reasonable
//   noiseDetail(5, 0.5 + addSharpness);

//   var skyHeight = height/4;
//   var noiseWidth = height;
//   var noiseHeight = height;
//   var layerDifference = 100; // try 0.3
//   var layers = 12;
//   var barWidth = 1; // try 15
//   var minScale = 0.075;
//   var maxScale = 0.55;
  
//   background(getColor(0));

//   for (var i = 1; i < layers; i++) {
    
//     var scale = exp(map(i, 0, layers-1, log(minScale), log(maxScale)));
//     var y = map(i, 0, layers, 0, height)*1.7*scale + skyHeight; // 1.7 is a quick fix
    
//     var lightness = map(i, 0, layers-1, 0, 1);
//     fill(getColor(lightness));

//     var xShift = 100 + millis() * 0.0002;
//     for (var x = 0; x < width; x = x + barWidth) {
//       var xCentered = x - width/2;
//       var noiseValue = noise(xCentered / scale / noiseWidth + xShift, i * layerDifference);
//       var yMaxDifference = -noiseHeight/2*scale;
//       var dy = map(noiseValue, 0, 1, -yMaxDifference, yMaxDifference);
//       rect(int(x), int(y + dy), barWidth, height); // int() makes the edges more sharp
//     }
//   }
// }

// function getColor(lightness) {
//   var gamma = exp(1.75 - lightness * 1.075); // lightness and contrast parameters
//   lightness = pow(lightness, gamma) * 192 / 255; // *192/255 is a quick fix
    
//   var hue1 = 255;
//   var hue2 = 50;
//   var addSaturation = 0.05;
//   var addBrightness = -0.35;
  
//   return color(map(lightness, 0, 1, hue1, hue2),
//                map(pow(lightness, exp(-addSaturation)), 0, 1, 48, 255),
//                map(pow(lightness, exp(addBrightness)), 0, 1, 255-16, 0));
// }



// var canvas;

// let numBalls = 13;
// let spring = 0.05;
// let gravity = 0.03;
// let friction = -0.9;
// let balls = [];

// function setup() {
//   canvas = createCanvas(windowWidth, windowHeight);
//   canvas.style('z-index', '-1');  
//   canvas.position(0,0);  
//   for (let i = 0; i < numBalls; i++) {
//     balls[i] = new Ball(
//       random(width),
//       random(height),
//       random(30, 70),
//       i,
//       balls
//     );
//   }
//   noStroke();
//   fill(255, 204);
// }

// function draw() {
//   background(0);
//   balls.forEach(ball => {
//     ball.collide();
//     ball.move();
//     ball.display();
//   });
// }

// class Ball {
//   constructor(xin, yin, din, idin, oin) {
//     this.x = xin;
//     this.y = yin;
//     this.vx = 0;
//     this.vy = 0;
//     this.diameter = din;
//     this.id = idin;
//     this.others = oin;
//   }

//   collide() {
//     for (let i = this.id + 1; i < numBalls; i++) {
//       // console.log(others[i]);
//       let dx = this.others[i].x - this.x;
//       let dy = this.others[i].y - this.y;
//       let distance = sqrt(dx * dx + dy * dy);
//       let minDist = this.others[i].diameter / 2 + this.diameter / 2;
//       //   console.log(distance);
//       //console.log(minDist);
//       if (distance < minDist) {
//         //console.log("2");
//         let angle = atan2(dy, dx);
//         let targetX = this.x + cos(angle) * minDist;
//         let targetY = this.y + sin(angle) * minDist;
//         let ax = (targetX - this.others[i].x) * spring;
//         let ay = (targetY - this.others[i].y) * spring;
//         this.vx -= ax;
//         this.vy -= ay;
//         this.others[i].vx += ax;
//         this.others[i].vy += ay;
//       }
//     }
//   }

//   move() {
//     this.vy += gravity;
//     this.x += this.vx;
//     this.y += this.vy;
//     if (this.x + this.diameter / 2 > width) {
//       this.x = width - this.diameter / 2;
//       this.vx *= friction;
//     } else if (this.x - this.diameter / 2 < 0) {
//       this.x = this.diameter / 2;
//       this.vx *= friction;
//     }
//     if (this.y + this.diameter / 2 > height) {
//       this.y = height - this.diameter / 2;
//       this.vy *= friction;
//     } else if (this.y - this.diameter / 2 < 0) {
//       this.y = this.diameter / 2;
//       this.vy *= friction;
//     }
//   }

//   display() {
//     ellipse(this.x, this.y, this.diameter, this.diameter);
//   }
// }