class Matrix {
	constructor(m11 = 1, m12 = 0, m13 = 0, m21 = 0, m22 = 1, m23 = 0, m31 = 0, m32 = 0, m33 = 1) {
		this.m11 = m11;
		this.m12 = m12;
		this.m13 = m13;

		this.m21 = m21;
		this.m22 = m22;
		this.m23 = m23;

		this.m31 = m31;
		this.m32 = m32;
		this.m33 = m33;
	}

	// p' = this * p
	//
	// [x']   [a c e]   [x]
	// [y'] = [b d f] * [y]
	// [1 ]   [0 0 1]   [1]
	transformPoint(p) {
		return [
			(this.m11 * p[0]) + (this.m12 * p[1]) + this.m13,
			(this.m21 * p[0]) + (this.m22 * p[1]) + this.m23
		];
	}

	// m' = this * m
	//
	// [a c e]   [a1 c1 e1] [a2 c2 e2]
	// [b d f] = [b1 d1 f1] [b2 d2 f2]
	// [0 0 1]   [ 0  0  1] [ 0  0  1]
	multiply(m) {
		return new Matrix(
			(this.m11 * m.m11) + (this.m12 * m.m21) + (this.m13 * m.m31),
			(this.m11 * m.m12) + (this.m12 * m.m22) + (this.m13 * m.m32),
			(this.m11 * m.m13) + (this.m12 * m.m23) + (this.m13 * m.m33),

			(this.m21 * m.m11) + (this.m22 * m.m21) + (this.m23 * m.m31),
			(this.m21 * m.m12) + (this.m22 * m.m22) + (this.m23 * m.m32),
			(this.m21 * m.m13) + (this.m22 * m.m23) + (this.m23 * m.m33),

			(this.m31 * m.m11) + (this.m32 * m.m21) + (this.m33 * m.m31),
			(this.m31 * m.m12) + (this.m32 * m.m22) + (this.m33 * m.m32),
			(this.m31 * m.m13) + (this.m32 * m.m23) + (this.m33 * m.m33)
		);
	}

	multiplyScalar(s) {
		return new Matrix(
			this.m11 * s, this.m12 * s, this.m13 * s,
			this.m21 * s, this.m22 * s, this.m23 * s,
			this.m31 * s, this.m32 * s, this.m33 * s
		);
	}

	translate(dx, dy) {
		return this.multiply(new Matrix(1, 0, dx, 0, 1, dy, 0, 0, 1));
	}

	scale(sx, sy) {
		return this.multiply(new Matrix(sx, 0, 0, 0, sy, 0, 0, 0, 1));
	}

	rotate(deg) {
		deg *= (Math.PI / 180);
		const cosTheta = Math.cos(deg);
		const sinTheta = Math.sin(deg);
		return this.multiply(new Matrix(cosTheta, sinTheta, 0, -sinTheta, cosTheta, 0, 0, 0, 1));
	}

	static det2 (m11, m12, m21, m22) {
		return (m11 * m22) - (m12 * m21);
	}

	det() {
		return (this.m11 * /* minor m11 */ Matrix.det2(this.m22, this.m23, this.m32, this.m33))
			- (this.m12 * /* minor m12 */ Matrix.det2(this.m21, this.m23, this.m31, this.m33))
			+ (this.m13 * /* minor m13 */ Matrix.det2(this.m21, this.m22, this.m31, this.m32));
	}

	transpose() {
		return new Matrix(
			this.m11, this.m21, this.m31,
			this.m12, this.m22, this.m32,
			this.m13, this.m23, this.m33
			);
	}

	inverse() {
		var cofactor = new Matrix(
			Matrix.det2(this.m22, this.m23, this.m32, this.m33),
			-Matrix.det2(this.m21, this.m23, this.m31, this.m33),
			Matrix.det2(this.m21, this.m22, this.m31, this.m32),

			-Matrix.det2(this.m12, this.m13, this.m32, this.m33),
			Matrix.det2(this.m11, this.m13, this.m31, this.m33),
			-Matrix.det2(this.m11, this.m12, this.m31, this.m32),

			Matrix.det2(this.m12, this.m13, this.m22, this.m23),
			-Matrix.det2(this.m11, this.m13, this.m21, this.m23),
			Matrix.det2(this.m11, this.m12, this.m21, this.m22)
		).transpose();

		return cofactor.multiplyScalar(1 / this.det());
	}
}
