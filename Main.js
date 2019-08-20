let W, H;
let fNear = 0.1;
let fFar = 1000;
let fFov = 90;
let ratio;
let fFovRad = 1 / Math.tan(fFov * 0.5 / 180 * Math.PI);

let cubeMesh, matProj;

/* Loading assets after HTML loads. */
window.onload = function () {
    startDraw();
    W = window.drawCache.cx.canvas.width;
    H = window.drawCache.cx.canvas.height;
    ratio = H / W;


    cubeMesh = new Mesh();

    cubeMesh.add(new Triangle(new Vec3d(0, 0, 0), new Vec3d(0, 1, 0), new Vec3d(1, 1, 0)));
    cubeMesh.add(new Triangle(new Vec3d(0, 0, 0), new Vec3d(1, 1, 0), new Vec3d(1, 0, 0)));

    cubeMesh.add(new Triangle(new Vec3d(1, 0, 0), new Vec3d(1, 1, 0), new Vec3d(1, 0, 0)));
    cubeMesh.add(new Triangle(new Vec3d(1, 0, 0), new Vec3d(1, 1, 1), new Vec3d(1, 0, 1)));

    cubeMesh.add(new Triangle(new Vec3d(1, 0, 1), new Vec3d(1, 1, 1), new Vec3d(0, 1, 1)));
    cubeMesh.add(new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 1, 1), new Vec3d(0, 0, 1)));

    cubeMesh.add(new Triangle(new Vec3d(0, 0, 1), new Vec3d(0, 1, 1), new Vec3d(0, 1, 0)));
    cubeMesh.add(new Triangle(new Vec3d(0, 0, 1), new Vec3d(0, 1, 0), new Vec3d(0, 0, 0)));

    cubeMesh.add(new Triangle(new Vec3d(0, 1, 0), new Vec3d(0, 1, 1), new Vec3d(1, 1, 1)));
    cubeMesh.add(new Triangle(new Vec3d(0, 1, 0), new Vec3d(1, 1, 1), new Vec3d(1, 1, 0)));

    cubeMesh.add(new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 0, 1), new Vec3d(0, 0, 0)));
    cubeMesh.add(new Triangle(new Vec3d(1, 0, 1), new Vec3d(0, 0, 0), new Vec3d(1, 0, 0)));



    matProj = new Projection();
    matProj.matrix[0][0] = (ratio * fFovRad).toFixed(5);
    matProj.matrix[1][1] = (fFovRad).toFixed(5);
    matProj.matrix[2][2] = (fFar / (fFar - fNear)).toFixed(5);
    matProj.matrix[3][2] = ((-fFar * fNear) / (fFar - fNear)).toFixed(5);
    matProj.matrix[2][3] = 1;
    matProj.matrix[3][3] = 0;

}

function startDraw(fps) {
    DrawCanvas.setCanvas(fps);
}

function update() {
    screen();
}

