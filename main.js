import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import PriorityQueue from './src/PriorityQueue'
import Node from './src/Node'
import { createNoise2D } from 'simplex-noise'
const _V2 = new THREE.Vector2(0, 0)

const noise = createNoise2D()
/**
 * Debug
 */
// const gui = new dat.GUI()

const cursor = new THREE.Vector2(0, 0)
const raycaster = new THREE.Raycaster()

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * BOX
 */
const material = new THREE.MeshNormalMaterial()
const geometry = new THREE.BoxGeometry(1, 1, 1)

const mesh = new THREE.Mesh(geometry, material)
// scene.add(mesh)

const queue = new PriorityQueue()
const nodes = []

const gridSize = 50
for (let i = 0; i < gridSize; i++) {
	for (let j = 0; j < gridSize; j++) {
		const node = new Node(i, j)
		nodes.push(node)
		scene.add(node)

		if (noise(i * 0.1, j * 0.1) < -0.3) {
			node.traversable = false
			node.material.color.set('black')
		}
	}
}

nodes.forEach((node) => {
	const { i, j } = node
	for (let x = i - 1; x <= i + 1; x++) {
		for (let y = j - 1; y <= j + 1; y++) {
			const neighbor = nodes.find((n) => {
				if (n.i === node.i && n.j === node.j) return
				return n.traversable && n.i === x && n.j === y
			})

			neighbor && node.neighbors.push(neighbor)
		}
	}
})

let startNode, goalNode

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
camera.position.set(gridSize * 5, 10 * gridSize, gridSize * 10)
// camera.lookAt(new THREE.Vector3((10 * gridSize) / 2, 5, (10 * gridSize) / 2))

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
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(gridSize * 5, 0, gridSize * 5)

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

window.addEventListener('click', function () {
	raycaster.setFromCamera(cursor, camera)
	const [node] = raycaster.intersectObjects(nodes)

	if (node) {
		if (startNode && goalNode) {
			startNode = goalNode = null

			nodes.forEach((node) => {
				if (node.traversable) {
					node.reset()
				}
			})
		}

		console.log(node)
		if (!startNode) {
			startNode = node.object
			node.object.material.color.set(0xff0000)
			startNode.setG(startNode)
			queue.insert(startNode)
		} else if (!goalNode) {
			goalNode = node.object
			node.object.material.color.set('#00ff00')
		}
	} else if (startNode && goalNode) {
		aStar(startNode, goalNode)
	}
})

let currentNode

function aStar(start, goal) {
	console.log('a* start')
	if (!start || !goal) return

	queue.insert(start)
	start.g = 0
	start.setH(goal)

	const openSet = queue
	const closedSet = []

	let i = setInterval(() => {
		const done = stepAStar(openSet, start, goal, closedSet)
		if (done) {
			clearInterval(i)
			i = undefined
		}
	}, 100)
	// while (openSet.list.length) {
	// 	stepAStar(openSet, goal)
	// const node = openSet.pull()

	// node.material.color.set('orange')

	// if (node === goal) {
	// 	console.log('DONE', node)
	// 	showPath(node)
	// 	return
	// }

	// node.neighbors.forEach((n) => {
	// 	const tempG = node.g + _V2.set(n.i - node.i, n.j - node.j).length()
	// 	if (tempG < n.g) {
	// 		n.setG(node)
	// 		n.setH(goal)

	// 		if (!openSet.list.includes(n)) {
	// 			openSet.insert(n)
	// 		}
	// 	}
	// })
	// }
}

function stepAStar(openSet, start, goal, closedSet) {
	const node = openSet.pull()
	node.visited = true
	closedSet.push(node)

	if (node !== start) {
		node.material.color.set('orange')
	}

	if (node === goal) {
		// showPath(node)
		openSet.reset()
		done(node)

		return true
	}

	node.neighbors.forEach((n) => {
		if (n !== start && n !== goal) {
			n.material.color.set('blue')
		}

		if (closedSet.includes(n)) {
			return
		}
		const tempG = node.g + _V2.set(n.i - node.i, n.j - node.j).length()
		if (!n.visited) n.parentNode = node

		if (tempG < n.g) {
			n.setG(node)
			n.setH(goal)

			if (!openSet.list.includes(n)) {
				openSet.insert(n)
			}
		}
	})
}

function showPath(node) {
	console.log('Show path')
	node.material.color.set('violet')

	let current = node

	while (current.parentNode) {
		current.parentNode.material.color.set('violet')
		current = node.parentNode
		// console.log(current)
		console.log('path item')
	}

	console.log('finish!')
}

function done(node) {
	console.log('DONE', node)

	nodes.forEach((n) => n.reset())
	// showPath(node)
}

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

window.addEventListener('mousemove', function (e) {
	cursor.x = 2 * (e.clientX / window.innerWidth) - 1
	cursor.y = -2 * (e.clientY / window.innerHeight) + 1
})
