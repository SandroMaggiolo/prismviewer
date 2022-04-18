import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls"
import { FontLoader } from "../node_modules/three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "../node_modules/three/examples/jsm/geometries/TextGeometry"

var alphaMap, pointPosition, distanceToPoint, map, materialSprite, prevIndex = 0, raycasterEnable, chartCenter, chartCreated = false, canvasString, canvasParameters, canvas, aspectRatio, camera, scene, renderer, wallsCreated = false, wallGroup, Xlength = 5, Ylength = 5, Zlength = 5, materialGridXYFront, materialGridYZFront, materialGridXZFront, materialGridXYBack, materialGridYZBack, materialGridXZBack, gridColor, gridCreated = false, gridGroup, frameCreated = false, labelsCreated = false, labelsGridCreated = false, materialXFrontTop,materialXFrontBot,materialXBackTop,materialXBackBot,materialYFrontTop,materialYFrontBot,materialYBackTop,materialYBackBot,materialZFrontTop,materialZFrontBot,materialZBackTop,materialZBackBot,materialXLabelBackground,materialYLabelBackground,materialZLabelBackground,materialGridXLabel,materialGridYLabel,materialGridZLabel, cameraFarness, frameColor, frameGroup, controls, sortedInfo = [], mappedInfo = [], viewInfo = [], Xmin, Xmax, Ymin, Ymax, Zmin, Zmax, Xratio, Yratio, Zratio, particlesGeometry, particlesArray, index, particles, particlesMaterial, pointGeometrySize, particlesGroup, particlesIndex, newParticlesArray, gui, silderXmax, sliderXmin, sliderYmax, sliderYmin, sliderZmax, sliderZmin, axisLimits, limitsCreated = false, infoLoaded = false, selectionModeCheck = false, selectionMode, pointsGroup, labelsCreated, labelsGroup, xLabelGeometry, yLabelGeometry, zLabelGeometry, xLabelMesh, yLabelMesh, zLabelMesh, xAxisColor, yAxisColor, zAxisColor, fontLoader, labelSize, xLabelMaterial, yLabelMaterial, zLabelMaterial, xLabelNameMaterial, yLabelNameMaterial, zLabelNameMaterial, xLabelNameGeometry, yLabelNameGeometry, zLabelNameGeometry, xLabelNameMesh, yLabelNameMesh, zLabelNameMesh, pointColor, selectionColor, canvasRect, backgroundColor, margin, guiX, guiY, guiZ, ctX, ctY, ctZ, fontSize, enableLegendBool, legendSize, legendCreated, legendColor, frameXColor, frameYColor, frameZColor,XMaxLimitRatioed,YMaxLimitRatioed,ZMaxLimitRatioed,XMinLimitRatioed,YMinLimitRatioed,ZMinLimitRatioed, particlesInIndex, sliderXmax, selectionCheckGui, raycaster, mouse

map = new THREE.TextureLoader().load( './static/point.png' )

var positionCanvas = document.createElement('canvas')
positionCanvas.id = "positionCanvas"
positionCanvas.width = 200
positionCanvas.height = 768
positionCanvas.style.zIndex = 8
positionCanvas.style.position = "absolute";

function createChart(canvasClass, backgroundColorInput, XAxisLength, YAxisLength, ZAxisLength, farness){
    if((XAxisLength != null)&&(XAxisLength > 0)){
        Xlength = XAxisLength
    }else{
        Xlength = 5
    }
    if((YAxisLength != null)&&(YAxisLength > 0)){
        Ylength = YAxisLength
    }else{
        Ylength = 5
    }
    if((ZAxisLength != null)&&(ZAxisLength > 0)){
        Zlength = ZAxisLength
    }else{
        Ylength = 5
    }
    if((farness != null)&&(farness >= 0)&&(farness<=100)){
        cameraFarness = farness
    }else{
        cameraFarness = 35
    }
    chartCenter = new THREE.Vector3(Xlength/2,Ylength/2,Zlength/2);
    canvasString = '.' + canvasClass
    canvasParameters = {width: document.querySelector(canvasString).width, height: document.querySelector(canvasString).height}
    canvas = document.querySelector(canvasString)
    aspectRatio = canvasParameters.width / canvasParameters.height
    camera = new THREE.PerspectiveCamera(60, aspectRatio,0.1,2000)
    camera.position.z = Zlength*(1+2*cameraFarness/100)
    camera.position.x = Xlength*(1+2*cameraFarness/100)
    camera.position.y = Ylength*(1+2*cameraFarness/100)
    camera.lookAt(chartCenter)
    scene = new THREE.Scene()
    scene.add(camera)
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        localClippingEnabled: true
    })
    renderer.setSize(canvasParameters.width, canvasParameters.height)
    
    if(backgroundColorInput == ""){
        renderer.setClearColor( "#000000", 1 )
        backgroundColor = backgroundColorInput
    }else if(backgroundColor != ""){
        renderer.setClearColor( backgroundColorInput, 1 )
        backgroundColor = backgroundColorInput
    }
    chartCreated = true
    renderer.render(scene, camera)
    controls = new OrbitControls( camera, renderer.domElement )
    controls.enabled = false
    gui = new dat.GUI({autoplace: false})
    var div = document.createElement("div")
    document.body.appendChild(div)
    div.appendChild(gui.domElement)
    canvasRect = document.querySelector(canvasString).getBoundingClientRect()
    div.style.position = "absolute"
    div.style.left = canvasRect.x + "px"
    div.style.top = canvasRect.y + "px"
    tick()
}

function createWalls(wallColor){
    if((wallsCreated==false)&&(chartCreated==true)){
        wallGroup = new THREE.Group()
        // Wall color
        var materialWall
        if(wallColor != null){
            materialWall = new THREE.MeshBasicMaterial({
                color: wallColor,
                transparent: true,
                opacity: 0.1
            })
        }else{
            materialWall = new THREE.MeshBasicMaterial({
                color: "#FFFFFF",
                transparent: true,
                opacity: 0.1
            })
        }
        // XY Front
        const wallXYFront = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(Xlength,Ylength,1,1),
            materialWall
        )
        wallXYFront.position.set(Xlength/2,Ylength/2,0)
        wallGroup.add(wallXYFront)
        // YZ Front
        const wallXZFront = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(Zlength,Ylength,1,1),
            materialWall
        )
        wallXZFront.position.set(0,Ylength/2,Zlength/2)
        wallXZFront.rotateY(Math.PI*0.5)
        wallGroup.add(wallXZFront)
        // XZ Front
        const wallYZFront = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(Xlength,Zlength,1,1),
            materialWall
        )
        wallYZFront.position.set(Xlength/2,0,Zlength/2)
        wallYZFront.rotateX(Math.PI*-0.5)
        wallGroup.add(wallYZFront)
        // XY Back
        const wallXYBack = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(Xlength,Ylength,1,1),
            materialWall
        )
        wallXYBack.rotateY(Math.PI)
        wallXYBack.position.set(Xlength/2,Ylength/2,Zlength)
        wallGroup.add(wallXYBack)
        // YZ Back
        const wallXZBack = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(Zlength,Ylength,1,1),
            materialWall
        )
        wallXZBack.position.set(Xlength,Ylength/2,Zlength/2)
        wallXZBack.rotateY(Math.PI*1.5)
        wallGroup.add(wallXZBack)
        // XZ Back
        const wallYZBack = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(Xlength,Zlength,1,1),
            materialWall
        )
        wallYZBack.position.set(Xlength/2,Ylength,Zlength/2)
        wallYZBack.rotateX(Math.PI*-1.5)
        wallGroup.add(wallYZBack)
        
        scene.add(wallGroup)

        wallsCreated = true
        renderer.render(scene, camera)
    }
}

