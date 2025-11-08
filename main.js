import * as three from 'three';



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






const renderer = new three.WebGLRenderer({
    canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);

function animate() {
    renderer.render(scene, camera);



    window.requestAnimationFrame(animate)
}
animate()