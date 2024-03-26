import { Vector2 } from 'three'

export default class Node {
	neighbors = []
	walkable = true

	constructor(mesh, row, col, walkable = true) {
		this.mesh = mesh
		this.row = row
		this.col = col
		this.walkable = walkable

		this.position = new Vector2(row, col)
	}

	/**
	 * Add to node to neighbors
	 * @param {Node} to
	 */
	addArc(to) {
		if (!this.neighbors.includes(to)) {
			this.neighbors.push(to)
		}
	}

	reset() {
		this.g = undefined
		this.h = undefined
		this.f = undefined
		this.parentNode = undefined
		this.visited = undefined
	}

	/**
	 * Remove to node from neighbors
	 * @param {Node} to
	 */
	removeArc(to) {
		const i = this.neighbors.findIndex((el) => el === to)
		if (i >= 0) {
			this.neighbors.splice(i, 1)
		}
	}
}
