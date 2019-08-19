class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Dimension {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
}

class Draw {
    constructor(context2D) {
        this.context2D = context2D;
    }
}

class DrawCanvas {
    static get Canvas() {
        return window.drawCache.cx;
    }
    static setCanvas(fps) {
        if (!fps) fps = 100;
        window.drawCache = {};
        window.drawCache.c = document.getElementById('Game');
        window.drawCache.cx = window.drawCache.c.getContext('2d');
        setInterval(update, fps);
    }
}

class Shapes {
    static getShape(shape) {
        switch (shape) {
            case "rect":
                return "fillRect";
            case "triangle":
                return "triangle";

        }
    }
}

class Filler extends Draw {
    constructor(shape, space, color, lineColor) {
        super(DrawCanvas.Canvas);
        if (!shape && !space && !color && !lineColor) throw new Error("Constructor can't be empty!");
        if (!(space instanceof Array)) throw new Error("Second paramater must be an array of points/dimensions!");
        this.fill(shape, space, color, lineColor);
    }

    fill(shape, space, color, lineColor) {
        this.lineColor(lineColor);
        let shapeObject = Shapes.getShape(shape);

        switch (shapeObject) {
            case "fillRect":
                let [point, dimension] = space;
                this.context2D.fillStyle = color;
                return this.context2D[shapeObject](point.x, point.y, dimension.w, dimension.h);
            case "triangle":
                this.context2D.beginPath();
                let lines = [...space];
                let firstPoint = (lines.splice(0, 1))[0];
                this.context2D.moveTo(firstPoint.x, firstPoint.y);
                for (let point of lines) {
                    this.context2D.lineTo(point.x, point.y);
                    this.context2D.stroke();
                }
                this.context2D.closePath();
                this.context2D.stroke();
                if (color !== "none") {
                    this.context2D.fillStyle = color;
                    this.context2D.fill();
                }
        }
    }

    lineColor(color) {
        if (!color || typeof color !== "string") throw new Error("Argument must be a color string!");
        this.context2D.strokeStyle = color;
    }
}


