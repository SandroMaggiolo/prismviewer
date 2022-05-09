# Prism Viewer library
[![NPM Package][npm]][npm-url]

#### JavaScript 3D library for charts ####
[ES] Threejs based library for representing three-dimensional data in HTML pages with JavaScript. This project was started by Sandro Maggiolo Ruiz for the final thesis at the University of Alcalá on 2022.

[EN] Librería basada en Threejs para representar información tridimensional en páginas HTML con JavaScript. Este proyecto fue iniciado por Sandro Maggiolo Ruiz para el trabajo de fin de grado en la Universidad de Alcalá en 2022.

[FR] Bibliothèque basée sur Threejs pour représenter des données tridimensionnelles dans des pages HTML avec JavaScript. Ce projet a été lancé par Sandro Maggiolo Ruiz pour la thèse finale à l'Université d'Alcalá en 2022.

[Releases](https://github.com/SandroMaggiolo/prismviewer/releases) &mdash;
[Wiki](https://github.com/SandroMaggiolo/prismviewer/wiki)

### Usage ###
The following code is an example to create a 3D chart with random information. It creates the space, the axis, grid, frames, labels and then adds the random information and stablish the sliders and limits.

In the HTML code we will add the scripts that our library need to work such as: ThreeJS and Dat-Gui, OrbitControl, FontLoader and TextGeometry. We can modify the canvasl size and we will need to add our library code prism.js as well as our script.

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

In the JS Code we will first generate random information between some range and then we will create the parts of our chart to pour the information in it.

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
// Background creation
createChart("canvas1", "rgb(25, 25, 25)", 5, 5, 5)
// Walls creation
createWalls("#FFFFFF")
// Grid creation
createGrid(10,10,10, "rgb(255,255,255)")
// Frame creation
createFrame("rgb(255, 255, 255)")
// Controls activation
activateControls()
// Labels creation
createLabels("Temperatura (C)", "Humedad (%)", "Tiempo (S)")
// Info loading
var mappedInfoOutput =  loadInfo(originalInfo[2].info3, 3, "varX", "varY", "varZ", "rgb(212, 127, 30)", 50, "rgb(255,255,255)")
// Axis creation
addAxisSliders("#6666FF",true)
//Legend enabled
enableLegend(14,"rgb(255,255,255)")
```

If you want to see the result of this example go to: https://tfg-ejemplo3-libreria-en-uso.vercel.app/

[npm]: https://img.shields.io/npm/v/three
[npm-url]: https://www.npmjs.com/