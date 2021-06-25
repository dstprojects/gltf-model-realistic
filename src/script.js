import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'dat.gui'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Texture loader
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

/**
 * Models
 */

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Env map
 */

 const cubeTextureLoader = new THREE.CubeTextureLoader()
 const environmentMap = cubeTextureLoader.load([
    '/environmentMaps/0/px.jpg',
    '/environmentMaps/0/nx.jpg',
    '/environmentMaps/0/py.jpg',
    '/environmentMaps/0/ny.jpg',
    '/environmentMaps/0/pz.jpg',
    '/environmentMaps/0/nz.jpg'
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap


// Material

// const bakedTexture = textureLoader.load('/models/Horse/bakked.jpg')
// bakedTexture.flipY = false
// bakedTexture.encoding = THREE.sRGBEncoding
// const noBakeTexture = textureLoader.load('/models/Horse/horse02_prueba.png')
// noBakeTexture.encoding = THREE.sRGBEncoding
// noBakeTexture.flipY = false
// const aoMap = textureLoader.load('/models/Horse/ao.png')
// const normalMap = textureLoader.load('/models/Horse/normal.png')
// const roughnessMap = textureLoader.load('/models/Horse/rough03.png')
// const specMap = textureLoader.load('/models/Horse/spec.png')


// const bakedMaterial = new THREE.MeshStandardMaterial({ 
//     map: bakedTexture,    
// })

// bakedMaterial.aoMap = aoMap
// bakedMaterial.aoMapIntensity = 10
// bakedMaterial.roughnessMap = roughnessMap
// bakedMaterial.roughness= 0.9
// bakedMaterial.normalMap = normalMap
// bakedMaterial.metalnessMap = specMap
// bakedMaterial.metalness = 0.2
// bakedMaterial.envMap = environmentMap

gltfLoader.load(
    '/models/Horse/12/prueba_horse12.gltf',
    ( gltf ) => {
        // gltf.scene.traverse( (child) => {
        //     child.material = bakedMaterial
        // })

        gltf.scene.scale.set( 0.025, 0.025, 0.025)
        gltf.scene.position.set(0,0,0)
        scene.add(gltf.scene)
    }
)

// let mixer = null

// gltfLoader.load(
//     '/models/Fox/glTF/Fox.gltf',
//     ( gltf ) => {

//         mixer = new THREE.AnimationMixer(gltf.scene)
//         const action = mixer.clipAction(gltf.animations[2])

//         action.play()

//         gltf.scene.scale.set( 0.025, 0.025, 0.025)
//         scene.add(gltf.scene)

//     }
// )




/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    powerPreference: "high-performance"
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.LinearToneMapping
renderer.physicallyCorrectLights = true
// renderer.toneMappingExposure = 2


/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    // if(mixer !== null){
    //     mixer.update(deltaTime)
    // }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()