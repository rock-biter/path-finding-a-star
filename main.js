import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import Graph from './src/Graph'
import Node from './src/Node'

/**
 * Debug
 */
// const gui = new dat.GUI()

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * BOX
 */
// const material = new THREE.MeshNormalMaterial()
// const geometry = new THREE.BoxGeometry(1, 1, 1)

// const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)
camera.position.set(20, 20, 20)
camera.lookAt(new THREE.Vector3(0, 2.5, 0))

/**
 * Show the axes of coordinates system
 */
const axesHelper = new THREE.AxesHelper(3)
scene.add(axesHelper)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
document.body.appendChild(renderer.domElement)
handleResize()

/**
 * Lights
 */
const linght = new THREE.DirectionalLight(0xffffff, 3.5)
const ambient = new THREE.AmbientLight(0xffffff, 1.5)

scene.add(linght, ambient)

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const map = new Graph()

const obstacles = [
	43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 63, 83, 103, 123, 143,
	163, 183, 203, 223, 243, 263, 330, 310, 290, 350, 270, 250, 230,
]

const size = 100

for (let i = 0; i < size; i++) {
	for (let j = 0; j < size; j++) {
		const tile = new THREE.Mesh(
			new THREE.BoxGeometry(1, 0.05, 1),
			new THREE.MeshStandardMaterial({ color: 'lightblue' })
		)

		tile.scale.set(0.95, 1, 0.95)
		tile.position.set(j - size * 0.5, 0, i - size * 0.5)

		const index = map.nodes.length
		const walkable = !(i > 20 && i < size - 20 && j > 20 && j < size - 20) //!obstacles.includes(index)

		const node = new Node(tile, i, j, walkable)
		map.addVertex(node)

		if (walkable) scene.add(tile)
	}
}

console.log(map)

map.nodes.forEach((node, i) => {
	const row = Math.floor(i / size)
	const col = i % size

	// console.log(i, row, col)

	const neighbors = map.nodes.filter((el) => {
		return (
			(el.row === row && el.col === col - 1) ||
			(el.row === row && el.col === col + 1) ||
			(el.row === row - 1 && el.col === col) ||
			(el.row === row + 1 && el.col === col) ||
			(el.row === row - 1 && el.col === col - 1) ||
			(el.row === row + 1 && el.col === col - 1) ||
			(el.row === row + 1 && el.col === col + 1) ||
			(el.row === row - 1 && el.col === col + 1)
		)
	})

	neighbors.forEach((el) => map.addArc(node, el))

	// const leftNode = map.nodes.find((el) => el.row === row && el.col === col - 1)
	// if (leftNode) {
	// 	map.addArc(node, leftNode)
	// }

	// const rightNode = map.nodes.find((el) => el.row === row && el.col === col + 1)
	// if (rightNode) {
	// 	map.addArc(node, rightNode)
	// }

	// const topNode = map.nodes.find((el) => el.row === row - 1 && el.col === col)
	// if (topNode) {
	// 	map.addArc(node, topNode)
	// }

	// const bottomNode = map.nodes.find(
	// 	(el) => el.row === row + 1 && el.col === col
	// )
	// if (bottomNode) {
	// 	map.addArc(node, bottomNode)
	// }

	// const leftTopNode = map.nodes.find(
	// 	(el) => el.row === row - 1 && el.col === col - 1
	// )
	// if (leftTopNode) {
	// 	map.addArc(node, leftTopNode)
	// }

	// const leftBottomNode = map.nodes.find(
	// 	(el) => el.row === row + 1 && el.col === col - 1
	// )
	// if (leftBottomNode) {
	// 	map.addArc(node, leftBottomNode)
	// }

	// const rightTopNode = map.nodes.find(
	// 	(el) => el.row === row + 1 && el.col === col + 1
	// )
	// if (rightTopNode) {
	// 	map.addArc(node, rightTopNode)
	// }

	// const rightBottomNode = map.nodes.find(
	// 	(el) => el.row === row - 1 && el.col === col + 1
	// )
	// if (rightBottomNode) {
	// 	map.addArc(node, rightBottomNode)
	// }
})

// obstacles.forEach((el) => {
// 	const node = map.nodes[el]
// 	scene.remove(node.mesh)
// 	map.removeArcTo(node)

// 	console.log(node)
// })

const start = map.nodes[0]
const end = map.nodes[size ** 2 - 1]

// start.mesh.material.color.set('green')
// end.mesh.material.color.set('tomato')
console.log('with array')
for (let i = 0; i < 10; i++) {
	console.time()
	map.findPath(start, end)
	console.timeEnd()
	map.nodes.forEach((el) => el.reset())
}

console.log('with heap')
for (let i = 0; i < 10; i++) {
	console.time()
	map.findPathHeap(start, end)
	console.timeEnd()
	map.nodes.forEach((el) => el.reset())
}

start.mesh.material.color.set('lightgreen')
end.mesh.material.color.set('tomato')

/**
 * Three js Clock
 */
// const clock = new THREE.Clock()

/**
 * frame loop
 */
function tic() {
	/**
	 * tempo trascorso dal frame precedente
	 */
	// const deltaTime = clock.getDelta()
	/**
	 * tempo totale trascorso dall'inizio
	 */
	// const time = clock.getElapsedTime()

	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', handleResize)

function handleResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}
