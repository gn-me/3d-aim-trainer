/* Created by Alexander Pen
this is the curveTarget file - it will contain all the curve target classes and their functions. */

import * as THREE from 'three'; 
import { Target } from './target.js';

export class CurveTarget extends Target {
	constructor(speed = 15, radius = 1, boundary = 20, groundY = 1) { 
		const direction = Math.round(Math.random()); // 0 for left, 1 for right
		let startX;
		const z = -10 + Math.random() * -20; // random z within range
		const angleAbs = (Math.PI/6) + Math.random() * Math.PI/3; // 30 to 60 degrees

		if (direction === 0) {
			startX = -boundary;
			var horizontalVelocity = speed * Math.cos(angleAbs); // move right
		} else {
			startX = boundary;
			var horizontalVelocity = -speed * Math.cos(angleAbs); // move left
		}
		const verticalVelocity = speed * Math.sin(angleAbs);

		const position = new THREE.Vector3(startX, groundY, z);
		super(position, radius);

		this.horizontalVelocity = horizontalVelocity;
		this.verticalVelocity = verticalVelocity;

		this.gravity = 9.81; // gravity constant
		this.groundY = groundY; // ground level
		this.zVelocity = 0;

		this.alive = true; // target is active
	}

	update(delta) {
		if (!this.alive) return;

		// Update positions
		const x = this.mesh.position.x + this.horizontalVelocity * delta; 
		const y = this.mesh.position.y + this.verticalVelocity * delta - 0.5 * this.gravity * delta * delta; 
		const z = this.mesh.position.z + this.zVelocity * delta;

		// Update vertical velocity due to gravity
		this.verticalVelocity -= this.gravity * delta;

		this.mesh.position.set(x, y, z);

		// Remove if below ground
		if (y <= this.groundY) {
				this.alive = false;
		}		
	}
}

export class EasyCurvedDynamicTarget extends CurveTarget {
	constructor() {
		super(20, 1, 20, 1); // speed 20, radius 1, boundary 20, groundY 1
	}
}

export class MediumCurvedDynamicTarget extends CurveTarget {
	constructor() {
		super(25, 0.7, 20, 1); // speed 25, radius 0.7, boundary 20, groundY 1
	}
}

export class HardCurvedDynamicTarget extends CurveTarget {
	constructor() {
		super(30, 0.5, 20, 1); // speed 30, radius 0.5, boundary 20, groundY 1
	}
}