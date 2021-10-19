import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';
import Animation from './animation.js';
import GlslCanvas from 'glslCanvas';

//basics
let renderer, scene, camera;
let automaticRotationContainer, controlledRotationContainer, lightGroup;
let cameraPlaneDimensions = new THREE.Vector2(1, window.innerWidth / window.innerHeight);

//screen
let pixelRatio = window.devicePixelRatio || 1;
const w  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const h = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
const aspect = w/h;

//model rotations
let model, loader;
let clicking = false;
let moving = false;
let moved = false;
let iniClickPos = new THREE.Vector3(1, 1, -30);
let newClickPos = new THREE.Vector3(0, 0, -30);
let crossVector = new THREE.Vector3(30, 30, 30);
let drag, rotationAngle;

//raycaster & animations
let animations, player, clock;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(1, 1);
let index = 0;
let name;
let run = true;
let intersection = {};
let scroll=0;
let sectionNames = [0, 'Tags/interfaces', 'Tags/3dart', 'Tags/augmentedreality', 'Tags/development', 'Tags/design', 'Tags/experiences', 'About/index'];

//labels
let canvas;
let sections;
let whiteMat, blueMat, redMat, intersectedObject;

//GUI
const params = {
    roughness: 1.0,
    metalness: 0.2,
    exposure: 1.0,
    matcol: [ 244, 244, 244 ],
    size: 25,
    col1: [255, 3, 8],
    col2: [200, 255, 0],
    col3: [0, 255, 251],
};
let materialcolor = new THREE.Color(`rgb(` + params.matcol[0] + `,` + params.matcol[1] + `,` + params.matcol[2] + `)`);
let playButton, guiContainer, gui;
let playOpen = false;

//camera movement
//let cameraMixer = THREE.AnimationMixer(camera);
//let tracks = THREE.KeyrameTrack('closeupTracks', )
//let cameraClip = THREE.AnimationClip('closeup', 1, tracks)
let decoy = new THREE.Object3D();
let decoyWorldPos = new THREE.Vector3(0, 8, 0);
let hovering = false;

//Background

let body = document.querySelector("#body");
let threeCanvas = document.querySelector('#c');
let BKGcanvas = document.createElement("canvas");
BKGcanvas.classList.add("glslCanvas");
BKGcanvas.classList.add("bg");
body.insertBefore(BKGcanvas, threeCanvas);
let sandbox = new GlslCanvas(BKGcanvas);
let string_frag_code;

let bkg = `(0.95, 0.95, 0.95, 1.)`;


let secciones = ['Design', 'Interfaces', '3D Art', 'Augmented Reality', 'Development', 'Design', 'Experiences', 'Who I Am'];



