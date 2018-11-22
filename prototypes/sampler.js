class Sampler {
	constructor(radius) {
		let r = radius;
		this.samples = [
			[0, 0], // Centre.
			[r, 0], // Clockwise from 3 o'clock.
			[(r / 2), ((Math.sqrt(3) / 2) * r)],
			[-(r / 2), ((Math.sqrt(3) / 2) * r)],
			[-r, 0],
			[-(r / 2), -((Math.sqrt(3) / 2) * r)],
			[(r / 2), -((Math.sqrt(3) / 2) * r)],
		];
	}

	sample(x, y, hand) {
		var results = this.samples.map(([dx, dy]) => {
			return hand.containsPoint([x + dx, y + dy]);
		});

		// Return count of true values, as a ratio of all values.
		return results.reduce((accumulator, currentValue) => currentValue ? ++accumulator : accumulator, 0) / this.samples.length;
	}
}
