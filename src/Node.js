import { Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from 'three'

const SIZE = 10
const geometry = new PlaneGeometry(10, 10)
geometry.rotateX(Math.PI * -0.5)
const material = new MeshBasicMaterial({ color: 'white' })
const _V2 = new Vector2(0, 0)

export default class Node extends Mesh {
	g = Number.MAX_SAFE_INTEGER
	h = Number.MAX_SAFE_INTEGER
	traversable = true
	neighbors = []
	visited = false

	constructor(i, j) {
		super(geometry, material.clone())
		this.i = i
		this.j = j

		this.position.set(SIZE * (i + 0.5), 0, SIZE * (0.5 + j))
		this.scale.setScalar(0.98)

		// if (Math.random() > 0.7) {
		// 	this.traversable = false
		// 	this.material.color.set('black')
		// }
	}

	setH(goal) {
		this.h = _V2.set(goal.i - this.i, goal.j - this.j).length()
	}

	setG(from) {
		this.g = from.g + _V2.set(from.i - this.i, from.j - this.j).length()
		// this.parentNode = from
	}

	getF() {
		return this.g + this.h
	}

	getPriority() {
		return -this.g
	}

	reset() {
		this.g = Number.MAX_SAFE_INTEGER
		this.h = Number.MAX_SAFE_INTEGER
		if (this.traversable) {
			this.material.color.set('#ffffff')
		}
		this.visited = false
	}
}