function init() {

    //Renderer - scene
    
    canvas = document.querySelector('#c');
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.outputEncoding = THREE.sRGBEncoding;
    
    sections = document.querySelector('#sections');

    sections.style.visibility = "hidden";       
    

    

    clock = new THREE.Clock();
    const colorBKG = new THREE.Color(0xF2F2F2);
    scene = new THREE.Scene();
    scene.background = null;


    //Camera

    camera = new THREE.PerspectiveCamera(50, aspect, 1, 1000);
    camera.position.set(0, 0, -40);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    if(w>980){
        decoyWorldPos.x = 7;
        decoyWorldPos.y = 0;
        camera.position.x = 7;
        camera.position.y = 0;
        camera.position.z = -30;
    } else if(w>736){
        decoyWorldPos.x = 3;
        decoyWorldPos.y = 0;
        camera.position.x = 3;
        camera.position.y = 0;
        camera.position.z = -35;
    };

    //Lights

    lightGroup = new THREE.Object3D();
    scene.add(lightGroup);

    const ambient = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add(ambient);

    let spot = new THREE.SpotLight(0xFFFFFF, 0.8, 50, Math.PI / 6);
    spot.position.set(0, 0, -20);
    spot.rotation.x = Math.PI / 2;
    scene.add(spot);

    //Background
    
    // whiteMat = new THREE.MeshPhongMaterial({
    //     color: materialcolor,
    //     flatShading: false,
    // });
    whiteMat= new THREE.MeshStandardMaterial( {
        metalness: params.roughness,
        roughness: params.metalness,
    } );

    blueMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0x0505FF),
        flatShading: false,
        wireframe: true,
    });
    redMat = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0xFF034E),
        flatShading: false,
        wireframe: true,
    });

    //Model

    controlledRotationContainer = new THREE.Object3D();
    automaticRotationContainer = new THREE.Object3D();

    loader = new GLTFLoader();
    loader.load('/assets/js/nahbaste.glb', function (gltf) {

        model = gltf.scene.children[0];
        animations = gltf.animations;

        model.traverse(function (child) {
            child.material = whiteMat;
        });

        player = new Animation(model, animations);
        automaticRotationContainer.add(gltf.scene);
    }, undefined, function (error) {
        console.error(error);
    });

    automaticRotationContainer.rotation.x = - Math.PI / 16;
    automaticRotationContainer.rotation.z = - Math.PI / 6;
    automaticRotationContainer.rotation.y = Math.PI / 3;

    controlledRotationContainer.add(automaticRotationContainer);
    scene.add(controlledRotationContainer);

    //GUI

    guiContainer = document.querySelector('#play');
    playButton = document.querySelector('#playButton');    

    //camera animation
    automaticRotationContainer.add(decoy);

    //Events
    playButton.addEventListener('click', launchPlay);
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('touchend', onTouchEnd);
    window.addEventListener("scroll", (event) => {
        scroll = window.scrollY;
    });
}

function launchPlay(){
    if(!playOpen){
        gui = new GUI({autoPlace: false});
        guiContainer.appendChild(gui.domElement);
        let modelFolder = gui.addFolder('Model');
        let BKGFolder = gui.addFolder('Background');

	    modelFolder.add( params, 'roughness', 0, 1, 0.01 );
	    modelFolder.add( params, 'metalness', 0, 1, 0.01 );
        modelFolder.add( params, 'exposure', 0, 2, 0.01 );
        modelFolder.addColor( params, 'matcol');
        modelFolder.open();
        let sizeControl = BKGFolder.add( params, 'size', 1.01, 50.01, 0.01);
        let col1Control = BKGFolder.addColor( params, 'col1');
        let col2Control = BKGFolder.addColor( params, 'col2');
        let col3Control = BKGFolder.addColor( params, 'col3');

        BKGFolder.open();
        gui.open();
        
        sizeControl.onFinishChange(()=>drawBackground());
        col1Control.onFinishChange(()=>drawBackground());
        col2Control.onFinishChange(()=>drawBackground());
        col3Control.onFinishChange(()=>drawBackground());

        playOpen = !playOpen;
    } else {
        guiContainer.removeChild(gui.domElement);
        playOpen = !playOpen;
    }
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    cameraPlaneDimensions.y = window.innerWidth / window.innerHeight;
    if (!browser.mobile){
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.updateProjectionMatrix();
    }
}

function makeIntIntoFP(num){
    let result = (Math.round(num * 100) / 100).toFixed(2);
    return result;
}

