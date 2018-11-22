class Hand {
	constructor(length, width, canvasWidth, canvasHeight) {
		this.l = length;
		this.w = width;
		this.cw = canvasWidth;
		this.ch = canvasHeight;

		this.matrix = new Matrix()
			.translate(this.cw / 2, this.ch / 2)
			.rotate(57)
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

	containsPoint(p) {
		p = this.inverseMatrix.transformPoint(p);
		return (p[0] >= 0) && (p[0] < 1) && (p[1] >= 0) && (p[1] < 1);
	}

	draw(ctx) {
		var path = this.getPath();

		ctx.beginPath();
		ctx.moveTo(path[0][0], path[0][1]);
		ctx.lineTo(path[1][0], path[1][1]);
		ctx.lineTo(path[2][0], path[2][1]);
		ctx.lineTo(path[3][0], path[3][1]);
		ctx.closePath();

		ctx.stroke();
	}
}
