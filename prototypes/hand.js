class Hand {
	constructor(length, width, canvasWidth, canvasHeight) {
		this.l = length;
		this.w = width;
		this.cw = canvasWidth;
		this.ch = canvasHeight;

		this.matrix = new Matrix()
			.translate(this.cw / 2, this.ch / 2)
			.rotate(45)
			.scale(this.l, this.w)
			.translate(0, -0.5);

		this.inverseMatrix = this.matrix.inverse();
	}

	getPath() {
		return [[0, 0], [1, 0], [1, 1], [0, 1]].map(pt => this.matrix.transformPoint(pt));
	}

	getBounds() {
		const path = this.getPath();
		return {
			lox: Math.min(...path.map(pt => pt[0])),
			loy: Math.min(...path.map(pt => pt[1])),
			hix: Math.max(...path.map(pt => pt[0])),
			hiy: Math.max(...path.map(pt => pt[1])),
		}
	}

	isPointInHand(p) {
		p = this.inverseMatrix.transformPoint(p);
		return (p[0] >= 0) && (p[0] < 1) && (p[1] >= 0) && (p[1 < 1]);
	}
}
