import { Vector2 } from 'three'
import Node from './Node'
import MinHeap from './MinHeap'
const V = new Vector2()

export default class Graph {
	nodes = []

	addVertex(node) {
		this.nodes.push(node)
	}

	addArc(from, to, oriented = false) {
		from.addArc(to)
		if (!oriented) {
			to.addArc(from)
		}
	}

	removeArc(from, to, oriented = false) {
		from.removeArc(to)
		if (!oriented) {
			to.removeArc(from)
		}
	}

	// /**
	//  *
	//  * @param {Node} node
	//  */
	// removeArcTo(node) {
	// 	node.neighbors.forEach((el) => {
	// 		this.removeArc(node, el)
	// 	})

	// 	node.neighbors = []
	// }

	getGCost(to, from) {
		if (!from) {
			return 0
		}

		const g = from.g + to.position.distanceTo(from.position)
		// console.log(from.g, to.position.distanceTo(from.position))
		return g
	}

	getHCost(to, end) {
		const h = to.position.distanceTo(end.position)
		return h
	}

	getFCost(to, from, end) {
		const g = this.getGCost(to, from)
		const h = this.getHCost(to, end)
		// console.log(g, h)
		return g + h + h * 0.001
	}

	showPath(end) {
		let current = end

		while (current.parentNode) {
			current.mesh.material.color.set('blue')
			current = current.parentNode
		}
	}

	/**
	 * A* search
	 */
	findPath(start, end) {
		const frontier = []
		// const closed = []
		frontier.push(start)

		start.g = this.getGCost(start)
		start.h = this.getHCost(start, end)
		start.f = this.getFCost(start, undefined, end)
		start.parentNode = null

		// console.log(frontier)

		while (frontier.length) {
			frontier.sort((nodeA, nodeB) => {
				if (nodeA.f < nodeB.f) {
					return -1
				} else if (nodeA.f > nodeB.f) {
					return 1
				} else {
					return nodeA.h - nodeB.h
				}
			})
			const current = frontier.shift()
			// closed.push(current)
			current.visited = true
			// console.log(current)

			if (current === end) {
				// console.log('Percorso trovato')
				this.showPath(end)
				break
			}

			current.neighbors.forEach((node) => {
				// console.log(node.walkable)
				if (!node.walkable || node.visited) return

				const newFCost = this.getFCost(node, current, end)
				if (node.f === undefined || newFCost < node.f) {
					const toAdd = node.f === undefined
					node.f = newFCost
					node.g = this.getGCost(node, current)
					node.h = this.getHCost(node, end)
					// node.mesh.material.color.set('mediumpurple')
					node.parentNode = current
					// alert(node.f, node.g, node.h)
					if (toAdd) {
						frontier.push(node)
					}
				}
			})
		}
	}

	/**
	 * A* search
	 */
	findPathHeap(start, end) {
		const frontier = new MinHeap()
		// const closed = []
		frontier.add(start)

		start.g = this.getGCost(start)
		start.h = this.getHCost(start, end)
		start.f = this.getFCost(start, undefined, end)
		start.parentNode = null

		// console.log(frontier)

		while (frontier.size) {
			// frontier.sort((nodeA, nodeB) => {
			// 	if (nodeA.f < nodeB.f) {
			// 		return -1
			// 	} else if (nodeA.f > nodeB.f) {
			// 		return 1
			// 	} else {
			// 		return nodeA.h - nodeB.h
			// 	}
			// })
			const current = frontier.get()
			// closed.push(current)
			current.visited = true
			// console.log(current)

			if (current === end) {
				// console.log('Percorso trovato')
				this.showPath(end)
				break
			}

			current.neighbors.forEach((node) => {
				// console.log(node.walkable)
				if (!node.walkable || node.visited) return

				const newFCost = this.getFCost(node, current, end)
				if (node.f === undefined || newFCost < node.f) {
					const toAdd = node.f === undefined
					node.f = newFCost
					node.g = this.getGCost(node, current)
					node.h = this.getHCost(node, end)
					// node.mesh.material.color.set('mediumpurple')
					node.parentNode = current
					// alert(node.f, node.g, node.h)
					if (toAdd) {
						frontier.add(node)
					}
				}
			})
		}
	}
}
