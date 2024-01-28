export default class PriorityQueue {
	list = []

	insert(node) {
		this.list.push(node)
	}

	pull() {
		let index = 0
		let lower = this.list[index]

		this.list.forEach((node, i) => {
			if (node.f > lower.f) {
				lower = node
				index = i
			}

			if (node.f === lower.f) {
				if (node.h < lower.h) {
					lower = node
					index = i
				}
			}
		})

		this.list.splice(index, 1)
		return lower
	}

	reset() {
		this.list = []
	}
}
