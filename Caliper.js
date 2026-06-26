import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';


// ======================
// SCENE
// ======================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x111111);


// ======================
// CAMERA
// ======================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(4, 2, 6);


// ======================
// RENDERER
// ======================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(window.devicePixelRatio);

renderer.toneMapping = THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.3;

renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);


// ======================
// LIGHTING
// ======================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    0.6
);

scene.add(ambientLight);


// Front Light
const frontLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

frontLight.position.set(5, 6, 8);

scene.add(frontLight);


// Side Light
const sideLight = new THREE.DirectionalLight(
    0xffffff,
    2
);

sideLight.position.set(-5, 3, 2);

scene.add(sideLight);


// Rim Light
const rimLight = new THREE.DirectionalLight(
    0xff4444,
    1.5
);

rimLight.position.set(0, 4, -6);

scene.add(rimLight);


// ======================
// GRID
// ======================

const gridHelper = new THREE.GridHelper(
    50,
    50,
    0x666666,
    0x333333
);

scene.add(gridHelper);


// ======================
// CONTROLS
// ======================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;

controls.dampingFactor = 0.05;

controls.target.set(0, 1, 0);

controls.minDistance = 2;

controls.maxDistance = 15;


// ======================
// LOADER
// ======================

const loader = new GLTFLoader();

loader.load(

    './model/Caliper.glb',

    function(gltf){

        const model = gltf.scene;

        scene.add(model);

        // ======================
        // CENTER MODEL
        // ======================

        const box = new THREE.Box3().setFromObject(model);

        const size = box.getSize(new THREE.Vector3());

        const center = box.getCenter(new THREE.Vector3());

        model.position.x -= center.x;

        model.position.z -= center.z;

        model.position.y -= box.min.y;


        // ======================
        // SCALE MODEL
        // ======================

        const maxSize = Math.max(
            size.x,
            size.y,
            size.z
        );

        const scale = 3 / maxSize;

        model.scale.setScalar(scale);


        // ======================
        // MATERIALS
        // ======================

        model.traverse((child) => {

            if (child.isMesh) {

                child.castShadow = true;

                child.receiveShadow = true;

                if (child.material) {

                    child.material.metalness = 0.9;

                    child.material.roughness = 0.25;

                    child.material.needsUpdate = true;

                }

            }

        });

        console.log('MODEL LOADED');

    },

    function(xhr){

        console.log(
            (xhr.loaded / xhr.total * 100) + '% loaded'
        );

    },

    function(error){

        console.error('MODEL ERROR:', error);

    }

);


// ======================
// ANIMATION
// ======================

function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);

}

animate();


// ======================
// RESIZE
// ======================

window.addEventListener('resize', () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});