function deleteWalls(){
    if((wallsCreated == true)&&(chartCreated==true)){
        wallsCreated = false
        scene.remove(wallGroup)
        renderer.render(scene, camera)
    }
}

function createGrid(Xsegments, Ysegments, Zsegments, gridColorInput){
    if((gridCreated == false)&&(chartCreated == true)){
        if(gridColorInput != null){
            gridColor = gridColorInput
        }else{
            gridColor = "rgb(255,255,255)"
        }
        if(Xsegments == null){
            Xsegments = 10
        }
        if(Ysegments == null){
            Ysegments = 10
        }
        if(Zsegments == null){
            Zsegments = 10
        }
        const segmentsXdistance = Xlength/Xsegments
        const segmentsYdistance = Ylength/Ysegments
        const segmentsZdistance = Zlength/Zsegments
        const thickness = Ylength / 500000
        gridGroup = new THREE.Group()
        //Materials
        materialGridXYFront = new THREE.MeshBasicMaterial({
            color: gridColor,
            transparent: true,
            wireframe: true
        })
        materialGridXZFront = new THREE.MeshBasicMaterial({
            color: gridColor,
            transparent: true,
            wireframe: true
        })
        materialGridYZFront = new THREE.MeshBasicMaterial({
            color: gridColor,
            transparent: true,
            wireframe: true
        })
        materialGridXYBack = new THREE.MeshBasicMaterial({
            color: gridColor,
            transparent: true,
            wireframe: true
        })
        materialGridXZBack = new THREE.MeshBasicMaterial({
            color: gridColor,
            transparent: true,
            wireframe: true
        })
        materialGridYZBack = new THREE.MeshBasicMaterial({
            color: gridColor,
            transparent: true,
            wireframe: true
        })
        // XY Front
        for(let i = 1;i < Xsegments ; i++){
            const axisXgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Ylength,1,1),
                materialGridXYFront
            )
            axisXgrid.position.set(segmentsXdistance*i,Ylength/2,0)
            gridGroup.add(axisXgrid)  
        }
        for(let i = 1;i < Ysegments ; i++){
            const axisYgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Xlength,1,1),
                materialGridXYFront
            )
            axisYgrid.rotateZ(Math.PI*0.5)
            axisYgrid.position.set(Xlength/2,segmentsYdistance*i,0)
            gridGroup.add(axisYgrid)  
        }
        // YZ Front
        for(let i = 1;i < Zsegments ; i++){
            const axisZgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Ylength,1,1),
                materialGridYZFront
            )
            axisZgrid.rotateY(Math.PI*0.5)
            axisZgrid.position.set(0,Ylength/2,segmentsZdistance*i)
            gridGroup.add(axisZgrid)  
        } 
        for(let i = 1;i < Ysegments ; i++){
            const axisYgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Zlength,1,1),
                materialGridYZFront
            )
            axisYgrid.rotateZ(Math.PI*0.5)
            axisYgrid.rotateX(Math.PI*0.5)
            axisYgrid.position.set(0,segmentsYdistance*i,Zlength/2)
            gridGroup.add(axisYgrid)
        }
        // XZ Front
        for(let i = 1;i < Xsegments ; i++){
            const axisXgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Zlength,1,1),
                materialGridXZFront
            )
            axisXgrid.rotateX(Math.PI*-0.5)
            axisXgrid.position.set(segmentsXdistance*i,0,Zlength/2)
            gridGroup.add(axisXgrid)
        }
        for(let i = 1;i < Zsegments ; i++){
            const axisZgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Xlength,1,1),
                materialGridXZFront
            )
            axisZgrid.rotateX(Math.PI*-0.5)
            axisZgrid.rotateZ(Math.PI*-0.5)
            axisZgrid.position.set(Xlength/2,0,segmentsZdistance*i)
            gridGroup.add(axisZgrid)
        }
        // XY Back
        for(let i = 1;i < Xsegments ; i++){
            const axisXgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Ylength,1,1),
                materialGridXYBack
            )
            axisXgrid.rotateY(Math.PI)
            axisXgrid.position.set(segmentsXdistance*i,Ylength/2,Zlength)
            gridGroup.add(axisXgrid)  
        }
        for(let i = 1;i < Ysegments ; i++){
            const axisYgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Xlength,1,1),
                materialGridXYBack
            )
            axisYgrid.rotateZ(Math.PI*0.5)
            axisYgrid.rotateY(Math.PI)
            axisYgrid.position.set(Xlength/2,segmentsYdistance*i,Zlength)
            gridGroup.add(axisYgrid)  
        }
        // YZ Back
        for(let i = 1;i < Zsegments ; i++){
            const axisZgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Ylength,1,1),
                materialGridYZBack
            )
            axisZgrid.rotateY(Math.PI*1.5)
            axisZgrid.position.set(Xlength,Ylength/2,segmentsZdistance*i)
            gridGroup.add(axisZgrid)  
        }
        for(let i = 1;i < Ysegments ; i++){
            const axisYgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Zlength,1,1),
                materialGridYZBack
            )
            axisYgrid.rotateZ(Math.PI*0.5)
            axisYgrid.rotateX(Math.PI*0.5)
            axisYgrid.rotateY(Math.PI)
            axisYgrid.position.set(Xlength,segmentsYdistance*i,Zlength/2)
            gridGroup.add(axisYgrid)  
        }
        // XZ Back
        for(let i = 1;i < Xsegments ; i++){
            const axisXgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Zlength,1,1),
                materialGridXZBack
            )
            axisXgrid.rotateX(Math.PI*-0.5)
            axisXgrid.rotateZ(Math.PI)
            axisXgrid.position.set(segmentsXdistance*i,Ylength,Zlength/2)
            gridGroup.add(axisXgrid)
        }
        for(let i = 1;i < Zsegments ; i++){
            const axisZgrid = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(thickness,Xlength,1,1),
                materialGridXZBack
            )
            axisZgrid.rotateX(Math.PI*-0.5)
            axisZgrid.rotateZ(Math.PI*-1.5)
            axisZgrid.position.set(Xlength/2,Ylength,segmentsZdistance*i)
            gridGroup.add(axisZgrid)
        }
        gridCreated = true
        scene.add(gridGroup)
        updateFromCameraPosition()
        renderer.render(scene, camera)

    }
}

function deleteGrid(){
    if((gridCreated == true)&&(chartCreated == true)){
        gridCreated = false
        scene.remove(gridGroup)
        renderer.render(scene, camera)
    }
}

