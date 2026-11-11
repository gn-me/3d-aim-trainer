/* Created by Alexander Pen
this is the trackingTarget file - it will contain all the tracking target classes and their functions. */

import * as THREE from 'three'; 
import { Target } from './target.js';

export class TrackingTarget extends Target {
	constructor(position, speed = 3, radius = 1, lifespan = 2 + Math.random() * 3) { // lifespan between 2 and 5 seconds
		super(position, radius);
		this.speed = speed; // units per second
		this.velocity = this.randomDirection().multiplyScalar(this.speed);
		this.targetVelocity = this.velocity.clone();

		this.changeDirectionInterval = Math.random() * 2; // seconds
		this.timeSinceLastChange = 0;
		this.smoothness = 0.08; // how quickly the target adjusts its velocity

		this.lifespan = lifespan; // seconds
		this.age = 0; // seconds
	}

	checkLifespan(delta) { // returns true if the target has exceeded its lifespan
		this.age += delta; // increment age by delta time
		return this.age >= this.lifespan;
	}

	randomDirection() { // generate a random unit vector
		const theta = Math.random() * 2 * Math.PI; // angle in the xy-plane
		const phi = Math.acos(2 * Math.random() - 1); // angle from the z-axis
		return new THREE.Vector3( // 
			Math.sin(phi) * Math.cos(theta),
			Math.sin(phi) * Math.sin(theta),
			Math.cos(phi)
		).normalize();
	}

	update(delta) { // update position based on velocity and change direction at intervals
		// Smoothly interpolate velocity
		this.velocity.lerp(this.targetVelocity, this.smoothness);

		// Update position based on velocity
		this.mesh.position.add(this.velocity.clone().multiplyScalar(delta));

		// Update time since last direction change
		this.timeSinceLastChange += delta;
		if (this.timeSinceLastChange >= this.changeDirectionInterval) {
			this.targetVelocity = this.randomDirection().multiplyScalar(this.speed);
			this.timeSinceLastChange = 0;
			this.changeDirectionInterval = Math.random() * 2; // reset interval
		}

		// bounce off boundaries
		const boundary = 20;
		let bounced = false;

		if (this.mesh.position.x <= -boundary || this.mesh.position.x >= boundary) { // bounce off walls
			this.velocity.x *= -1;
			this.targetVelocity.x *= -1;
			bounced = true;
		}
		if (this.mesh.position.y <= 1 || this.mesh.position.y >= boundary) { // bounce off floor and ceiling
			this.velocity.y *= -1;
			this.targetVelocity.y *= -1;
			bounced = true;
		}
		if (this.mesh.position.z <= -boundary || this.mesh.position.z >= boundary) { // bounce off walls
			this.velocity.z *= -1;
			this.targetVelocity.z *= -1;
			bounced = true;
		}
		
		// Clamp position to stay within boundaries
		this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -boundary, boundary);
		this.mesh.position.y = THREE.MathUtils.clamp(this.mesh.position.y, 1, boundary);
		this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, -boundary, boundary);

		// If bounced, reset time since last change to avoid immediate direction change
		if (bounced) {
    	this.timeSinceLastChange = 0;
		}
	}
}

export class EasySingularTrackingTarget extends TrackingTarget { 	// easy singular tracking target
	constructor(position) {
		super(position, 5, 1.0); // speed 5, radius 1.0
	}
}

export class MediumSingularTrackingTarget extends TrackingTarget { 	// medium singular tracking target
	constructor(position) {
		super(position, 7.5, 0.7); // speed 7.5, radius 0.7
	}
}

export class HardSingularTrackingTarget extends TrackingTarget { 	// hard singular tracking target
	constructor(position) {
		super(position, 10, 0.5); // speed 10, radius 0.5
	}
}

export class EasyMultipleTrackingTarget extends TrackingTarget {
	constructor(position) {
		super(position, 5, 1.0, 3 + Math.random() * 1); // speed 5, radius 1.0, lifespan 3-4 seconds
	}
}

export class MediumMultipleTrackingTarget extends TrackingTarget {
	constructor(position) {
		super(position, 7.5, 0.7, 2 + Math.random() * 2); // speed 7.5, radius 0.7, lifespan 2-4 seconds
	}
}

export class HardMultipleTrackingTarget extends TrackingTarget {
	constructor(position) {
		super(position, 10, 0.5, 1 + Math.random() * 3); // speed 10, radius 0.5, lifespan 1-4 seconds
	}
}