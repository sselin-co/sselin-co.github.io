let quadTree;
const totalPoints = 500;
const capacity = 10;
const points = [];
const clusters = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('canvas');

    colorMode(HSL);
    angleMode(RADIANS);
    noFill();

    initClusters(10);  // 10 random cluster centers
    initPoints();
}

function initClusters(n) {
    clusters.length = 0;
    for (let i = 0; i < n; i++) {
        const x = random(-width / 2, width / 2);
        const y = random(-height / 2, height / 2);
        clusters.push({ x, y });
    }
}

function initPoints() {
    points.length = 0;
    for (let i = 0; i < totalPoints; i++) {
        const cluster = random(clusters);
        const x = cluster.x + random(-40, 40);
        const y = cluster.y + random(-40, 40);
        const angle = random(TWO_PI);
        const vx = cos(angle) * 0.3;
        const vy = sin(angle) * 0.3;
        points.push({ point: new Point(x, y), vx, vy });
    }
}

function draw() {
    clear();

    // 📷 Orbiting camera
    rotateX(PI / 6);
    rotateZ(frameCount * 0.001);

    const boundary = new Rectangle(0, 0, width, height);
    quadTree = new QuadTree(boundary, capacity);

    for (const obj of points) {
        obj.point.x += obj.vx;
        obj.point.y += obj.vy;

        if (obj.point.x < -width / 2 || obj.point.x > width / 2) obj.vx *= -1;
        if (obj.point.y < -height / 2 || obj.point.y > height / 2) obj.vy *= -1;

        const dx = obj.point.x - (mouseX - width / 2);
        const dy = obj.point.y - (mouseY - height / 2);
        const distSq = dx * dx + dy * dy;
        if (distSq < 10000) {
            const force = 0.03 / (distSq + 1);
            obj.vx += dx * force;
            obj.vy += dy * force;
        }

        quadTree.insert(obj.point);
    }

    drawQuadTree(quadTree);

    for (const obj of points) {
        const speed = sqrt(obj.vx ** 2 + obj.vy ** 2);
        const baseHue = 330;
        const offset = sin(frameCount * 0.01 + obj.point.x * 0.01 + obj.point.y * 0.01) * 10;
        const hue = (baseHue + offset + 360) % 360;

        const pulse = sin(frameCount * 0.01) * 0.1 + 0.1;
        const alpha = pulse + map(speed, 0, 0.6, 0, 0.2); // speed adds glow

        push();
        translate(obj.point.x, obj.point.y);
        stroke(hue, 40, 85, constrain(alpha, 0, 1));
        strokeWeight(map(speed, 0, 0.6, 1, 2)); // speedier dots = thicker
        point(0, 0);
        pop();
    }
}

function drawQuadTree(qt) {
    const pulse = sin(frameCount * 0.01) * 0.1 + 0.1;
    stroke(320, 30, 80, pulse);
    strokeWeight(1);
    rectMode(CENTER);
    rect(qt.boundary.x, qt.boundary.y, qt.boundary.w * 2, qt.boundary.h * 2);

    if (qt.divided) {
        drawQuadTree(qt.northeast);
        drawQuadTree(qt.northwest);
        drawQuadTree(qt.southeast);
        drawQuadTree(qt.southwest);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initClusters(10);
    initPoints();
}