function createFrame(frameColorInput, XframeColor, YframeColor, ZframeColor){
    if(( frameCreated == false )&&(chartCreated == true)){
        if(frameColorInput != null){
            frameColor = frameColorInput
        }else{
            frameColor = "#FFFFFF"
        }
        if(XframeColor != null){
            frameXColor = XframeColor
            xAxisColor = frameXColor
        }else{
            frameXColor = "rgb(255,30,30)"
            xAxisColor = frameXColor
        }
        if(YframeColor != null){
            frameYColor = YframeColor
            yAxisColor = frameYColor
        }else{
            frameYColor = "rgb(30,255,30)"
            yAxisColor = frameYColor
        }
        if(ZframeColor != null){
            frameZColor = ZframeColor
            zAxisColor = frameZColor
        }else{
            frameZColor = "rgb(30,30,255)"
            zAxisColor = frameZColor
        }
        frameGroup = new THREE.Group()
        const thickness = Ylength /1000
        //Materials
        materialXFrontBot = new THREE.MeshBasicMaterial({
            color: frameXColor,
            transparent: true,
            wireframe: true
        })
        materialXFrontTop = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        materialXBackBot = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        materialXBackTop = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        materialYFrontBot = new THREE.MeshBasicMaterial({
            color: frameYColor,
            transparent: true,
            wireframe: true
        })
        materialYFrontTop = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        materialYBackBot = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        materialYBackTop = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        materialZFrontBot = new THREE.MeshBasicMaterial({
            color: frameZColor,
            transparent: true,
            wireframe: true
        })
        materialZFrontTop = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        materialZBackBot = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        materialZBackTop = new THREE.MeshBasicMaterial({
            color: frameColor,
            transparent: true,
            wireframe: true
        })
        //X Front Bottom
        const frameXFrontBot = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Xlength,1,1),
            materialXFrontBot
        )
        frameXFrontBot.rotateZ(Math.PI*0.5)
        frameXFrontBot.position.set(Xlength/2,0,0)
        frameGroup.add(frameXFrontBot)
        //X Front Top
        const frameXFrontTop = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Xlength,1,1),
            materialXFrontTop
        )
        frameXFrontTop.rotateZ(Math.PI*0.5)
        frameXFrontTop.position.set(Xlength/2,Ylength,0)
        frameGroup.add(frameXFrontTop) 
        //X Back Bottom
        const frameXBackBot = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Xlength,1,1),
            materialXBackBot
        )
        frameXBackBot.rotateZ(Math.PI*0.5)
        frameXBackBot.position.set(Xlength/2,0,Zlength)
        frameGroup.add(frameXBackBot) 
        //X Back Top
        const frameXBackTop = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Xlength,1,1),
            materialXBackTop
        )
        frameXBackTop.rotateZ(Math.PI*0.5)
        frameXBackTop.position.set(Xlength/2,Ylength,Zlength)
        frameGroup.add(frameXBackTop)
        //Y Front Bottom
        const frameYFrontBot = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Ylength,1,1),
            materialYFrontBot
        )
        frameYFrontBot.position.set(0,Ylength/2,0)
        frameGroup.add(frameYFrontBot)
        //Y Front Top
        const frameYFrontTop = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Ylength,1,1),
            materialYFrontTop
        )
        frameYFrontTop.position.set(0,Ylength/2,Zlength)
        frameGroup.add(frameYFrontTop) 
        //Y Back Bottom
        const frameYBackBot = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Ylength,1,1),
            materialYBackBot
        )
        frameYBackBot.position.set(Xlength,Ylength/2,0)
        frameGroup.add(frameYBackBot) 
        //Y Back Top
        const frameYBackTop = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Ylength,1,1),
            materialYBackTop
        )
        frameYBackTop.position.set(Xlength,Ylength/2,Zlength)
        frameGroup.add(frameYBackTop)
        //Z Front Bottom
        const frameZFrontBot = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Zlength,1,1),
            materialZFrontBot
        )
        frameZFrontBot.rotateX(Math.PI*-0.5)
        frameZFrontBot.position.set(0,0,Zlength/2)
        frameGroup.add(frameZFrontBot)
        //Z Front Top
        const frameZBackBot = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Zlength,1,1),
            materialZBackBot
        )
        frameZBackBot.rotateX(Math.PI*-0.5)
        frameZBackBot.position.set(Xlength,0,Zlength/2)
        frameGroup.add(frameZBackBot) 
        //Z Back Bottom
        const frameZFrontTop = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Zlength,1,1),
            materialZFrontTop
        )
        frameZFrontTop.rotateX(Math.PI*-0.5)
        frameZFrontTop.position.set(0,Ylength,Zlength/2)
        frameGroup.add(frameZFrontTop) 
        //Z Back Top
        const frameZBackTop = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(thickness,Zlength,1,1),
            materialZBackTop
        )
        frameZBackTop.rotateX(Math.PI*-0.5)
        frameZBackTop.position.set(Xlength,Ylength,Zlength/2)
        frameGroup.add(frameZBackTop)
        
        frameCreated = true
        scene.add(frameGroup)
        updateFromCameraPosition()
        renderer.render(scene, camera)
    }      
}

function deleteFrame(){
    if((frameCreated == true)&&(chartCreated == true)){
        frameCreated = false
        scene.remove(frameGroup)
        renderer.render(scene, camera)
    }
}