function drawBackground(){
    string_frag_code = `#ifdef GL_ES\n precision mediump float;\n #endif\n uniform float u_time;\n uniform vec2 u_resolution;\n float makePoint(float x,float y,float speedx,float speedy,float amplitudx,float amplitudy,float t){\n  float xx=x+sin(t*speedx)*amplitudx;\n float yy=y+cos(t*speedy)*amplitudy;\n  return 1.0/sqrt(xx*xx+yy*yy);\n } \n void main(){\n  vec2 p = (gl_FragCoord.xy/u_resolution.x)*2.0-vec2(1.0,u_resolution.y/u_resolution.x);\n p=p*2.0;\n vec4 gray = vec4` + bkg +`;\n vec3 rojo = vec3(` + makeIntIntoFP(params.col1[0]/255) + `,` + makeIntIntoFP(params.col1[1]/255) + `,` + makeIntIntoFP(params.col1[2]/255) + `);\n rojo = 0.95-rojo;\n vec3 verde = vec3(` + makeIntIntoFP(params.col2[0]/255) + `,` + makeIntIntoFP(params.col2[1]/255) + `,` + makeIntIntoFP(params.col2[2]/255) + `);\n verde = 0.95-verde;\n vec3 cel = vec3(` + makeIntIntoFP(params.col3[0]/255) + `,` + makeIntIntoFP(params.col3[1]/255) + `,` + makeIntIntoFP(params.col3[2]/255) + `);\n cel = 0.95-cel;\n float x=p.x;\n float y=p.y;\n float time = u_time;\n float a=\n makePoint(x,y,0.03,0.09,1.7,1.3,time+200.);\n a=a+makePoint(x,y,0.09,0.02,1.,1.,time);\n  a=a+makePoint(x,y,0.08,0.07,1.4,1.5,time+200.+200.);\n a=a+makePoint(x,y,0.03,0.08,1.7,1.5,time+900.+200.);\n a=a+makePoint(x,y,0.11,0.1,1.,1.9,time+300.);\n float b=\n makePoint(x,y,0.02,0.09,1.3,1.3,time+200.);\n b=b+makePoint(x,y,0.07,0.07,1.4,1.4,time);\n b=b+makePoint(x,y,0.14,0.06,1.4,1.5,time+200.+200.);\n b=b+makePoint(x,y,0.03,0.08,1.7,1.5,time+900.+200.);\n b=b+makePoint(x,y,0.11,0.1,1.,1.9,time+300.);\n float c=\n makePoint(x,y,0.07,0.03,1.3,1.3,time+200.);\n c=c+makePoint(x,y,0.09,0.03,1.4,1.4,time);\n c=c+makePoint(x,y,0.08,0.09,1.4,1.5,time+200.+200.);\n c=c+makePoint(x,y,0.03,0.08,1.7,1.5,time+900.+200.);\n c=c+makePoint(x,y,0.11,0.1,1.,1.9,time+300.);\n float total = a+b+c;\n float t1 = a+b;\n float t2 = a+c;\n float t3 = b+c;\n float size = ` + (makeIntIntoFP(params.size)) + `;\n float componentX = float((a*rojo.x)/t3 + verde.x*b/t2 + cel.x*c/t1)/size;\n float componentY = float(rojo.y*a/t3 + verde.y*b/t2 + cel.y*c/t1)/size;\n float componentZ = float(rojo.z*a/t3 + verde.z*b/t2 + cel.z*c/t1)/size;\n vec4 col = gray - vec4(componentX,componentY,componentZ,0.001);\n gl_FragColor = col;\n } \n`;
    sandbox.load(string_frag_code);
}

function onPointerDown(event) {

    if (event.isPrimary === false) return;
    if(event.clientY + scroll < h){
        clicking = true;

        if(hovering){
            let i = intersection[0].object.name.charAt(8);

            window.location.href = './' + sectionNames[i] +'.html';
        }
    }

    iniClickPos.x = cameraPlaneDimensions.x * event.clientX / window.innerWidth;
    iniClickPos.y = cameraPlaneDimensions.y * event.clientY / window.innerHeight;

}

