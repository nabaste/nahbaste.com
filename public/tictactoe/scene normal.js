import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

//basics
let renderer, scene, camera;
let canvas = document.querySelector('#c');
let button = document.querySelector('.button');
let spot1, spot2, spot3, spot4;


//screen
let pixelRatio = window.devicePixelRatio || 1;
const w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
const h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
const aspect = w / h;

//GUI
const params = {
    separationX: 4.2,
    separationY: 4.2,
    separationZ: 4.2,
    wireframe: 0,
    size: 4,
};
let guiContainer, gui;

//tic-tac-toe
let isPlaying = true;
let isASquareSelected = false;
let checkerAmount = params.size;
let checkerSize = 2;
let checkerSeparations = [params.separationX, params.separationY, params.separationZ];
let checkers = [];
let checkersContainer,checkersExclusiveContainer;
let loader, model;
let planeMaterial, planeMaterialOnHover, shaderMaterial;

let squareOcupations = [];
for (let i = 0; i < checkerAmount; i++) {
    squareOcupations[i] = []
    for (let j = 0; j < checkerAmount; j++) {
        squareOcupations[i][j] = []
        for (let k = 0; k < checkerAmount; k++) {
            squareOcupations[i][j][k] = 0;
        }
    }
};

let gameCenter = new THREE.Vector3();
let idleColor = new THREE.Color(0x0505FF);


//interaction
const raycaster = new THREE.Raycaster();
let intersection;
const mouse = new THREE.Vector2(1, 1);
let hovering = false;
let started = false;
let intersectedObject;
let selectedObject;


//players
let playerInPlay = 1;
let turn = 1;
let sphereActions = [];
let spheres = [];
let crossActions = [];
let crosses = [];
let sphereMaterial, sphereGeometry, crossMaterial, crossGeometry, planeGeometry;
let sphereContainer, crossContainer;

let extension = (browser.name == "safari") ? `#extension GL_OES_standard_derivatives : enable` : ``;

//shader