function updateFromCameraPosition(){
    if(gridCreated == true){
        materialGridXYFront.opacity = 1
        materialGridXYBack.opacity = 1
        materialGridYZFront.opacity = 1
        materialGridYZBack.opacity = 1
        materialGridXZFront.opacity = 1
        materialGridXZBack.opacity = 1
    }
    if(frameCreated == true){
        materialXFrontTop.opacity = 1
        materialXFrontBot.opacity = 1
        materialXBackTop.opacity = 1
        materialXBackBot.opacity = 1
        materialYFrontTop.opacity = 1
        materialYFrontBot.opacity = 1
        materialYBackTop.opacity = 1
        materialYBackBot.opacity = 1
        materialZFrontTop.opacity = 1
        materialZFrontBot.opacity = 1
        materialZBackTop.opacity = 1
        materialZBackBot.opacity = 1
    }
    if(labelsCreated == true){
        xLabelMaterial.opacity = 1
        yLabelMaterial.opacity = 1
        zLabelMaterial.opacity = 1
        xLabelNameMaterial.opacity = 1
        yLabelNameMaterial.opacity = 1
        zLabelNameMaterial.opacity = 1
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Y<0 , Z<0                         // 1 
    if((camera.position.x<=0)&&(camera.position.y<=0)&&(camera.position.z<=0)){ 
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
            materialGridXYFront.opacity = 0
            materialGridYZFront.opacity = 0
        }
        if(frameCreated == true){
            materialXFrontBot.opacity = 0
            materialZFrontBot.opacity = 0
            materialYFrontBot.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridXLabel.opacity = 0
            materialGridYLabel.opacity = 0
            materialGridZLabel.opacity = 0
        }
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            yLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Y<0 , Z<0                  // 2 
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y<=0)&&(camera.position.z<=0)){
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
            materialGridXYFront.opacity = 0
        }
        if(frameCreated == true){
            materialXFrontBot.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridXLabel.opacity = 0
            materialGridZLabel.opacity = 0 
        }
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            yLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Y<0 , Z<0                    // 3 
    else if((camera.position.x>Xlength)&&(camera.position.y<=0)&&(camera.position.z<=0)){
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
            materialGridXYFront.opacity = 0
            materialGridYZBack.opacity = 0
        }
        if(frameCreated == true){
            materialXFrontBot.opacity = 0
            materialYBackBot.opacity = 0
            materialZBackBot.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridZLabel.opacity = 0
            materialGridXLabel.opacity = 0
        }
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Y<0 , Length>Z>0             // 4 
    else if((camera.position.x>Xlength)&&(camera.position.y<=0)&&(camera.position.z>0)&&(camera.position.z<Zlength)){
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
            materialGridYZBack.opacity = 0
        }
        if(frameCreated == true){
            materialZBackBot.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridZLabel.opacity = 0
            materialGridXLabel.opacity = 0
        }  
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        } 
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Y<0 , Z>Length               // 5 
    else if((camera.position.x>Xlength)&&(camera.position.y<=0)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
            materialGridYZBack.opacity = 0
            materialGridXYBack.opacity = 0
        }
        if(frameCreated == true){
            materialZBackBot.opacity = 0 
            materialYBackTop.opacity = 0 
            materialXBackBot.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridZLabel.opacity = 0 
            materialGridXLabel.opacity = 0
        }  
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        }      
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Y<0 , Z>Length             // 6 
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y<=0)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
            materialGridXYBack.opacity = 0
        }
        if(frameCreated == true){
            materialXBackBot.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridXLabel.opacity = 0
            materialGridZLabel.opacity = 0 
        }    
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        }     
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Y<0 , Z>Length                    // 7 
    else if((camera.position.x<=0)&&(camera.position.y<=0)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
            materialGridXYBack.opacity = 0
            materialGridYZFront.opacity = 0
        }
        if(frameCreated == true){
            materialXBackBot.opacity = 0
            materialZFrontBot.opacity = 0 
            materialYFrontTop.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridXLabel.opacity = 0 
            materialGridYLabel.opacity = 0
            materialGridZLabel.opacity = 0 
        }    
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            yLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        }   
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Y<0 , Length>Z>0                  // 8 
    else if((camera.position.x<=0)&&(camera.position.y<=0)&&(camera.position.z>0)&&(camera.position.z<Zlength)){
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
            materialGridYZFront.opacity = 0
        }
        if(frameCreated == true){
            materialZFrontBot.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridXLabel.opacity = 0
            materialGridZLabel.opacity = 0
            materialGridYLabel.opacity = 0  
        }  
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            yLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Y<0 , Length>Z>0           // 9 
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y<=0)&&(camera.position.z>0)&&(camera.position.z<Zlength)){
        if(gridCreated == true){
            materialGridXZFront.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridXLabel.opacity = 0
            materialGridZLabel.opacity = 0  
        }      
        if(labelsCreated == true){
            xLabelMaterial.opacity = 0
            zLabelMaterial.opacity = 0
            xLabelNameMaterial.opacity = 0
            zLabelNameMaterial.opacity = 0
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Length>Y>0 , Z<0                 // 10 
    else if((camera.position.x<=0)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z<=0)){ 
        if(gridCreated == true){
            materialGridXYFront.opacity = 0
            materialGridYZFront.opacity = 0
        }
        if(frameCreated == true){
            materialYFrontBot.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridYLabel.opacity = 0
        } 
        if(labelsCreated == true){
            yLabelMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Length>Y>0 , Z<0          // 11 
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z<=0)){
        if(gridCreated == true){
            materialGridXYFront.opacity = 0  
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Length>Y>0 , Z<0            // 12 
    else if((camera.position.x>Xlength)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z<=0)){
        if(gridCreated == true){
            materialGridXYFront.opacity = 0 
            materialGridYZBack.opacity = 0
        }
        if(frameCreated == true){
            materialYBackBot.opacity = 0   
        }  
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Length>Y>0 , Length>Z>0     // 13 
    else if((camera.position.x>Xlength)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z>0)&&(camera.position.z<Zlength)){
        if(gridCreated == true){
            materialGridYZBack.opacity = 0  
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Length>Y>0 , Z>Length       // 14 
    else if((camera.position.x>Xlength)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridYZBack.opacity = 0
            materialGridXYBack.opacity = 0
        }
        if(frameCreated == true){
            materialYBackTop.opacity = 0   
        }  
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Length>Y>0 , Z>Length     // 15
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridXYBack.opacity = 0  
        }     
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Length>Y>0 , Z>Length            // 16 
    else if((camera.position.x<=0)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridXYBack.opacity = 0
            materialGridYZFront.opacity = 0
        }
        if(frameCreated == true){
            materialYFrontTop.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridYLabel.opacity = 0 
        } 
        if(labelsCreated == true){
            yLabelMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
        }        
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Length>Y>0 , Length>Z>0          // 17 
    else if((camera.position.x<=0)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z>0)&&(camera.position.z<Zlength)){
        if(gridCreated == true){
            materialGridYZFront.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridYLabel.opacity = 0 
        }   
        if(labelsCreated == true){
            yLabelMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Length>Y>0 , Length>Z>0   // 18 
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y>0)&&(camera.position.y<Ylength)&&(camera.position.z>0)&&(camera.position.z<Zlength)){       
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Y>Length , Z<0                         // 19
    else if((camera.position.x<=0)&&(camera.position.y>Ylength)&&(camera.position.z<=0)){ 
        if(gridCreated == true){
            materialGridXZBack.opacity = 0
            materialGridXYFront.opacity = 0
            materialGridYZFront.opacity = 0
        }
        if(frameCreated == true){
            materialYFrontBot.opacity = 0
            materialXFrontTop.opacity = 0
            materialZFrontTop.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridYLabel.opacity = 0  
        }
        if(labelsCreated == true){
            yLabelMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Y>Length , Z<0                  // 20 
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y>Ylength)&&(camera.position.z<=0)){
        if(gridCreated == true){
            materialGridXZBack.opacity = 0
            materialGridXYFront.opacity = 0
        }
        if(frameCreated == true){
            materialXFrontTop.opacity = 0  
        }  
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Y>Length , Z<0                    // 21 
    else if((camera.position.x>Xlength)&&(camera.position.y>Ylength)&&(camera.position.z<=0)){
        if(gridCreated == true){
            materialGridXZBack.opacity = 0
            materialGridXYFront.opacity = 0
            materialGridYZBack.opacity = 0
        }
        if(frameCreated == true){
            materialYBackBot.opacity = 0
            materialXFrontTop.opacity = 0
            materialZBackTop.opacity = 0  
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Y>Length , Length>Z>0             // 22 
    else if((camera.position.x>Xlength)&&(camera.position.y>Ylength)&&(camera.position.z>0)&&(camera.position.z<Zlength)){ 
        if(gridCreated == true){
            materialGridXZBack.opacity = 0
            materialGridYZBack.opacity = 0
        }
        if(frameCreated == true){
            materialZBackTop.opacity = 0  
        }  
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X>Length , Y>Length , Z>Length               // 23 
    else if((camera.position.x>Xlength)&&(camera.position.y>Ylength)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridXZBack.opacity = 0
            materialGridYZBack.opacity = 0
            materialGridXYBack.opacity = 0
        }
        if(frameCreated == true){
            materialYBackTop.opacity = 0
            materialZBackTop.opacity = 0
            materialXBackTop.opacity = 0  
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Y>Length , Z>Length             // 24 
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y>Ylength)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridXZBack.opacity = 0
            materialGridXYBack.opacity = 0
        }
        if(frameCreated == true){
            materialXBackTop.opacity = 0   
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Y>Length , Z>Length                    // 25 
    else if((camera.position.x<=0)&&(camera.position.y>Ylength)&&(camera.position.z>Zlength)){
        if(gridCreated == true){
            materialGridXZBack.opacity = 0
            materialGridXYBack.opacity = 0
            materialGridYZFront.opacity = 0
        }
        if(frameCreated == true){
            materialYFrontTop.opacity = 0
            materialXBackTop.opacity = 0
            materialZFrontTop.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridYLabel.opacity = 0 
        }      
        if(labelsCreated == true){
            yLabelMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
        }   
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ X<0 , Y>Length , Length>Z>0                  // 26 
    else if((camera.position.x<=0)&&(camera.position.y>Ylength)&&(camera.position.z>0)&&(camera.position.z<Zlength)){
        if(gridCreated == true){
            materialGridXZBack.opacity = 0
            materialGridYZFront.opacity = 0
        }
        if(frameCreated == true){
            materialZFrontTop.opacity = 0
        }
        if(labelsGridCreated == true){
            materialGridYLabel.opacity = 0  
        }    
        if(labelsCreated == true){
            yLabelMaterial.opacity = 0
            yLabelNameMaterial.opacity = 0
        }    
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Length>X>0 , Y>Length , Length>Z>0           // 27 
    else if((camera.position.x>0)&&(camera.position.x<=Xlength)&&(camera.position.y>Ylength)&&(camera.position.z>0)&&(camera.position.z<Zlength)){
        if(gridCreated == true){
            materialGridXZBack.opacity = 0  
        }
    }
}

function activateControls(){
    if(chartCreated == true){
        controls.enabled = true
    }
}

function deactivateControls(){
    if(chartCreated == true){
        controls.enabled = false
    }
}

function loadInfo(info, dimension, Xname, Yname, Zname, pointColorInput, pointSize, selectionColorInput){
    if((chartCreated == true)&&(infoLoaded == false)){
        sortedInfo = []
        mappedInfo = []
        particlesArray = new Float32Array(info.length * 3)
        pointGeometrySize
        if((pointSize != null)&&(pointSize > 0)&&(pointSize <= 200)){
            pointGeometrySize = (pointSize/25) * (Ylength/167)
        }else{
            pointGeometrySize = Ylength/167
        }
        if(pointColorInput != null){
            pointColor = pointColorInput
        }else{
            pointColor = "rgb(255,255,255)"
        }
        if(selectionColorInput != null){
            selectionColor = selectionColorInput
        }else{
            selectionColor = "rgb(255,0,0)"
        }
        particlesGeometry = new THREE.BufferGeometry()
        particlesMaterial = new THREE.PointsMaterial({color: pointColor})
            particlesMaterial.size = pointGeometrySize
            particlesMaterial.sizeAttenuation = true
            //particlesMaterial.map = map
            particlesMaterial.alphaMap = map
            particlesMaterial.transparent = true
        if(dimension == 2){
            for( var k = 0 ; k < info.length ; k++){
                sortedInfo.push({
                    x: info[k][Xname],
                    y: info[k][Yname],
                    z: 0
                })
            }
            for(var j = 0 ; j < sortedInfo.length ; j++){
                if(j == 0){
                    Xmin = sortedInfo[j].x
                    Xmax = sortedInfo[j].x
                    Ymin = sortedInfo[j].y
                    Ymax = sortedInfo[j].y
                }else{
                    if(sortedInfo[j].x > Xmax){ Xmax = sortedInfo[j].x}
                    if(sortedInfo[j].x < Xmin){ Xmin = sortedInfo[j].x}
                    if(sortedInfo[j].y > Ymax){ Ymax = sortedInfo[j].y}
                    if(sortedInfo[j].y < Ymin){ Ymin = sortedInfo[j].y}
                }
            }
            Xratio = (Xmax - Xmin)/Xlength
            Yratio = (Ymax - Ymin)/Ylength
            for(var j = 0; j < sortedInfo.length ; j++){
                mappedInfo.push({
                    x: sortedInfo[j].x / Xratio,
                    y: sortedInfo[j].y / Yratio,
                    z: 0
                })
                particlesArray[j*3] = mappedInfo[j].x
                particlesArray[j*3+1] = mappedInfo[j].y
                particlesArray[j*3+2] = mappedInfo[j].z
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesArray, 3))
        }
        else if(dimension == 3){
            for( k = 0 ; k < info.length ; k++){
                sortedInfo.push({
                    x: info[k][Xname],
                    y: info[k][Yname],
                    z: info[k][Zname]
                })
            }
            for(var j = 0 ; j < sortedInfo.length ; j++){
                if(j == 0){
                    Xmin = sortedInfo[j].x
                    Xmax = sortedInfo[j].x
                    Ymin = sortedInfo[j].y
                    Ymax = sortedInfo[j].y
                    Zmin = sortedInfo[j].z
                    Zmax = sortedInfo[j].z
                }else{
                    if(sortedInfo[j].x > Xmax){ Xmax = sortedInfo[j].x}
                    if(sortedInfo[j].x < Xmin){ Xmin = sortedInfo[j].x}
                    if(sortedInfo[j].y > Ymax){ Ymax = sortedInfo[j].y}
                    if(sortedInfo[j].y < Ymin){ Ymin = sortedInfo[j].y}
                    if(sortedInfo[j].z > Zmax){ Zmax = sortedInfo[j].z}
                    if(sortedInfo[j].z < Zmin){ Zmin = sortedInfo[j].z}
                }
            }
            Xratio = (Xmax - Xmin)/Xlength
            Yratio = (Ymax - Ymin)/Ylength
            Zratio = (Zmax - Zmin)/Zlength
            for(var j = 0; j < sortedInfo.length ; j++){
                mappedInfo.push({
                    x: ((sortedInfo[j].x-Xmin) / Xratio),
                    y: ((sortedInfo[j].y-Ymin) / Yratio),
                    z: ((sortedInfo[j].z-Zmin) / Zratio)
                })
                viewInfo.push({
                    x: ((sortedInfo[j].x-Xmin) / Xratio),
                    y: ((sortedInfo[j].y-Ymin) / Yratio),
                    z: ((sortedInfo[j].z-Zmin) / Zratio)
                })
                particlesArray[(j*3)] = viewInfo[j].x
                particlesArray[(j*3)+1] = viewInfo[j].y
                particlesArray[(j*3)+2] = viewInfo[j].z
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesArray, 3))
        }
        particles = new THREE.Points(particlesGeometry, particlesMaterial)
        scene.add(particles)
        renderer.render(scene, camera)
        infoLoaded = true
        selectionMode = {
            SelectionModeEnabled: false
        }
        setLimits(Xmax,Xmin,Ymax,Ymin,Zmax,Zmin)
    }
}

function setLimits(XMaxLimit, XMinLimit, YMaxLimit, YMinLimit, ZMaxLimit, ZMinLimit){
 XMaxLimitRatioed = XMaxLimit / Xratio
    var XMinLimitRatioed = XMinLimit / Xratio
    var YMaxLimitRatioed = YMaxLimit / Yratio
    var YMinLimitRatioed = YMinLimit / Yratio
    var ZMaxLimitRatioed = ZMaxLimit / Zratio
    var ZMinLimitRatioed = ZMinLimit / Zratio
    viewInfo = []
    particlesArray = new Float32Array(mappedInfo.length * 3)
    particlesInIndex = 0
    for(var j = 0; j < mappedInfo.length ; j++){
        if((mappedInfo[j].x > XMinLimitRatioed)&&(mappedInfo[j].x < XMaxLimitRatioed)&&(mappedInfo[j].y > YMinLimitRatioed)&&(mappedInfo[j].y < YMaxLimitRatioed)&&(mappedInfo[j].z > ZMinLimitRatioed)&&(mappedInfo[j].z < ZMaxLimitRatioed)){
            viewInfo.push({
                x: mappedInfo[j].x,
                y: mappedInfo[j].y,
                z: mappedInfo[j].z
            })
            particlesArray[particlesInIndex] = mappedInfo[j].x
            particlesArray[particlesInIndex+1] = mappedInfo[j].y
            particlesArray[particlesInIndex+2] = mappedInfo[j].z
            particlesInIndex+=3
        }
    }
    newParticlesArray = new Float32Array(particlesInIndex*3)
    for( var u = 0; u < particlesInIndex; u++){
        newParticlesArray[u] = particlesArray[u]
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(newParticlesArray, 3))
    if(viewInfo.length < 5000){
        if(selectionModeCheck == false){
            selectionModeCheck = true
            selectionCheckGui = gui.add(selectionMode, 'SelectionModeEnabled')
            selectionCheckOnChange()
        }
    }else{
        if(selectionModeCheck == true){
            gui.remove(selectionCheckGui)
            selectionModeCheck = false
        }
    }
    renderer.render(scene, camera)
}

function addAxisSliders(limitsColor, limitWallsEnable){
    if((infoLoaded == true)&&(limitsCreated == false)){
        axisLimits = {
            Xmin: Xmin,
            Xmax: Xmax,
            Ymin: Ymin,
            Ymax: Ymax,
            Zmin: Zmin,
            Zmax: Zmax
        }
        sliderXmin = gui.add(axisLimits, 'Xmin', Xmin, Xmax);
        sliderXmax = gui.add(axisLimits, 'Xmax', Xmin, Xmax);
        sliderYmin = gui.add(axisLimits, 'Ymin', Ymin, Ymax);
        sliderYmax = gui.add(axisLimits, 'Ymax', Ymin, Ymax);
        sliderZmin = gui.add(axisLimits, 'Zmin', Zmin, Zmax);
        sliderZmax = gui.add(axisLimits, 'Zmax', Zmin, Zmax);
        sliderXmin.onChange(function () {
            setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
        })
        sliderXmax.onChange(function () {
            setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
        })
        sliderYmin.onChange(function () {
            setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
        })
        sliderYmax.onChange(function () {
            setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
        })
        sliderZmin.onChange(function () {
            setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
        })
        sliderZmax.onChange(function () {
            setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
        })
        limitsCreated = true
    }
}

function deleteAxisSliders(){
    if(limitsCreated == true){
        gui.remove(sliderXmin)
        gui.remove(sliderXmax)
        gui.remove(sliderYmin)
        gui.remove(sliderYmax)
        gui.remove(sliderZmin)
        gui.remove(sliderZmax)
        limitsCreated = false
    }
}

function selectionCheckOnChange(){
    selectionCheckGui.onChange(function (value) {
        if(value == true){
            gui.remove(sliderXmin)
            gui.remove(sliderXmax)
            gui.remove(sliderYmin)
            gui.remove(sliderYmax)
            gui.remove(sliderZmin)
            gui.remove(sliderZmax)
            scene.remove(particles)
            createMeshes()
        }else if(value == false){
            sliderXmin = gui.add(axisLimits, 'Xmin', Xmin, Xmax)
            sliderXmax = gui.add(axisLimits, 'Xmax', Xmin, Xmax)
            sliderYmin = gui.add(axisLimits, 'Ymin', Ymin, Ymax)
            sliderYmax = gui.add(axisLimits, 'Ymax', Ymin, Ymax)
            sliderZmin = gui.add(axisLimits, 'Zmin', Zmin, Zmax)
            sliderZmax = gui.add(axisLimits, 'Zmax', Zmin, Zmax)
            sliderXmin.onChange(function () {
                setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
            })
            sliderXmax.onChange(function () {
                setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
            })
            sliderYmin.onChange(function () {
                setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
            })
            sliderYmax.onChange(function () {
                setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
            })
            sliderZmin.onChange(function () {
                setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
            })
            sliderZmax.onChange(function () {
                setLimits(axisLimits.Xmax,axisLimits.Xmin,axisLimits.Ymax,axisLimits.Ymin,axisLimits.Zmax,axisLimits.Zmin)
            })
            deleteMeshes()
            scene.add(particles)
        }
    })
}

function raycasterInit(){
    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()
    renderer.domElement.addEventListener('mousemove', raycasterDetect, false)
}

function raycasterDetect(){
    if(raycasterEnable == true){
        event.preventDefault();
        mouse.x = ( (event.clientX -renderer.domElement.offsetLeft) / renderer.domElement.width ) * 2 - 1
        mouse.y = -( (event.clientY - renderer.domElement.offsetTop) / renderer.domElement.height ) * 2 + 1
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObject(pointsGroup, true)
        if (intersects.length > 0) {
            var object = intersects[0].object
            for( let i = 0 ; i < pointsGroup.children.length ; i++){
                if(pointsGroup.children[i].uuid == object.uuid){
                    if(prevIndex != i){
                        if(prevIndex != null){
                            pointsGroup.children[prevIndex].material.color.set(pointColor)
                        }
                        pointsGroup.children[i].material.color.set(selectionColor)
                        pointPosition = pointsGroup.children[i].position
                        getDistanceToPoint()
                        prevIndex = i
                        if(legendCreated==true){
                            updateLegend(i)
                        }
                    }
                }
            }
        }else{
            if(prevIndex != null){
                pointsGroup.children[prevIndex].material.color.set(pointColor)
                prevIndex = null
                if(legendCreated == true){
                    clearLegend()
                }
            }
        }
    }
}

function createMeshes(){
    pointsGroup = new THREE.Group()
    if(newParticlesArray.length == 0){
        console.log("newParticlesArray is empty")
        for( var u = 0; u < particlesArray.length; u++){
            newParticlesArray[u] = particlesArray[u]
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(newParticlesArray, 3))
        console.log("newParticlesArray is " + newParticlesArray.length)
    }
    for( var i = 0 ; i < newParticlesArray.length /3 ; i+=3)
    {
        const pointX = newParticlesArray[i]
        const pointY = newParticlesArray[i+1]
        const pointZ = newParticlesArray[i+2]
        const sprite = new THREE.Sprite( new THREE.SpriteMaterial( { map: map, alphaMap: map, color: pointColor, transparent: true } ) );
        sprite.scale.set(pointGeometrySize*0.715, pointGeometrySize*0.715, 1)
        sprite.position.set(pointX,pointY,pointZ)
        pointsGroup.add(sprite)
    }
    scene.add(pointsGroup)
    raycasterInit()
    raycasterEnable = true
    if(enableLegendBool==true){
        createLegend(legendSize)
        legendCreated = true
    }
}

function deleteMeshes(){
    scene.remove(pointsGroup)
    raycasterEnable = false
    ctX.clearRect(0,0,guiX.width,guiX.height)
    ctY.clearRect(0,0,guiY.width,guiY.height)
    ctZ.clearRect(0,0,guiZ.width,guiZ.height)
}

function createLabels(xLabelName, yLabelName, zLabelName){
    var xLabelNameText = xLabelName
    var yLabelNameText = yLabelName
    var zLabelNameText = zLabelName
    if(( labelsCreated == false )&&(chartCreated == true)){
        fontLoader = new FontLoader();
        labelsGroup = new THREE.Group()
        labelSize = Ylength / 10
        xLabelMaterial = new THREE.MeshBasicMaterial({color: xAxisColor, transparent: true})
        yLabelMaterial = new THREE.MeshBasicMaterial({color: yAxisColor, transparent: true})
        zLabelMaterial = new THREE.MeshBasicMaterial({color: zAxisColor, transparent: true})
        xLabelNameMaterial = new THREE.MeshBasicMaterial({color: frameColor, transparent: true})
        yLabelNameMaterial = new THREE.MeshBasicMaterial({color: frameColor, transparent: true})
        zLabelNameMaterial = new THREE.MeshBasicMaterial({color: frameColor, transparent: true})
        fontLoader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            xLabelGeometry = new TextGeometry( 'X Axis', {
                font: font,
                size: labelSize,
                height: labelSize / 100,
                curveSegments: 12,
                bevelThickness: 0,
                bevelSize: 0,
                bevelEnabled: false
            })
            xLabelMesh = new THREE.Mesh(xLabelGeometry, xLabelMaterial)
            xLabelMesh.position.set(0,0,Zlength + labelSize * 1.5)
            xLabelMesh.rotateX(Math.PI*-0.5)
            labelsGroup.add(xLabelMesh)
        })
        fontLoader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            zLabelGeometry = new TextGeometry( 'Z Axis', {
                font: font,
                size: labelSize,
                height: labelSize / 100,
                curveSegments: 12,
                bevelThickness: 0,
                bevelSize: 0,
                bevelEnabled: false
            })
            zLabelMesh = new THREE.Mesh(zLabelGeometry, zLabelMaterial)
            zLabelMesh.position.set(Xlength + labelSize * 1.5,0,labelSize*4)
            zLabelMesh.rotateX(Math.PI*-0.5)
            zLabelMesh.rotateZ(Math.PI*0.5)
            labelsGroup.add(zLabelMesh)
        })
        fontLoader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            yLabelGeometry = new TextGeometry( 'Y Axis', {
                font: font,
                size: labelSize,
                height: labelSize / 100,
                curveSegments: 12,
                bevelThickness: 0,
                bevelSize: 0,
                bevelEnabled: false
            })
            yLabelMesh = new THREE.Mesh(yLabelGeometry, yLabelMaterial)
            yLabelMesh.position.set(0,Ylength,Zlength + labelSize * 1.5)
            yLabelMesh.rotateZ(Math.PI*0.5)
            yLabelMesh.rotateX(Math.PI*0.5)
            yLabelMesh.rotateZ(Math.PI)
            labelsGroup.add(yLabelMesh)
        })
        if(xLabelName != null){
            fontLoader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                xLabelNameGeometry = new TextGeometry( xLabelNameText, {
                    font: font,
                    size: labelSize*0.7,
                    height: labelSize / 100,
                    curveSegments: 12,
                    bevelThickness: 0,
                    bevelSize: 0,
                    bevelEnabled: false
                })
                xLabelNameMesh = new THREE.Mesh(xLabelNameGeometry, xLabelNameMaterial)
                xLabelNameMesh.position.set(0,0,Zlength + labelSize * 2.5)
                xLabelNameMesh.rotateX(Math.PI*-0.5)
                labelsGroup.add(xLabelNameMesh)
            })
        }
        if(yLabelName != null){
            fontLoader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                yLabelNameGeometry = new TextGeometry( yLabelNameText, {
                    font: font,
                    size: labelSize*0.7,
                    height: labelSize / 100,
                    curveSegments: 12,
                    bevelThickness: 0,
                    bevelSize: 0,
                    bevelEnabled: false
                })
                yLabelNameMesh = new THREE.Mesh(yLabelNameGeometry, yLabelNameMaterial)
                yLabelNameMesh.position.set(0,Ylength,Zlength + labelSize * 2.5)
                yLabelNameMesh.rotateZ(Math.PI*0.5)
                yLabelNameMesh.rotateX(Math.PI*0.5)
                yLabelNameMesh.rotateZ(Math.PI)
                labelsGroup.add(yLabelNameMesh)
            })
        }
        if(zLabelName != null){
            fontLoader.load( '../node_modules/three/examples/fonts/helvetiker_regular.typeface.json', (font) => {
                zLabelNameGeometry = new TextGeometry( zLabelNameText, {
                    font: font,
                    size: labelSize*0.7,
                    height: labelSize / 100,
                    curveSegments: 12,
                    bevelThickness: 0,
                    bevelSize: 0,
                    bevelEnabled: false
                })
                zLabelNameMesh = new THREE.Mesh(zLabelNameGeometry, zLabelNameMaterial)
                zLabelNameMesh.position.set(Xlength + labelSize * 2.5,0,labelSize*4)
                zLabelNameMesh.rotateX(Math.PI*-0.5)
                zLabelNameMesh.rotateZ(Math.PI*0.5)
                labelsGroup.add(zLabelNameMesh)
            })
        }
        scene.add(labelsGroup)
        labelsCreated = true
        updateFromCameraPosition()
        renderer.render(scene, camera)
    }
}

