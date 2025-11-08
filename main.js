import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import * as three from 'three';
import { GLTFLoader, OrbitControls, VRMLLoader } from 'three/examples/jsm/Addons.js';



const canvas = document.querySelector("#canvas")
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;



const box = new three.Mesh(new three.BoxGeometry(), new three.MeshNormalMaterial())
scene.add(box)



let model

const modelloade = new GLTFLoader()
modelloade.register((parser) => {
    return new VRMLoaderPlugin(parser);
})


model = await modelloade.loadAsync("Sample_Female.vrm")
console.log(model);

scene.add(model);




const orbit = new OrbitControls(camera, canvas);

const ambientlight = new three.AmbientLight(0xffffff, 3);
scene.add(ambientlight);

const directionalLight = new three.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
// scene.add(directionalLight);



const renderer = new three.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

function animate() {
    renderer.render(scene, camera);
    orbit.update();


    window.requestAnimationFrame(animate)
}
animate()