let vertexShader = `
    varying vec2 vUv;
    void main()	{
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;
let fragmentShader = ` `+ 
		extension +
    `
    varying vec2 vUv;
    uniform float thickness;
   	
    float edgeFactor(vec2 p){
    	vec2 grid = abs(fract(p - 0.5) - 0.5) / fwidth(p) / thickness;
  		return min(grid.x, grid.y);
    }
    
    void main() {
			
      float a = edgeFactor(vUv);
      
      vec3 c = mix(vec3(0.0196, 0.0196, 1), vec3(1), a);
      
      gl_FragColor = vec4(c, 1.0);
    }
  `;


function init() {

    //Renderer - scene
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;


    const colorBKG = new THREE.Color(0x000000);
    scene = new THREE.Scene();


    scene.background = null;





    //Camera
    camera = new THREE.PerspectiveCamera(50, aspect, 1, 1000);
    camera.position.set(-50, 20, -50);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1;
    controls.maxDistance = 100;
    // controls.enabled = false;

    //Lights
    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.3);
    scene.add(ambient);

    spot1 = new THREE.SpotLight(0xFFFFFF, 1, 400, Math.PI / 6);
    spot1.position.set(0, 0, -lightPositioner(params.separationZ));
    spot1.rotation.x = Math.PI / 2;
    spot1.castShadow = true;
    scene.add(spot1);

    spot2 = new THREE.SpotLight(0xFFFFFF, 1, 400, Math.PI / 6);
    spot2.position.set(0, 0, lightPositioner(params.separationZ));
    spot2.rotation.x = Math.PI;
    spot2.castShadow = true;
    scene.add(spot2);

    spot3 = new THREE.SpotLight(0xFFFFFF, 1, 400, Math.PI / 6);
    spot3.position.set(0, lightPositioner(params.separationY), 0);
    spot3.castShadow = true;
    scene.add(spot3);

    spot4 = new THREE.SpotLight(0xFFFFFF, 1, 400, Math.PI / 6);
    spot4.position.set(0, -lightPositioner(params.separationY), 0);
    spot2.rotation.x = -Math.PI;
    spot4.castShadow = true;
    scene.add(spot4);

    //checkers
    checkersContainer = new THREE.Object3D();
    checkersExclusiveContainer = new THREE.Object3D();
    checkersContainer.add(checkersExclusiveContainer);
    scene.add(checkersContainer);

    // const planeGeometry = new THREE.PlaneGeometry(checkerSize, checkerSize);
    planeGeometry = new THREE.BoxGeometry(checkerSize, checkerSize, checkerSize);
    planeMaterial = new THREE.MeshBasicMaterial({ color: idleColor, side: THREE.DoubleSide, transparent: true, opacity: 0.3, wireframe: true });
    planeMaterialOnHover = new THREE.MeshBasicMaterial({ color: idleColor, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });

    shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            thickness: {
                value: 1.5
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
    });

    for (let i = 0; i < checkerAmount; i++) {
        checkers[i] = []
        for (let j = 0; j < checkerAmount; j++) {
            checkers[i][j] = []
            for (let k = 0; k < checkerAmount; k++) {
                if (browser.os == "ios") {
                    checkers[i][j][k] = new THREE.Mesh(planeGeometry, planeMaterial)
                } else {
                    checkers[i][j][k] = new THREE.Mesh(planeGeometry, shaderMaterial);
                }

                checkers[i][j][k].position.set(checkerSeparations[0] * i, checkerSeparations[1] * j, checkerSeparations[2] * k);
                checkersExclusiveContainer.add(checkers[i][j][k]);

            }
        }
    };

    updateCheckerContainerPosition();

    //players
    // sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xFF034E });
    sphereMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFF034E, clearcoat: 0.9 });
    sphereGeometry = new THREE.SphereGeometry(1, 20, 20);

    loader = new GLTFLoader();
    loader.load('/tictactoe/cross.glb', function (gltf) {

        model = gltf.scene.children[0];
        crossGeometry = model.geometry;

    }, undefined, function (error) {
        console.error(error);
    });

    // crossMaterial = new THREE.MeshBasicMaterial({ color: 0x00fffb });
    crossMaterial = new THREE.MeshPhysicalMaterial({ color: 0x00fffb, clearcoat: 0.8 });

    sphereContainer = new THREE.Object3D();
    crossContainer = new THREE.Object3D();
    checkersContainer.add(sphereContainer);
    checkersContainer.add(crossContainer);

    //gui
    gui = new GUI({ autoPlace: false });
    guiContainer = document.querySelector('#play');
    guiContainer.appendChild(gui.domElement);

    let separationXControl = gui.add(params, 'separationX', 2, 10, 0.01);
    let separationYControl = gui.add(params, 'separationY', 2, 10, 0.01);
    let separationZControl = gui.add(params, 'separationZ', 2, 10, 0.01);
    let materialToggleControl = gui.add(params, 'wireframe', 0, 1, 1);
    let sizeControl = gui.add(params, 'size', 2, 9, 1);

    //Listeners
    separationXControl.onFinishChange(() => updateCheckerPos(0));
    separationYControl.onFinishChange(() => updateCheckerPos(1));
    separationZControl.onFinishChange(() => updateCheckerPos(2));
    materialToggleControl.onFinishChange(() => toggleMaterial());
    sizeControl.onFinishChange(()=>reset());

    enableListeners();

    controls.addEventListener('change', disableListeners);
    controls.addEventListener('end', enableListeners);

}

function enableListeners() {
    if (browser.mobile) {
        canvas.addEventListener('touchstart', onTouchStart);
        // canvas.addEventListener('touchend', onPointerOrTouchInteraction);
    } else {
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerdown', onPointerOrTouchInteraction);
    }
    button.addEventListener('click', reset);
}

function disableListeners() {
    if (browser.mobile) {
        canvas.removeEventListener('touchstart', onTouchStart);
        // canvas.removeEventListener('touchend', onPointerOrTouchInteraction);
    } else {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerdown', onPointerOrTouchInteraction);
    }
    button.removeEventListener('click', reset);
}

function checkVictory(lastMoveX, lastMoveY, lastMoveZ, player) {
    if (turn < ((checkerAmount * 2 ) - 1)) return 0;

    // column
    for (let i = 0; i < checkerAmount; i++) {
        if (squareOcupations[lastMoveX][i][lastMoveZ] != player) {
            break
        };
        if (i == checkerAmount - 1) {
            console.log(0);
            return player;
        }
    }

    // row
    for (let i = 0; i < checkerAmount; i++) {
        if (squareOcupations[i][lastMoveY][lastMoveZ] != player) {
            break
        };
        if (i == checkerAmount - 1) {
            console.log(1);
            return player;
        }
    }

    // depth
    for (let i = 0; i < checkerAmount; i++) {
        if (squareOcupations[lastMoveX][lastMoveY][i] != player) {
            break
        };
        if (i == checkerAmount - 1) {
            console.log(2);
            return player;
        }
    }

    // X diagonal
    if (lastMoveY == lastMoveZ) {
        for (let i = 0; i < checkerAmount; i++) {
            if (squareOcupations[lastMoveX][i][i] != player) {
                break
            };
            if (i == checkerAmount - 1) {
                console.log(3);
                return player;
            }
        }
    };

    // y diagonal
    if (lastMoveX == lastMoveZ) {
        for (let i = 0; i < checkerAmount; i++) {
            if (squareOcupations[i][lastMoveY][i] != player) {
                break
            };
            if (i == checkerAmount - 1) {
                console.log(4);
                return player;
            }
        }
    }

    // z diagonal
    if (lastMoveX == lastMoveY) {
        for (let i = 0; i < checkerAmount; i++) {
            if (squareOcupations[i][i][lastMoveZ] != player) {
                break
            };
            if (i == checkerAmount - 1) {
                console.log(5);
                return player;
            }
        }
    }

    //x counter diagonal
    if (lastMoveY + lastMoveZ == checkerAmount - 1) {
        for (let i = 0; i < checkerAmount; i++) {
            if (squareOcupations[lastMoveX][i][checkerAmount - 1 - i] != player) {
                break
            };
            if (i == checkerAmount - 1) {
                console.log(6);
                return player;
            }
        }
    }

    // y counter diagonal
    if (lastMoveX + lastMoveZ == checkerAmount - 1) {
        for (let i = 0; i < checkerAmount; i++) {
            if (squareOcupations[i][lastMoveY][checkerAmount - 1 - i] != player) {
                break
            };
            if (i == checkerAmount - 1) {
                console.log(7);
                return player;
            }
        }
    }

    // z counter diagonal
    if (lastMoveX + lastMoveY == checkerAmount - 1) {
        for (let i = 0; i < checkerAmount; i++) {
            if (squareOcupations[i][checkerAmount - 1 - i][lastMoveZ] != player) {
                break
            };
            if (i == checkerAmount - 1) {
                console.log(8);
                return player;
            }
        }
    }

    // first weird diagonal
    for (let i = 0; i < checkerAmount; i++) {
        if (squareOcupations[i][i][i] != player) {
            break
        };
        if (i == checkerAmount - 1) {
            console.log(9);
            return player;
        }
    }

    // second weird diagonal
    for (let i = 0; i < checkerAmount; i++) {
        if (squareOcupations[checkerAmount - 1 - i][checkerAmount - 1 - i][i] != player) {
            break;
        }
        if (i == checkerAmount - 1) {
            console.log(10);
            return player;
        }
    }

    // third weird diagonal
    for (let i = 0; i < checkerAmount; i++) {
        if (squareOcupations[checkerAmount - 1 - i][i][i] != player) {
            break;
        }
        if (i == checkerAmount - 1) {
            console.log(11);
            return player;
        }
    }

    // fourth weird diagonal
    for (let i = 0; i < checkerAmount; i++) {
        if (squareOcupations[i][checkerAmount - 1 - i][i] != player) {
            break;
        }
        if (i == checkerAmount - 1) {
            console.log(12);
            return player;
        }
    }
}

function updateMovePositions() {
    for (let i = 0; i < spheres.length; i++) {
        spheres[i].position.set(checkerSeparations[0] * sphereActions[i][0], checkerSeparations[1] * sphereActions[i][1], checkerSeparations[2] * sphereActions[i][2]);
    }
    for (let i = 0; i < crosses.length; i++) {
        crosses[i].position.set(checkerSeparations[0] * crossActions[i][0], checkerSeparations[1] * crossActions[i][1], checkerSeparations[2] * crossActions[i][2]);
    }
}

function updateCheckerContainerPosition() {

    gameCenter.x = params.separationX * ((checkerAmount - 1) / 2);
    gameCenter.y = params.separationY * ((checkerAmount - 1) / 2);
    gameCenter.z = params.separationZ * ((checkerAmount - 1) / 2);


    checkersContainer.position.set(-gameCenter.x, -gameCenter.y, -gameCenter.z);
}

function updateCheckerPos(axis) {


    checkerSeparations[0] = params.separationX;
    checkerSeparations[1] = params.separationY;
    checkerSeparations[2] = params.separationZ;

    let i = [];

    for (i[0] = 0; i[0] < checkerAmount; i[0]++) {
        for (i[1] = 0; i[1] < checkerAmount; i[1]++) {
            for (i[2] = 0; i[2] < checkerAmount; i[2]++) {
                checkers[i[0]][i[1]][i[2]].position.setComponent(axis, 0);
                checkers[i[0]][i[1]][i[2]].position.setComponent(axis, checkerSeparations[axis] * i[axis]);
            }
        }
    }

    checkersContainer.translateX(gameCenter.x);
    checkersContainer.translateY(gameCenter.y);
    checkersContainer.translateZ(gameCenter.z);

    updateCheckerContainerPosition();
    updateMovePositions();
    updateLightPositions();
}

function updateUI(result) {
    let turnCounter = document.querySelector("#turn-counter");
    let toPlay = document.querySelector("#to-play");
    let next;
    if (result == 0 || result == undefined) {
        next = (playerInPlay == 1) ? 'Sphere' : 'Cross';

        turnCounter.innerHTML = "Turn: " + turn;
        toPlay.innerHTML = next + " to play";
    } else if (result == 1 || result == 2) {
        next = (result == 1) ? 'Sphere' : 'Cross';
        turnCounter.innerHTML = "Turn: " + turn;
        toPlay.innerHTML = next + " wins.";
        isPlaying = false;
    }

}
function updateLightPositions(){
    spot1.position.set(0, 0, -lightPositioner(params.separationY));
    spot2.position.set(0, 0, lightPositioner(params.separationY));
    spot3.position.set(0, lightPositioner(params.separationY), 0);
    spot4.position.set(0, -lightPositioner(params.separationY), 0);
};

function lightPositioner(separation){
    let coord = ((params.size -1) * separation + checkerSize ) * (0.5 * params.size);
    return coord;
}

function reset() {

    checkerAmount = params.size;

    for (let i = 0; i < checkerAmount; i++) {
        squareOcupations[i] = []
        for (let j = 0; j < checkerAmount; j++) {
            squareOcupations[i][j] = []
            for (let k = 0; k < checkerAmount; k++) {
                squareOcupations[i][j][k] = 0;
            }
        }
    };

    crosses.length = 0
    playerInPlay = 1;
    turn = 1;
    sphereActions.length = 0;
    spheres.length = 0;
    crossActions.length = 0;
    crosses.length = 0;
    checkers.length = 0

    updateUI(0);

    selectedObject = null;

    sphereContainer.clear();
    crossContainer.clear();
    checkersContainer.clear();
    checkersExclusiveContainer.clear();
    checkersContainer.add(checkersExclusiveContainer);
    checkersContainer.add(sphereContainer);
    checkersContainer.add(crossContainer);

    for (let i = 0; i < checkerAmount; i++) {
        checkers[i] = []
        for (let j = 0; j < checkerAmount; j++) {
            checkers[i][j] = []
            for (let k = 0; k < checkerAmount; k++) {
                if (browser.os == "ios") {
                    checkers[i][j][k] = new THREE.Mesh(planeGeometry, planeMaterial)
                } else {
                    checkers[i][j][k] = new THREE.Mesh(planeGeometry, shaderMaterial);
                }
                checkers[i][j][k].position.set(checkerSeparations[0] * i, checkerSeparations[1] * j, checkerSeparations[2] * k);
                checkersExclusiveContainer.add(checkers[i][j][k]);

            }
        }
    };

    updateCheckerContainerPosition();
    updateLightPositions();
    isPlaying = true;

}

function onTouchStart(evt) {

    mouse.x = (evt.touches[0].pageX / window.innerWidth) * 2 - 1;
    mouse.y = - ((evt.touches[0].pageY) / window.innerHeight) * 2 + 1;
    onPointerOrTouchInteraction(evt);
}

function onPointerMove(event) {

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - ((event.clientY) / window.innerHeight) * 2 + 1;
}

function onPointerOrTouchInteraction(evt) {

    if (evt.isPrimary === false) return;


    if (hovering && isPlaying) {
        let pos = intersection[0].object.position;
        let coord = [pos.x / checkerSeparations[0], pos.y / checkerSeparations[1], pos.z / checkerSeparations[2]];
        if (!isASquareSelected && squareOcupations[coord[0]][coord[1]][coord[2]] == 0) {
            selectedObject = intersectedObject;
            selectedObject.material = planeMaterialOnHover;
            isASquareSelected = true;
        } else if (playerInPlay == 1 && isASquareSelected && selectedObject == intersection[0].object) {
            //create move
            spheres[sphereActions.length] = new THREE.Mesh(sphereGeometry, sphereMaterial);

            spheres[sphereActions.length].position.copy(pos);
            sphereContainer.add(spheres[sphereActions.length]);

            //clear checker
            selectedObject.visible = false;
            isASquareSelected = false;

            //record move
            sphereActions.push(coord);
            squareOcupations[coord[0]][coord[1]][coord[2]] = 1;

            playerInPlay++;
            turn++;

            let result = checkVictory(coord[0], coord[1], coord[2], 1);
            updateUI(result);
        } else if (playerInPlay == 2 && isASquareSelected && selectedObject == intersection[0].object) {

            //create move
            crosses[crossActions.length] = new THREE.Mesh(crossGeometry, crossMaterial);
            crosses[crossActions.length].position.copy(pos);
            // crosses[crossActions.length].castShadow = true;
            // crosses[crossActions.length].receiveShadow = true;
            crossContainer.add(crosses[crossActions.length]);

            //clear checker
            selectedObject.visible = false;
            isASquareSelected = false;

            //record move
            crossActions.push(coord);
            squareOcupations[coord[0]][coord[1]][coord[2]] = 2;

            playerInPlay--;
            turn++;

            let result = checkVictory(coord[0], coord[1], coord[2], 2);
            updateUI(result);
        } else {
            assignMaterial(selectedObject);
            isASquareSelected = false;
        }

    } else if (!hovering) {
        assignMaterial(selectedObject)
        isASquareSelected = false;
    }
}

function assignMaterial(obj) {
    if (browser.os == "ios") {
        obj.material = planeMaterial;
    } else {
        if(params.wireframe == 1){
            obj.material = planeMaterial;
        } else {
            obj.material = shaderMaterial;
        }
    }
}

function toggleMaterial() {
    if (browser.os == "ios") {
        return
    } else {
        for (let i = 0; i < checkerAmount; i++) {
            for (let j = 0; j < checkerAmount; j++) {
                for (let k = 0; k < checkerAmount; k++) {
                    if (params.wireframe == 1) {
                        checkers[i][j][k].material = planeMaterial;
                    } else {
                        checkers[i][j][k].material = shaderMaterial;
                    }
                }
            }
        };
    }
}

function animate() {

    requestAnimationFrame(animate);
    raycaster.setFromCamera(mouse, camera);
    intersection = raycaster.intersectObject(checkersExclusiveContainer, true);

    if (!isASquareSelected && isPlaying && !started && intersection.length > 0) {

        intersectedObject = intersection[0].object;
        intersectedObject.material = planeMaterialOnHover;
        hovering = true;
        started = true;

    } else if (isASquareSelected && intersection.length > 0) {

        hovering = true;

    } else if (started && intersection.length == 0) {

        hovering = false;
        started = false;
        if (!isASquareSelected) {
            assignMaterial(intersectedObject);
        }

    } else if (!isASquareSelected && started && intersection.length > 0) {

        assignMaterial(intersectedObject);
        intersectedObject = intersection[0].object;
        intersectedObject.material = planeMaterialOnHover;
        hovering = true;
        started = true;

    }

    renderer.render(scene, camera);
}

init();
animate();