function deleteLabels(){
    if((labelsCreated == true)&&(chartCreated == true)){
        labelsCreated = false
        scene.remove(labelsGroup)
        renderer.render(scene, camera)
    }
}

function getDistanceToPoint(){
    var distanceX = Math.pow((camera.position.x - pointPosition.x),2)
    var distanceY = Math.pow((camera.position.y - pointPosition.y),2)
    var distanceZ = Math.pow((camera.position.z - pointPosition.z),2)
    distanceToPoint = pointGeometrySize*100/Math.sqrt(distanceX+distanceY+distanceZ)
    //console.log("x: "+ pointPosition.x*Xratio)
    //console.log("y: " + pointPosition.y*Yratio)
    //console.log("z: " + pointPosition.z*Zratio)
}

function createLegend(fontSizeInput, marginInput){
    console.log(fontSizeInput)
    if((marginInput=="")||(marginInput==null)){
        margin=0
    }else{
        margin=marginInput
    }
    if((fontSizeInput=="")||(fontSizeInput==null)){
        fontSize=14
    }else{
        fontSize=fontSizeInput
    }
    console.log(margin)
    guiX = document.createElement('canvas')
    guiX.className = "guiX"
    ctX = guiX.getContext('2d')
    guiX.width  = 150
    guiX.height = 25
    ctX.fillStyle="rgba(0,0,0,0)"
    ctX.fillRect(0,0,guiX.width,guiX.height)
    ctX.globalCompositeOperation = "source-over"
    guiX.style.position = "absolute"
    guiX.style.left = canvasRect.x + canvasParameters.width - guiX.width - margin + "px"
    guiX.style.top = canvasRect.y + "px"
    document.body.appendChild(guiX)
    guiY = document.createElement('canvas')
    guiY.className = "guiY"
    ctY = guiY.getContext('2d')
    guiY.width  = 150
    guiY.height = 25
    ctY.fillStyle="rgba(0,0,0,0)"
    ctY.fillRect(0,0,guiY.width,guiY.height)
    ctY.globalCompositeOperation = "source-over"
    guiY.style.position = "absolute"
    guiY.style.left = canvasRect.x + canvasParameters.width - guiY.width - margin + "px"
    guiY.style.top = canvasRect.y + guiX.height +"px"
    document.body.appendChild(guiY)
    guiZ = document.createElement('canvas')
    guiZ.className = "guiZ"
    ctZ = guiZ.getContext('2d')
    guiZ.width  = 150
    guiZ.height = 25
    ctZ.fillStyle="rgba(0,0,0,0)"
    ctZ.fillRect(0,0,guiZ.width,guiZ.height)
    ctZ.globalCompositeOperation = "source-over"
    guiZ.style.position = "absolute"
    guiZ.style.left = canvasRect.x + canvasParameters.width - guiZ.width - margin +"px"
    guiZ.style.top = canvasRect.y + guiX.height + guiY.height + "px"
    document.body.appendChild(guiZ)

    ctX.fillStyle = xAxisColor;
    ctX.font = "bold " +fontSize+ "px Arial";
    ctX.fillText("X axis: ", 1, (guiX.height / 2) + 4);
    ctY.fillStyle = yAxisColor;
    ctY.font = "bold " +fontSize+ "px Arial";
    ctY.fillText("Y axis: ", 1, (guiY.height / 2) + 4);
    ctZ.fillStyle = zAxisColor;
    ctZ.font = "bold " +fontSize+ "px Arial";
    ctZ.fillText("Z axis: ", 1, (guiZ.height / 2) + 4);
}

