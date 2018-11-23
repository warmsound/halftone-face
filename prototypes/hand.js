class Hand {
	constructor(length, width, canvasWidth, canvasHeight, colours, sampler) {
		this.l = length;
		this.w = width;
		this.cw = canvasWidth;
		this.ch = canvasHeight;
		this.colours = colours; // [bright, medium, dark]
		this.sampler = sampler;

		this.setAngle(0);
	}

	setAngle(deg) {
		// Convert to clockwise degrees from 12 o'clock.
		deg -= 90;
		deg *= -1;

		// Calculate matrix and inverse matrix.
		// Matrix maps from unit square to desired hand size/position.
		this.matrix = new Matrix()
			.translate(this.cw / 2, this.ch / 2)
			.rotate(deg)
			.scale(this.l, this.w)
			.translate(0, -0.5);

		this.inverseMatrix = this.matrix.inverse();
	}

	// Transform unit square using matrix.
	getPath() {
		return [[0, 0], [1, 0], [1, 1], [0, 1]].map(pt => this.matrix.transformPoint(pt));
	}

	// Upright bounds that enclose path.
	getBounds() {
		const path = this.getPath();
		return {
			lox: Math.min(...path.map(pt => pt[0])),
			loy: Math.min(...path.map(pt => pt[1])),
			hix: Math.max(...path.map(pt => pt[0])),
			hiy: Math.max(...path.map(pt => pt[1])),
		}
	}

	// Transform point using pre-calculated inverse matrix, then check whether point is within unit square.
	containsPoint(p) {
		p = this.inverseMatrix.transformPoint(p);
		return (p[0] >= 0) && (p[0] < 1) && (p[1] >= 0) && (p[1] < 1);
	}

	drawOutline(ctx) {
		const path = this.getPath();

		ctx.beginPath();
		ctx.moveTo(path[0][0], path[0][1]);
		ctx.lineTo(path[1][0], path[1][1]);
		ctx.lineTo(path[2][0], path[2][1]);
		ctx.lineTo(path[3][0], path[3][1]);
		ctx.closePath();

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#ffffff';
		ctx.stroke();
	}

	draw(ctx) {
		let result;
		let colour;
		for (let y = R, rowIndex = 0; (y + R) <= canvas.height; y += (2 * R), ++rowIndex) {
			for (let x = (rowIndex % 2) ? 0 : R; (x + R) <= canvas.width; x += (2 * R)) {
				ctx.beginPath();

				result = this.sampler.sample(x, y, this);
				if (result) {
					switch (result) {
						case 7: case 6: case 5:
							colour = this.colours[0];
							break;

						case 4: case 3:
							colour = this.colours[1];
							break;

						default:
							colour = this.colours[2];
							break;
					}
					ctx.fillStyle = colour;
					ctx.arc(x, y, (GAMMA + ((1 - GAMMA) * (result / 7))) * R, 0, 2 * Math.PI);
				}

				ctx.fill();
			}
		}
	}
}
