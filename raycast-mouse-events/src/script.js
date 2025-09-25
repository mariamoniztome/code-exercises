import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


// Canvas
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Objects
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = -2

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)
const objectsToTest = [object1, object2, object3]

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight }

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Raycaster
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
let currentIntersect = null

window.addEventListener('mousemove', (event) =>
{
  // NDC (-1 a +1)
  mouse.x = (event.clientX / sizes.width) * 2 - 1
  mouse.y = -(event.clientY / sizes.height) * 2 + 1
})

// Resize
window.addEventListener('resize', () =>
{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

window.addEventListener('click', () =>
{
  if (currentIntersect.object === object1) {
    console.log('click on object 1')
  } else if (currentIntersect.object === object2) {
    console.log('click on object 2')
  } else if (currentIntersect.object === object3) {
    console.log('click on object 3')
  }
})

// Models
const gltfLoader = new GLTFLoader()
let model = null
gltfLoader.load('./static/models/Duck/glTF-Binary/Duck.glb', (gltf) =>
{
  model = gltf.scene
  gltf.scene.position.y = -1.2
  scene.add(model)
})

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2.1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

// Animate
const clock = new THREE.Clock()

function tick()
{
  const elapsedTime = clock.getElapsedTime()

  // Animation
  object1.position.y = Math.sin(elapsedTime * 0.5) * 1.5
  object2.position.y = Math.sin(elapsedTime * 0.8 + Math.PI * 0.5) * 1.5
  object3.position.y = Math.sin(elapsedTime * 1.1 + Math.PI) * 1.5

  controls.update()

  // Raycast por frame (usa posição do rato + câmara atual)
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(objectsToTest, false)

  // Reset 
  for (const obj of objectsToTest) obj.material.color.set('#ff0000')

  // Highlight
  for (const hit of intersects) hit.object.material.color.set('#0197ff')

  // Events enter/leave
  if (intersects.length) {
    if (currentIntersect === null) console.log('mouse enter')
    currentIntersect = intersects[0]
  } else {
    if (currentIntersect !== null) console.log('mouse leave')
    currentIntersect = null
  }

  if (model){
    const modelIntersects = raycaster.intersectObject(model, true)
  }

  // Render
  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

tick()