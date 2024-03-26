export default class MinHeap {
	items = []

	getParentIndex(i) {
		return Math.floor((i - 1) / 2)
	}

	getLeftChildIndex(i) {
		return 2 * i + 1
	}

	getRightChildIndex(i) {
		return 2 * i + 2
	}

	parent(i) {
		return this.items[this.getParentIndex(i)]
	}

	leftChild(i) {
		return this.items[this.getLeftChildIndex(i)]
	}

	rightChild(i) {
		return this.items[this.getRightChildIndex(i)]
	}

	hasParent(i) {
		return this.parent(i) !== undefined
	}

	hasLeftChild(i) {
		return this.leftChild(i) !== undefined
	}

	hasRightChild(i) {
		return this.rightChild(i) !== undefined
	}

	swap(i, j) {
		const temp = this.items[i]
		this.items[i] = this.items[j]
		this.items[j] = temp
	}

	get size() {
		return this.items.length
	}

	add(node) {
		this.items.push(node)
		this.heapifyUp()
	}

	heapifyUp() {
		let index = this.size - 1

		while (
			this.hasParent(index) &&
			this.parent(index).f > this.items[index].f
		) {
			let parentIndex = this.getParentIndex(index)
			this.swap(index, parentIndex)
			index = parentIndex
		}
	}

	get() {
		if (this.size === 0) return undefined

		const firstItem = this.items[0]

		if (this.size === 1) return this.items.pop()

		this.items[0] = this.items.pop()

		this.heapifyDown()

		return firstItem
	}

	heapifyDown() {
		let index = 0

		while (this.hasLeftChild(index)) {
			let smallerChildIndex = this.getLeftChildIndex(index)

			if (
				this.hasRightChild(index) &&
				this.rightChild(index).f < this.leftChild(index).f
			) {
				smallerChildIndex = this.getRightChildIndex(index)
			}

			if (this.items[index].f < this.items[smallerChildIndex].f) {
				break
			} else {
				this.swap(index, smallerChildIndex)
				index = smallerChildIndex
			}
		}
	}
}
