# DrawLibrary

A simple library that automates a lot of the boring stuff that Canvas2D makes you perform in order to draw actual primitive shapes, like triangles.

### Prerequisites

-Clone the project or just the DrawLibrary.js and import it to your HTML5.


As we can't implement interfaces in Javascript without TypeScript, the Main.js is mandatory.

-Inside the function update:
```
Fill('triangle', [new Point(20, 20), new Point(20, 100), new Point(70, 100)], "none", "white");

Fill(<String: shapeType>, [<Number Array of points to connect>], <String: fillColor>, <String: lineColor>);
```



