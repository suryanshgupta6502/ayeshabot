import { VRM, VRMLoaderPlugin } from '@pixiv/three-vrm';
import * as three from 'three';
import { GLTFLoader, OrbitControls, VRMLLoader } from 'three/examples/jsm/Addons.js';
import { loadanime } from './loadanime';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import gsap from 'gsap';







const gui = new GUI()
const parameter = {
    animation: "Waving.fbx",
    rotate: () => {
        gsap.to(camera.position, {
            x: 1, y: 5, z: 2, duration: 1
        })
    }
}
gui.add(parameter, "rotate").name("Change camera")

const canvas = document.querySelector("#canvas")
const sizes = {
    width: canvas.clientWidth,
    height: canvas.clientHeight
}
const scene = new three.Scene();
const camera = new three.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = 5;



const plane = new three.Mesh(new three.PlaneGeometry(), new three.MeshStandardMaterial())
plane.scale.setScalar(10)
plane.rotation.x = - Math.PI / 2
plane.castShadow = true
plane.receiveShadow = true
scene.add(plane)



let model
let vrm

const modelloade = new GLTFLoader()
modelloade.register((parser) => {
    return new VRMLoaderPlugin(parser);
})


model = await modelloade.loadAsync("Sample_Female.vrm")
vrm = model.userData.vrm

model.scene.traverse(each => {
      if (each.isMesh) {
        each.castShadow = true
    }
})

model.scene.rotation.y = Math.PI
model.scene.scale.setScalar(2)


scene.add(vrm.scene);
const mixer = new three.AnimationMixer(vrm.scene);

let newactions
async function loadaction(path) {
    if (newactions) { newactions.fadeOut(.5) }

    let clip = await loadanime(path, vrm)
    newactions = mixer.clipAction(clip)
    newactions.reset().fadeIn(.3).play()

}

loadaction(parameter.animation)

scene.add(new three.AxesHelper(5))






gui.add(parameter, 'animation', ["Waving.fbx", "Snake Hip Hop Dance.fbx"])
    .onChange(async (e) => {
        loadaction(parameter.animation)

    })



const orbit = new OrbitControls(camera, canvas);
orbit.target.set(0, 2, 0)
orbit.object.position.y = 3
orbit.object.position.z = 3


const ambientlight = new three.AmbientLight(0xffffff, 2);
scene.add(ambientlight);

const directionalLight = new three.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true
scene.add(directionalLight);



const renderer = new three.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true
renderer.shadowMap.type = three.PCFSoftShadowMap


const clock = new three.Clock()
function animate() {
    renderer.render(scene, camera);
    orbit.update();
    const delta = clock.getDelta()


    mixer?.update(delta)
    vrm?.update(delta)


    window.requestAnimationFrame(animate)
}
animate()