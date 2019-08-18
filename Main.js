/* Loading assets after HTML loads. */
window.onload = function () {
    startDraw();
    screen();
}

function startDraw(fps) {
    DrawCanvas.setCanvas(fps);
}

function update() {
    screen();
    Fill('line', [new Point(20, 20), new Point(20, 100), new Point(70, 100)], "none", "white");
}

/* Cleaning the screen . */
function screen() {
    Fill('rect', [new Point(0, 0), new Dimension(window.drawCache.cx.canvas.width, window.drawCache.cx.canvas.height)], "black", "black");
}

function Fill(...args) {
    return new Filler(...args);
}

