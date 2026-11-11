/* Created by Alexander Pen
this is the flickingTarget file - it will contain all the flicking target classes and their functions. */

import * as THREE from 'three'; 
import { Target } from './target.js';

export class FlickingTarget extends Target {
	constructor() {
		super();
		this.lifespan = Math.random() * 1 + 3; // Lifespan between 3 and 4 seconds
		this.age = 0; // Age starts at 0

		this.leftBoundary = -14;
		this.rightBoundary = 14;
		this.ceilingBoundary = 12; 
		this.floorBoundary = 1; 

		this.mesh.position.set( // set to a random position within larger boundaries
			(Math.random() * (this.rightBoundary - this.leftBoundary)) + this.leftBoundary,
			this.floorBoundary + Math.random() * (this.ceilingBoundary - this.floorBoundary),
			(Math.random() * 5) - 15
		);
	}

	checkLifespan(delta) { // returns true if the target has exceeded its lifespan
		this.age += delta; // increment age by delta time
		return this.age >= this.lifespan;
	}

	setLifespan(lifespan) { // set lifespan of target
		this.lifespan = lifespan;
		this.age = 0; // reset age when lifespan is set
	}
}

export class EasyFlickingTarget extends FlickingTarget { // easy flicking target
	constructor() {
		super();
	}
}

export class MediumFlickingTarget extends FlickingTarget { // medium flicking target
	constructor() {
		super();
		this.setRadius(0.75); // smaller radius for medium difficulty
		this.setLifespan(Math.random() * 1 + 2); // Lifespan between 2 and 3 seconds
	}
}

export class HardFlickingTarget extends FlickingTarget { // hard flicking target
	constructor() {
		super();
		this.setRadius(0.5); // smaller radius for hard difficulty
		this.setLifespan(Math.random() * 1 + 1); // Lifespan between 1 and 2 seconds
	}
}