/* Cleaning the screen */
function screen() {

    Fill('rect', [new Point(0, 0), new Dimension(W, H)], "black", "black");

    let fTheta = 1 * new Date().getTime()/2000;
    let matRotX = new Projection(), matRotZ = new Projection();
    // Rotation Z
    matRotZ.matrix[0][0] = Math.cos(fTheta);
    matRotZ.matrix[0][1] = Math.sin(fTheta);
    matRotZ.matrix[1][0] = -Math.sin(fTheta);
    matRotZ.matrix[1][1] = Math.cos(fTheta);
    matRotZ.matrix[2][2] = 1;
    matRotZ.matrix[3][3] = 1;

    // Rotation X
    matRotX.matrix[0][0] = 1;
    matRotX.matrix[1][1] = Math.cos(fTheta * 0.5);
    matRotX.matrix[1][2] = Math.sin(fTheta * 0.5);
    matRotX.matrix[2][1] = -Math.sin(fTheta * 0.5);
    matRotX.matrix[2][2] = Math.cos(fTheta * 0.5);
    matRotX.matrix[3][3] = 1;

    for (let tri of cubeMesh.getMesh) {

        let triProjected = new Triangle(new Vec3d(0, 0, 0), new Vec3d(0, 0, 0), new Vec3d(0, 0, 0));
        let triRotatedZ = new Triangle(new Vec3d(0, 0, 0), new Vec3d(0, 0, 0), new Vec3d(0, 0, 0));
        let triRotatedZX = new Triangle(new Vec3d(0, 0, 0), new Vec3d(0, 0, 0), new Vec3d(0, 0, 0));
        // Screw spread operator for making me explicitly saying to copy it 2 pointers instead of just the first one it encouters. 
        let triTranslated = [...tri];
        triTranslated[0] = { ...triTranslated[0] };
        triTranslated[1] = { ...triTranslated[1] };
        triTranslated[2] = { ...triTranslated[2] };

        // Rotate in Z-Axis
        multiplyMatrixVector(tri[0], triRotatedZ[0], matRotZ);
        multiplyMatrixVector(tri[1], triRotatedZ[1], matRotZ);
        multiplyMatrixVector(tri[2], triRotatedZ[2], matRotZ);

        // Rotate in X-Axis
        multiplyMatrixVector(triRotatedZ[0], triRotatedZX[0], matRotX);
        multiplyMatrixVector(triRotatedZ[1], triRotatedZX[1], matRotX);
        multiplyMatrixVector(triRotatedZ[2], triRotatedZX[2], matRotX);

        triTranslated = triRotatedZX;

        triTranslated[0].z = tri[0].z + 3;
        triTranslated[1].z = tri[1].z + 3;
        triTranslated[2].z = tri[2].z + 3;

        multiplyMatrixVector(triTranslated[0], triProjected[0], matProj);
        multiplyMatrixVector(triTranslated[1], triProjected[1], matProj);
        multiplyMatrixVector(triTranslated[2], triProjected[2], matProj);

        triProjected[0].x += 1;
        triProjected[0].y += 1;

        triProjected[1].x += 1;
        triProjected[1].y += 1;

        triProjected[2].x += 1;
        triProjected[2].y += 1;


        triProjected[0].x *= 0.5 * W;
        triProjected[0].y *= 0.5 * H;

        triProjected[1].x *= 0.5 * W;
        triProjected[1].y *= 0.5 * H;

        triProjected[2].x *= 0.5 * W;
        triProjected[2].y *= 0.5 * H;

        Fill("triangle", [new Point(triProjected[0].x, triProjected[0].y), new Point(triProjected[1].x, triProjected[1].y),
        new Point(triProjected[2].x, triProjected[2].y)], 'none', 'white');
    }
}

function Fill(...args) {
    return new Filler(...args);
}

function multiplyMatrixVector(i, o, m) {
    o.x = i.x * m.matrix[0][0] + i.y * m.matrix[1][0] + i.z * m.matrix[2][0] + m.matrix[3][0];
    o.y = i.x * m.matrix[0][1] + i.y * m.matrix[1][1] + i.z * m.matrix[2][1] + m.matrix[3][1];
    o.z = i.x * m.matrix[0][2] + i.y * m.matrix[1][2] + i.z * m.matrix[2][2] + m.matrix[3][2];
    let w = i.x * m.matrix[0][3] + i.y * m.matrix[1][3] + i.z * m.matrix[2][3] + m.matrix[3][3];

    if (w !== 0.0) o.x /= w; o.y /= w; o.z /= w;
}

class Vec3d {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Triangle {
    constructor(vec1 = [0, 0, 0], vec2 = [0, 0, 0], vec3 = [0, 0, 0]) {
        this.tris = [];
        this.tris.push(vec1, vec2, vec3);
        return this.tris;
    }
}

class Mesh {
    constructor() {
        this.list = [];
    }
    add(triangle) {
        this.list.push(triangle);
    }

    get getMesh() {
        return this.list;
    }

}

class Projection {
    constructor() {
        this.matrix = new Array(4);
        for (let i = 0; i < 4; i++) {
            this.matrix[i] = new Array(4);
        }
        for (let x = 0; x < this.matrix.length; x++) {
            for (let y = 0; y < this.matrix[x].length; y++) {
                this.matrix[x][y] = 0;
            }
        }
    }
}