function updateLegend(i){
    ctX.clearRect(guiX.width/3,0,guiX.width,guiX.height)
    ctX.fillStyle="rgba(0,0,0,0)"
    ctX.fillRect(0,0,guiX.width,guiX.height)
    ctX.fillStyle = legendColor;
    ctX.font = "bold "+fontSize+"px Arial";
    var xViewValueRaw = pointsGroup.children[i].position.x * Xratio
    var xViewValue = xViewValueRaw.toFixed(3)
    ctX.fillText("               " + xViewValue, 1, (guiX.height / 2) + 4);
    ctY.clearRect(guiY.width/3,0,guiY.width,guiY.height)
    ctY.fillStyle="rgba(0,0,0,0)"
    ctY.fillRect(0,0,guiX.width,guiX.height)
    ctY.fillStyle = legendColor;
    ctY.font = "bold "+fontSize+"px Arial";
    var yViewValueRaw = pointsGroup.children[i].position.y * Yratio
    var yViewValue = yViewValueRaw.toFixed(3)
    ctY.fillText("               " + yViewValue, 1, (guiX.height / 2) + 4);
    ctZ.clearRect(guiZ.width/3,0,guiZ.width,guiZ.height)
    ctZ.fillStyle="rgba(0,0,0,0)"
    ctZ.fillRect(0,0,guiX.width,guiX.height)
    ctZ.fillStyle = legendColor;
    ctZ.font = "bold "+fontSize+"px Arial";
    var zViewValueRaw = pointsGroup.children[i].position.z * Zratio
    var zViewValue = zViewValueRaw.toFixed(3)
    ctZ.fillText("               " + zViewValue, 1, (guiX.height / 2) + 4);
}
function clearLegend(){
    ctX.clearRect(guiX.width/3,0,guiX.width,guiX.height)
    ctY.clearRect(guiY.width/3,0,guiY.width,guiY.height)
    ctZ.clearRect(guiZ.width/3,0,guiZ.width,guiZ.height)
}
function enableLegend(size, color){
    enableLegendBool = true
    legendSize = size
    legendColor = color
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~CREATE RANDOM INFO
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
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*createChart("canvas1", "rgb(25, 25, 25)", 5, 5, 5)
createWalls("#FFFFFF")
createGrid(10,10,10, "rgb(255,255,255)")
createFrame("rgb(255, 255, 255)")
activateControls()
createLabels("Temperatura (C)", "Humedad (%)", "Tiempo (S)")
var mappedInfoOutput =  loadInfo(originalInfo[2].info3, 3, "varX", "varY", "varZ", "rgb(212, 127, 30)", 50, "rgb(255,255,255)")*/
/*createChart("canvas1", "rgb(138, 146, 219)", 5, 5, 5)
createWalls("#000000")
createGrid(10,10,10, "rgb(0,0,0)")
createFrame("rgb(0,0,0)","rgb(255, 130, 41)","rgb(58, 214, 94)","rgb(166, 58, 155)",)
activateControls()
createLabels("Temperatura", "Humedad", "Tiempo")
var mappedInfoOutput =  loadInfo(originalInfo[2].info3, 3, "varX", "varY", "varZ", "rgb(255, 255, 255)", 50, "rgb(255,0,0)")
addAxisSliders("#6666FF",true)
enableLegend(14,"rgb(255,255,255)")*/

const tick = () =>
{
    camera.lookAt(chartCenter)
    controls.update()
    updateFromCameraPosition()
    renderer.render(scene,camera)
    window.requestAnimationFrame(tick)
}

export{createChart,createWalls,deleteWalls,createGrid,deleteGrid,createFrame,deleteFrame,activateControls,deactivateControls,loadInfo, createLabels,deleteLabels,addAxisSliders,deleteAxisSliders,enableLegend}