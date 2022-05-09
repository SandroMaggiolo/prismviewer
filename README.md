# Prism Viewer library
[![NPM Package][npm]][npm-url]

#### JavaScript 3D library for charts ####
Threejs based library for representing three-dimensional data in HTML pages with JavaScript. This project was started by Sandro Maggiolo Ruiz for the final thesis at the University of Alcalá on 2022.

Librería basada en Threejs para representar información tridimensional en páginas HTML con JavaScript. Este proyecto fue iniciado por Sandro Maggiolo Ruiz para el trabajo de fin de grado en la Universidad de Alcalá en 2022.

### Usage ###
The following code is an example to create a 3D chart with random information. It creates the space, the axis, grid, frames, labels and then adds the random information and stablish the sliders and limits.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2D Diagram test</title>
</head>
<body>
    <canvas class="canvas1" width="1000" height="600""></canvas>

    <script src="./three.min.js"></script>
    <script src="./dat.gui.min.js"></script>
    <script src="./OrbitControls.js"></script>
    <script src="./FontLoader.js"></script>
    <script src="./TextGeometry.js"></script>
    <script src="./prism.js"></script>
    <script src="./script.js"></script>
</body>
</html>

```

```javascript

// CREATE RANDOM INFO
var originalInfo = []
var info1 = []
var info2 = []
var info3 = []
originalInfo.push({info1})
originalInfo.push({info2})
for (var i = 0; i < 10000; i++) {
    info3.push({
        varX: Math.random()*20,
        varY: Math.random()*20,
        varZ: Math.random()*20
    });
}
originalInfo.push({info3})

// CREATE THE 3D CHART
createChart("canvas1", "rgb(25, 25, 25)", 5, 5, 5)
createWalls("#FFFFFF")
createGrid(10,10,10, "rgb(255,255,255)")
createFrame("rgb(255, 255, 255)")
activateControls()
createLabels("Temperatura (C)", "Humedad (%)", "Tiempo (S)")
var mappedInfoOutput =  loadInfo(originalInfo[2].info3, 3, "varX", "varY", "varZ", "rgb(212, 127, 30)", 50, "rgb(255,255,255)")
addAxisSliders("#6666FF",true)
enableLegend(14,"rgb(255,255,255)")
```

[npm]: https://img.shields.io/npm/v/three
[npm-url]: https://www.npmjs.com/