function onPointerMove(event) {

    event.preventDefault();

    if (clicking) {

        newClickPos.x = cameraPlaneDimensions.x * event.clientX / window.innerWidth;
        newClickPos.y = cameraPlaneDimensions.y * event.clientY / window.innerHeight;
        rotationAngle = Math.abs(iniClickPos.angleTo(newClickPos));
        crossVector.crossVectors(iniClickPos, newClickPos);
        crossVector.normalize();
        drag = newClickPos.distanceTo(iniClickPos);
        drag = clamp(drag, 0, 1);
        moving = true;
        moved = true;
    };

    if(document.querySelector('.is-menu-visible')){
        mouse.x = 0;
        mouse.y = 0;
    } else{
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - ((event.clientY + scroll)/ window.innerHeight) * 2 + 1;
    }
};

function onPointerUp() {

    if (event.isPrimary === false) return;
    iniClickPos.x = 0;
    iniClickPos.y = 0;
    newClickPos.x = 0;
    newClickPos.y = 0;
    clicking = false;
    moving = false;
}

function onTouchEnd(){
    iniClickPos.x = 0;
    iniClickPos.y = 0;
    newClickPos.x = 0;
    newClickPos.y = 0;
    mouse.x = 0;
    mouse.y = 0;
    clicking = false;
    moving = false;
}

function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}

function easeOutQuad(x) {
    return 1 - (1 - x) * (1 - x);
}

function clamp(x, min, max) {
    return Math.max(min, Math.min(x, max));
}

function appear(index){
    sections.innerHTML = secciones[index];
    sections.style.visibility = '';
    sections.style.display = 'none';
    function go(){
        sections.style.display = '';
    }
    setTimeout( go, 50);
}

function disappear(index){
    sections.style.display = '';
    sections.style.visibility = 'hidden';  
}

function animate() {

    requestAnimationFrame(animate);

    //model rotation
    if (!moved) {
        automaticRotationContainer.rotation.x -= 0.00035;
        automaticRotationContainer.rotation.y -= 0.00035;
    } else if (!moving) {
        drag -= 0.001;
        drag = clamp(drag, 0, 1);
        controlledRotationContainer.rotateOnWorldAxis(crossVector, -10 * easeOutQuad(drag) * rotationAngle);
    }
    if (clicking && moving) {
        controlledRotationContainer.rotateOnWorldAxis(crossVector, -10 * easeOutSine(drag) * rotationAngle);
    };

    //model raycaster
    raycaster.setFromCamera(mouse, camera);
    intersection = raycaster.intersectObject(automaticRotationContainer, true);


    if (run && intersection.length > 0) {
        intersectedObject = intersection[0].object;
        name = intersection[0].object.name;
        index = name.charAt(8);
        
        appear(index);
        
        hovering = true;
        intersection[0].object.material = blueMat;
        if (index != 7) {
            player.playClipByIndex(index - 1);
        }
        run = false;
    } else if (!run && intersection.length == 0) {
        hovering = false;
        intersectedObject.material = whiteMat;
        if (index != 7) {
            player.playClipReverseByIndex(index - 1);
        }
        disappear(index);
        run = true;
    } else if (!run && intersection.length > 0) {
        hovering = true;
        name = intersection[0].object.name;
        if (index != name.charAt(8)) {
            intersectedObject.material = whiteMat;

            disappear(index);
            appear(name.charAt(8))
            if (index != 7) {
                player.playClipReverseByIndex(index - 1);
            }
            index = name.charAt(8);
            if (intersection[0].object.name.charAt(8) != 7) {
                player.playClipByIndex(index - 1);
            }
            intersectedObject = intersection[0].object;
            intersectedObject.material = blueMat;
        }
    }

    //animation updates
    let mixerUpdateDelta = clock.getDelta();
    if (model) { 
        player.update(mixerUpdateDelta) 
        materialcolor.setRGB(params.matcol[0]/255, params.matcol[1]/255, params.matcol[2]/255);
        model.material.color = materialcolor;
        model.material.roughness = params.roughness;
        model.material.metalness = params.metalness;
    };
    
    renderer.toneMappingExposure = params.exposure;
    camera.lookAt(decoyWorldPos);
    renderer.render(scene, camera);
}

drawBackground();
init();
animate();